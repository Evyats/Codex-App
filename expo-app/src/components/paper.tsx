/** @jsxImportSource nativewind */
import { cssInterop } from 'react-native-css-interop';
import {
  Button as PaperButton,
  Card as PaperCard,
  IconButton as PaperIconButton,
  Text as PaperText,
  TextInput as PaperTextInput,
} from 'react-native-paper';

export const Button = cssInterop(PaperButton, { className: 'style' });
export const Card = cssInterop(PaperCard, { className: 'style' });
export const CardActions = cssInterop(PaperCard.Actions, { className: 'style' });
export const CardContent = cssInterop(PaperCard.Content, { className: 'style' });
export const CardTitle = cssInterop(PaperCard.Title, { className: 'style' });
export const IconButton = cssInterop(PaperIconButton, { className: 'style' });
export const Text = cssInterop(PaperText, { className: 'style' });
export const TextInput = cssInterop(PaperTextInput, { className: 'style' });
