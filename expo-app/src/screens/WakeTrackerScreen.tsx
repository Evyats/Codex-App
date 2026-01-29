/** @jsxImportSource nativewind */
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useTheme } from 'react-native-paper';

import { Button, Card, CardContent, CardTitle, IconButton, SegmentedButtons, TextInput } from '../components/paper';
import { WakeEntry } from '../types';

type WakeTrackerScreenProps = {
  entries: WakeEntry[];
  selectedDate: Date;
  onChangeDate: (value: Date) => void;
  onAdd: () => void;
  onRemoveEntry: (id: string) => void;
  onResetToSeed: () => void;
};

function minutesToLabel(minutes: number) {
  const rounded = Math.round(minutes);
  const h = Math.floor(rounded / 60)
    .toString()
    .padStart(2, '0');
  const m = (rounded % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type RangeSelection =
  | { kind: 'all' }
  | { kind: 'month'; year: number; monthIndex: number }
  | { kind: 'year'; year: number };

function buildMonthValue(year: number, monthIndex: number) {
  return `month-${year}-${monthIndex + 1}`;
}

function buildYearValue(year: number) {
  return `year-${year}`;
}

function parseRangeValue(value: string): RangeSelection {
  if (value === 'all') return { kind: 'all' };
  if (value.startsWith('month-')) {
    const parts = value.split('-');
    const year = Number.parseInt(parts[1] ?? '', 10);
    const month = Number.parseInt(parts[2] ?? '', 10);
    if (!Number.isNaN(year) && !Number.isNaN(month)) {
      return { kind: 'month', year, monthIndex: Math.max(0, month - 1) };
    }
  }
  if (value.startsWith('year-')) {
    const year = Number.parseInt(value.split('-')[1] ?? '', 10);
    if (!Number.isNaN(year)) {
      return { kind: 'year', year };
    }
  }
  return { kind: 'all' };
}

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function daysInYear(year: number) {
  return dayOfYear(new Date(year, 11, 31));
}

export function WakeTrackerScreen({
  entries,
  selectedDate,
  onChangeDate,
  onAdd,
  onRemoveEntry,
  onResetToSeed,
}: WakeTrackerScreenProps) {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMaxTimePicker, setShowMaxTimePicker] = useState(false);
  const [datePickerBase, setDatePickerBase] = useState(new Date());
  const [timePickerBase, setTimePickerBase] = useState(new Date());
  const [maxTimePickerBase, setMaxTimePickerBase] = useState(new Date());
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [maxYMinutes, setMaxYMinutes] = useState<number | null>(null);
  const [rangeValue, setRangeValue] = useState(() => {
    const today = new Date();
    return buildMonthValue(today.getFullYear(), today.getMonth());
  });
  const selectedDot = theme.colors.primary;
  const unselectedDot = theme.colors.secondaryContainer ?? theme.colors.secondary;
  const selectedStroke = theme.colors.onPrimary;

  const rangeButtons = useMemo(() => {
    const today = new Date();
    const earliestTimestamp = entries.length
      ? entries.reduce((min, entry) => Math.min(min, new Date(entry.timestamp).getTime()), today.getTime())
      : today.getTime();
    const start = new Date(earliestTimestamp);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), 1);

    const buttons = [{ value: 'all', label: 'All' }];
    const cursor = new Date(start);
    while (cursor <= end) {
      buttons.push({
        value: buildMonthValue(cursor.getFullYear(), cursor.getMonth()),
        label: MONTH_LABELS[cursor.getMonth()],
      });
      if (cursor.getMonth() === 11 && (cursor.getFullYear() < end.getFullYear() || cursor.getMonth() < end.getMonth())) {
        buttons.push({ value: buildYearValue(cursor.getFullYear() + 1), label: `${cursor.getFullYear() + 1}` });
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return buttons;
  }, [entries]);

  useEffect(() => {
    if (!rangeButtons.some((button) => button.value === rangeValue)) {
      const today = new Date();
      setRangeValue(buildMonthValue(today.getFullYear(), today.getMonth()));
    }
  }, [rangeButtons, rangeValue]);

  const range = useMemo(() => parseRangeValue(rangeValue), [rangeValue]);

  const filteredEntries = useMemo(() => {
    if (range.kind === 'all') return entries;
    if (range.kind === 'month') {
      return entries.filter((entry) => {
        const date = new Date(entry.timestamp);
        return date.getFullYear() === range.year && date.getMonth() === range.monthIndex;
      });
    }
    return entries.filter((entry) => new Date(entry.timestamp).getFullYear() === range.year);
  }, [entries, range]);

  const graphData = useMemo(
    () =>
      filteredEntries.map((entry) => {
        const date = new Date(entry.timestamp);
        const xValue =
          range.kind === 'month'
            ? Math.min(date.getDate(), 30)
            : range.kind === 'year'
              ? dayOfYear(date)
              : Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
        const dateLabel =
          range.kind === 'month' ? `${date.getDate()}` : `${date.getDate()}.${date.getMonth() + 1}`;
        return {
          date,
          minutes: entry.minutes,
          label: minutesToLabel(entry.minutes),
          xValue,
          dateLabel,
        };
      }),
    [filteredEntries, range]
  );

  const chart = useMemo(() => {
    if (!graphData.length) return null;

    const width = 320;
    const height = 220;
    const padding = { top: 12, right: 18, bottom: 40, left: 44 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const ys = graphData.map((d) => d.minutes);
    const baseMinY = Math.max(0, Math.min(...ys) - 30);
    const baseMaxY = Math.min(1440, Math.max(...ys) + 30);
    const maxY = maxYMinutes !== null ? Math.min(1440, Math.max(0, maxYMinutes)) : baseMaxY;
    const minY = Math.max(0, Math.min(baseMinY, maxY - 30));

    const xs = graphData.map((d) => d.xValue);
    const minX =
      range.kind === 'month'
        ? 1
        : range.kind === 'year'
          ? 1
          : Math.min(...xs);
    const maxX =
      range.kind === 'month'
        ? 30
        : range.kind === 'year'
          ? daysInYear(range.year)
          : Math.max(...xs);

    const scaleX = (x: number) =>
      padding.left +
      (xs.length === 1 ? plotWidth / 2 : ((x - minX) / (maxX - minX || 1)) * plotWidth);
    const scaleY = (y: number) => padding.top + plotHeight - ((y - minY) / (maxY - minY || 1)) * plotHeight;

    const points = graphData.map((d, idx) => ({
      x: scaleX(d.xValue),
      y: scaleY(maxYMinutes !== null ? Math.min(d.minutes, maxYMinutes) : d.minutes),
      label: d.label,
      dateLabel: d.dateLabel,
      dayOfWeek: d.date.getDay(),
      id: filteredEntries[idx]?.id ?? `${idx}`,
    }));

    const ticksY = [minY, (minY + maxY) / 2, maxY];

    return (
      <Svg width="100%" height={height}>
        {/* Y grid + labels */}
        {ticksY.map((t, idx) => {
          const y = scaleY(t);
          return (
            <React.Fragment key={`y-${idx}`}>
              <Line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke={theme.colors.outlineVariant}
                strokeDasharray="4 4"
              />
              <SvgText
                x={padding.left - 8}
                y={y + 4}
                fill={theme.colors.onSurface}
                fontSize="11"
                textAnchor="end"
              >
                {minutesToLabel(t)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Week separators (between Saturday and Sunday) */}
        {points.slice(1).map((p, idx) => {
          if (p.dayOfWeek !== 0) return null;
          const confirmPrev = points[idx];
          const x = (confirmPrev.x + p.x) / 2;
          return (
            <Line
              key={`week-${p.id}`}
              x1={x}
              x2={x}
              y1={padding.top}
              y2={height - padding.bottom}
              stroke={theme.colors.outlineVariant}
              strokeDasharray="3 6"
            />
          );
        })}

        {/* X labels */}
        {points.map((p, idx) => (
          <SvgText
            key={`x-${idx}`}
            x={p.x}
            y={height - padding.bottom + 22}
            fill={theme.colors.onSurface}
            fontSize="11"
            textAnchor="middle"
            transform={`rotate(90 ${p.x} ${height - padding.bottom + 22})`}
          >
            {p.dateLabel}
          </SvgText>
        ))}

        {/* Lines */}
        {points.slice(1).map((p, idx) => {
          const prev = points[idx];
          return (
            <Line
              key={`l-${idx}`}
              x1={prev.x}
              y1={prev.y}
              x2={p.x}
              y2={p.y}
              stroke={theme.colors.primary}
              strokeWidth={2}
            />
          );
        })}

        {/* Points */}
        {points.map((p) => {
          const isSelected = selectedEntryId === p.id;
          return (
            <React.Fragment key={p.id}>
              <Circle
                cx={p.x}
                cy={p.y}
                r={22}
                fill="rgba(0,0,0,0.0001)" // invisible but hit-testable
                onPress={() => setSelectedEntryId(p.id)}
              />
              <Circle
                cx={p.x}
                cy={p.y}
                r={8}
                fill={isSelected ? selectedDot : unselectedDot}
                stroke={isSelected ? selectedStroke : 'transparent'}
                strokeWidth={isSelected ? 2 : 0}
                onPress={() => setSelectedEntryId(p.id)}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    );
  }, [graphData, theme.colors, selectedEntryId, range, maxYMinutes, filteredEntries]);

  return (
    <ScrollView>
      <View className="px-6 py-8 flex flex-col gap-7">
        <Card className="rounded-[18px]" mode="elevated">
          <CardTitle title="Wake-up graph" subtitle="Y = time of wake-up, X = date" />
          <CardContent>{chart}</CardContent>
        </Card>

        <Card className="rounded-[18px]" mode="outlined">
          <CardContent className="flex flex-col gap-5">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <SegmentedButtons
                value={rangeValue}
                onValueChange={setRangeValue}
                buttons={rangeButtons}
                style={{ alignSelf: 'flex-start' }}
              />
            </ScrollView>

            <View className="flex-row items-center gap-3">
              <TextInput
                mode="outlined"
                label="Max Y time"
                value={maxYMinutes !== null ? minutesToLabel(maxYMinutes) : 'Auto'}
                editable={false}
                className="flex-1"
              />
              <IconButton
                icon="clock-outline"
                mode="contained-tonal"
                onPress={() => {
                  setMaxTimePickerBase(new Date());
                  setShowMaxTimePicker(true);
                }}
              />
              <IconButton
                icon="refresh"
                mode="contained-tonal"
                disabled={maxYMinutes === null}
                onPress={() => setMaxYMinutes(null)}
              />
            </View>
          </CardContent>
        </Card>

        <Card className="rounded-[18px]" mode="outlined">
          <CardTitle
            title="Add wake-up time"
            right={(props) => (
              <IconButton
                {...props}
                icon="refresh"
                accessibilityLabel="Reset wake-up data"
                onPress={() => {
                  Alert.alert(
                    'Reset wake-up data?',
                    'This will replace all entries with the December seed data.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Reset', style: 'destructive', onPress: onResetToSeed },
                    ]
                  );
                }}
              />
            )}
          />
          <CardContent>
            <View className="flex flex-col gap-6">
              <View className="flex-row items-center gap-4">
                <TextInput
                  mode="outlined"
                  label="Date"
                  value={selectedDate.toISOString().slice(0, 10)}
                  editable={false}
                  className="flex-1"
                />
                <IconButton
                  icon="calendar-month"
                  mode="contained-tonal"
                  onPress={() => {
                    setDatePickerBase(new Date());
                    setShowDatePicker(true);
                  }}
                />
              </View>
              <View className="flex-row items-center gap-4">
                <TextInput
                  mode="outlined"
                  label="Time"
                  value={minutesToLabel(selectedDate.getHours() * 60 + selectedDate.getMinutes())}
                  editable={false}
                  className="flex-1"
                />
                <IconButton
                  icon="clock-outline"
                  mode="contained-tonal"
                  onPress={() => {
                    setTimePickerBase(new Date());
                    setShowTimePicker(true);
                  }}
                />
              </View>
              <View className="flex-row gap-4">
                <Button mode="contained" icon="plus" onPress={onAdd} className="flex-1">
                  Add entry
                </Button>
                <Button
                  mode="contained-tonal"
                  icon="delete-outline"
                  disabled={!selectedEntryId}
                  onPress={() => {
                    if (selectedEntryId) {
                      onRemoveEntry(selectedEntryId);
                      setSelectedEntryId(null);
                    }
                  }}
                  className="flex-1"
                >
                  Delete selected
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={datePickerBase}
        onConfirm={(date) => {
          const updated = new Date(selectedDate);
          updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
          onChangeDate(updated);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        date={timePickerBase}
        onConfirm={(date) => {
          const updated = new Date(selectedDate);
          updated.setHours(date.getHours(), date.getMinutes(), 0, 0);
          onChangeDate(updated);
          setShowTimePicker(false);
        }}
        onCancel={() => setShowTimePicker(false)}
      />
      <DateTimePickerModal
        isVisible={showMaxTimePicker}
        mode="time"
        date={maxTimePickerBase}
        onConfirm={(date) => {
          setMaxYMinutes(date.getHours() * 60 + date.getMinutes());
          setShowMaxTimePicker(false);
        }}
        onCancel={() => setShowMaxTimePicker(false)}
      />
    </ScrollView>
  );
}
