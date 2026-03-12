import { StyleSheet, TextInput, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'bgLevelSetting';
};

export function ThemedContainer({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'bgLevelSetting' ? styles.bgLevelSetting : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  bgLevelSetting: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1.2,
    borderColor: '#A9A9A9',
    borderRadius: 2,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
