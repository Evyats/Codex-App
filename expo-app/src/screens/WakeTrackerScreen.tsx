/** @jsxImportSource nativewind */
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useTheme } from 'react-native-paper';

import { Button, Card, CardContent, CardTitle, IconButton, TextInput } from '../components/paper';
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
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const selectedDot = theme.colors.primary;
  const unselectedDot = theme.colors.secondaryContainer ?? theme.colors.secondary;
  const selectedStroke = theme.colors.onPrimary;

  const graphData = useMemo(
    () =>
      entries.map((entry) => ({
        date: new Date(entry.timestamp),
        minutes: entry.minutes,
        label: minutesToLabel(entry.minutes),
      })),
    [entries]
  );

  const chart = useMemo(() => {
    if (!graphData.length) return null;

    const width = 320;
    const height = 220;
    const padding = { top: 12, right: 18, bottom: 40, left: 44 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const ys = graphData.map((d) => d.minutes);
    const minY = Math.max(0, Math.min(...ys) - 30);
    const maxY = Math.min(1440, Math.max(...ys) + 30);

    const xs = graphData.map((d) => Math.floor(d.date.getTime() / (1000 * 60 * 60 * 24))); // day buckets
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const scaleX = (x: number) =>
      padding.left +
      (xs.length === 1 ? plotWidth / 2 : ((x - minX) / (maxX - minX || 1)) * plotWidth);
    const scaleY = (y: number) => padding.top + plotHeight - ((y - minY) / (maxY - minY || 1)) * plotHeight;

    const points = graphData.map((d, idx) => ({
      x: scaleX(Math.floor(d.date.getTime() / (1000 * 60 * 60 * 24))),
      y: scaleY(d.minutes),
      label: d.label,
      dateLabel: `${d.date.getDate()}.${d.date.getMonth() + 1}`,
      dayOfWeek: d.date.getDay(),
      id: entries[idx].id,
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
  }, [graphData, theme.colors, entries, selectedEntryId]);

  return (
    <ScrollView>
      <View className="px-6 py-8 flex flex-col gap-7">
        <Card className="rounded-[18px]" mode="elevated">
          <CardTitle title="Wake-up graph" subtitle="Y = time of wake-up, X = date" />
          <CardContent>{chart}</CardContent>
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
                <IconButton icon="calendar-month" mode="contained-tonal" onPress={() => setShowDatePicker(true)} />
              </View>
              <View className="flex-row items-center gap-4">
                <TextInput
                  mode="outlined"
                  label="Time"
                  value={minutesToLabel(selectedDate.getHours() * 60 + selectedDate.getMinutes())}
                  editable={false}
                  className="flex-1"
                />
                <IconButton icon="clock-outline" mode="contained-tonal" onPress={() => setShowTimePicker(true)} />
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
        date={selectedDate}
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
        date={selectedDate}
        onConfirm={(date) => {
          const updated = new Date(selectedDate);
          updated.setHours(date.getHours(), date.getMinutes(), 0, 0);
          onChangeDate(updated);
          setShowTimePicker(false);
        }}
        onCancel={() => setShowTimePicker(false)}
      />
    </ScrollView>
  );
}
