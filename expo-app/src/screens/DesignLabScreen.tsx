/** @jsxImportSource nativewind */
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  CardTitle,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  ProgressBar,
  RadioButton,
  SegmentedButtons,
  Surface,
  Switch,
  Text,
  TextInput,
} from '../components/paper';

export function DesignLabScreen() {
  const [textValue, setTextValue] = useState('');
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState('daily');
  const [segment, setSegment] = useState('week');

  return (
    <ScrollView>
      <View className="px-6 py-8 flex flex-col gap-6">
        <Card className="rounded-[18px]" mode="outlined">
          <CardTitle title="Buttons" />
          <CardContent className="flex flex-col gap-4">
            <View className="flex-row flex-wrap gap-3">
              <Button mode="contained" icon="check">
                Primary
              </Button>
              <Button mode="contained-tonal" icon="star-outline">
                Tonal
              </Button>
              <Button mode="outlined" icon="pencil-outline">
                Outlined
              </Button>
              <Button mode="text">Text</Button>
              <IconButton icon="heart-outline" mode="contained" />
              <IconButton icon="bell-outline" mode="contained-tonal" />
            </View>
          </CardContent>
        </Card>

        <Card className="rounded-[18px]" mode="outlined">
          <CardTitle title="Inputs" />
          <CardContent className="flex flex-col gap-4">
            <TextInput
              mode="outlined"
              label="Outlined input"
              value={textValue}
              onChangeText={setTextValue}
              className="rounded-[18px]"
            />
            <TextInput mode="flat" label="Flat input" value={textValue} onChangeText={setTextValue} />
          </CardContent>
        </Card>

        <Card className="rounded-[18px]" mode="outlined">
          <CardTitle title="Toggles & Picks" />
          <CardContent className="flex flex-col gap-4">
            <View className="flex-row items-center justify-between">
              <Text>Switch</Text>
              <Switch value={switchOn} onValueChange={setSwitchOn} />
            </View>
            <View className="flex-row items-center gap-2">
              <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => setChecked((prev) => !prev)}
              />
              <Text>Checkbox item</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioButton
                value="daily"
                status={radio === 'daily' ? 'checked' : 'unchecked'}
                onPress={() => setRadio('daily')}
              />
              <Text>Daily</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioButton
                value="weekly"
                status={radio === 'weekly' ? 'checked' : 'unchecked'}
                onPress={() => setRadio('weekly')}
              />
              <Text>Weekly</Text>
            </View>
            <SegmentedButtons
              value={segment}
              onValueChange={setSegment}
              buttons={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="rounded-[18px]" mode="outlined">
          <CardTitle title="Chips & Badges" />
          <CardContent className="flex flex-col gap-4">
            <View className="flex-row flex-wrap items-center gap-3">
              <Chip icon="tag-outline">Default</Chip>
              <Chip selected icon="check">Selected</Chip>
              <Chip mode="outlined">Outlined</Chip>
              <Badge size={22}>3</Badge>
            </View>
          </CardContent>
        </Card>

        <Card className="rounded-[18px]" mode="outlined">
          <CardTitle title="Surfaces & Progress" />
          <CardContent className="flex flex-col gap-4">
            <Surface className="rounded-[18px] p-4" elevation={2}>
              <Text variant="titleMedium">Elevated surface</Text>
              <Text>Use surfaces to show depth.</Text>
            </Surface>
            <ProgressBar progress={0.6} />
            <Divider />
            <CardActions>
              <Button mode="contained">Action</Button>
              <Button mode="text">Cancel</Button>
            </CardActions>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
