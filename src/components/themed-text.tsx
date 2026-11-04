import { Platform, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Tipo = 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';

export type ThemedTextProps = TextProps & {
  type?: Tipo;
  themeColor?: ThemeColor;
};

const TIPOS: Record<Tipo, string> = {
  default: 'text-[16px] leading-[24px] font-medium',
  title: 'text-[48px] leading-[52px] font-semibold',
  small: 'text-[14px] leading-[20px] font-medium',
  smallBold: 'text-[14px] leading-[20px] font-bold',
  subtitle: 'text-[32px] leading-[44px] font-semibold',
  link: 'text-[14px] leading-[30px]',
  linkPrimary: 'text-[14px] leading-[30px]',
  code: 'text-[12px]',
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color = type === 'linkPrimary' ? '#3c87f7' : theme[themeColor ?? 'text'];

  return (
    <Text
      className={TIPOS[type]}
      style={[
        { color },
        type === 'code' && {
          fontFamily: Fonts.mono,
          fontWeight: Platform.select({ android: 700 }) ?? 500,
        },
        style,
      ]}
      {...rest}
    />
  );
}
