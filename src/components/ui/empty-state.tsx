import { Text, View } from 'react-native';

import { Brand } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { AppIcon } from './app-icon';

interface Props {
  icon: IconName;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: Props) {
  return (
    <View className="items-center gap-2 rounded-[22px] border border-brand-glass-border bg-[rgba(252,254,255,0.94)] px-5 py-8">
      <View className="mb-1 h-[62px] w-[62px] items-center justify-center rounded-full border border-brand-glass-border bg-brand-primary-light">
        <AppIcon name={icon} size={30} color={Brand.primary} />
      </View>
      <Text className="text-center text-[16px] font-extrabold text-brand-text">
        {title}
      </Text>
      <Text className="text-center text-[12px] leading-[18px] text-brand-muted">
        {message}
      </Text>
    </View>
  );
}
