/** @jsxImportSource nativewind */
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button, Card, IconButton, Text, TextInput, useTheme } from 'react-native-paper';

import { WakeEntry } from '../types';

type WakeTrackerScreenProps = {
  entries: WakeEntry[];
  selectedDate: Date;
  onChangeDate: (value: Date) => void;
  onAdd: () => void;
  onRemoveEntry: (id: string) => void;
};

function minutesToLabel(minutes: number) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function WakeTrackerScreen({
  entries,
  selectedDate,
  onChangeDate,
  onAdd,
  onRemoveEntry,
}: WakeTrackerScreenProps) {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

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
      dateLabel: d.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
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

        {/* X labels */}
        {points.map((p, idx) => (
          <SvgText
            key={`x-${idx}`}
            x={p.x}
            y={height - padding.bottom + 16}
            fill={theme.colors.onSurface}
            fontSize="11"
            textAnchor="middle"
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
                r={10}
                fill={isSelected ? theme.colors.primary : theme.colors.secondary}
                stroke={isSelected ? theme.colors.onPrimary : 'transparent'}
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
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, gap: 16 }}>
      <Card mode="elevated" style={{ borderRadius: 16 }}>
        <Card.Title title="Wake-up graph" subtitle="Y = time of wake-up, X = date" />
        <Card.Content>{chart}</Card.Content>
      </Card>

      <Card mode="outlined" style={{ borderRadius: 16 }}>
        <Card.Title title="Add wake-up time" />
        <Card.Content>
          <View className="space-y-3">
            <View className="flex-row items-center space-x-2">
              <TextInput
                mode="outlined"
                label="Date"
                value={selectedDate.toISOString().slice(0, 10)}
                editable={false}
                style={{ flex: 1 }}
              />
              <IconButton icon="calendar-month" mode="contained-tonal" onPress={() => setShowDatePicker(true)} />
            </View>
            <View className="flex-row items-center space-x-2">
              <TextInput
                mode="outlined"
                label="Time"
                value={minutesToLabel(selectedDate.getHours() * 60 + selectedDate.getMinutes())}
                editable={false}
                style={{ flex: 1 }}
              />
              <IconButton icon="clock-outline" mode="contained-tonal" onPress={() => setShowTimePicker(true)} />
            </View>
            <Button mode="contained" icon="plus" onPress={onAdd}>
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
            >
              Delete selected
            </Button>
          </View>
        </Card.Content>
      </Card>

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
