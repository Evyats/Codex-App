/** @jsxImportSource nativewind */
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useTheme } from 'react-native-paper';

import { Button, Card, CardContent, CardTitle, IconButton, Text, TextInput } from '../components/paper';
import { WeightEntry } from '../types';

type WeightTrackerScreenProps = {
  entries: WeightEntry[];
  selectedDate: Date;
  onChangeDate: (value: Date) => void;
  onAdd: (weight: number) => void;
};

function toFixedWeight(value: number) {
  return `${Math.round(value * 10) / 10}`;
}

export function WeightTrackerScreen({ entries, selectedDate, onChangeDate, onAdd }: WeightTrackerScreenProps) {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerBase, setDatePickerBase] = useState(new Date());
  const [weightInput, setWeightInput] = useState('');

  const chart = useMemo(() => {
    if (!entries.length) return null;

    const width = 320;
    const height = 220;
    const padding = { top: 12, right: 18, bottom: 36, left: 44 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const sorted = [...entries].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
    const baseTime = new Date(sorted[0].timestamp).getTime();
    const data = sorted.map((entry) => {
      const date = new Date(entry.timestamp);
      const xValue = (date.getTime() - baseTime) / (1000 * 60 * 60 * 24);
      return { ...entry, date, xValue };
    });

    const xs = data.map((d) => d.xValue);
    const ys = data.map((d) => d.weight);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys) - 0.5;
    const maxY = Math.max(...ys) + 0.5;

    const scaleX = (x: number) =>
      padding.left +
      (xs.length === 1 ? plotWidth / 2 : ((x - minX) / (maxX - minX || 1)) * plotWidth);
    const scaleY = (y: number) => padding.top + plotHeight - ((y - minY) / (maxY - minY || 1)) * plotHeight;

    const points = data.map((d) => ({
      x: scaleX(d.xValue),
      y: scaleY(d.weight),
      label: toFixedWeight(d.weight),
      dateLabel: `${d.date.getMonth() + 1}/${d.date.getDate()}`,
    }));

    const ticksY = [minY, (minY + maxY) / 2, maxY];

    const movingAverage = data.map((entry, index) => {
      const start = Math.max(0, index - 2);
      const slice = data.slice(start, index + 1);
      const avg = slice.reduce((sum, item) => sum + item.weight, 0) / slice.length;
      return { x: scaleX(entry.xValue), y: scaleY(avg) };
    });

    const sumX = data.reduce((sum, d) => sum + d.xValue, 0);
    const sumY = data.reduce((sum, d) => sum + d.weight, 0);
    const sumXX = data.reduce((sum, d) => sum + d.xValue * d.xValue, 0);
    const sumXY = data.reduce((sum, d) => sum + d.xValue * d.weight, 0);
    const n = data.length;
    const denom = n * sumXX - sumX * sumX;
    const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
    const intercept = denom === 0 ? sumY / n : (sumY - slope * sumX) / n;
    const trendStart = { x: scaleX(minX), y: scaleY(slope * minX + intercept) };
    const trendEnd = { x: scaleX(maxX), y: scaleY(slope * maxX + intercept) };

    return (
      <Svg width="100%" height={height}>
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
              <SvgText x={padding.left - 8} y={y + 4} fill={theme.colors.onSurface} fontSize="11" textAnchor="end">
                {toFixedWeight(t)}
              </SvgText>
            </React.Fragment>
          );
        })}

        <Polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          stroke={theme.colors.primary}
          strokeWidth={2}
          fill="none"
        />
        <Polyline
          points={movingAverage.map((p) => `${p.x},${p.y}`).join(' ')}
          stroke={theme.colors.secondary}
          strokeWidth={2}
          fill="none"
        />
        <Line
          x1={trendStart.x}
          y1={trendStart.y}
          x2={trendEnd.x}
          y2={trendEnd.y}
          stroke={theme.colors.outline}
          strokeWidth={2}
          strokeDasharray="6 6"
        />

        {points.map((p, idx) => (
          <React.Fragment key={`point-${idx}`}>
            <Circle cx={p.x} cy={p.y} r={6} fill={theme.colors.primary} />
            <SvgText x={p.x} y={height - padding.bottom + 20} fill={theme.colors.onSurface} fontSize="11" textAnchor="middle">
              {p.dateLabel}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    );
  }, [entries, theme.colors]);

  return (
    <ScrollView>
      <View className="px-6 py-8 flex flex-col gap-7">
        <Card className="rounded-[18px]" mode="elevated">
          <CardTitle title="Weight trend" subtitle="Track weight changes over time" />
          <CardContent>{chart ?? <Text variant="bodyMedium">Add an entry to see your trend.</Text>}</CardContent>
        </Card>

        <Card className="rounded-[18px]" mode="outlined">
          <CardTitle title="Add weight entry" />
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
                  label="Weight"
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="numeric"
                  className="flex-1"
                />
                <Button
                  mode="contained"
                  icon="plus"
                  disabled={!weightInput.trim().length}
                  onPress={() => {
                    const parsed = Number.parseFloat(weightInput);
                    if (Number.isNaN(parsed)) return;
                    onAdd(parsed);
                    setWeightInput('');
                  }}
                >
                  Add
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
    </ScrollView>
  );
}
