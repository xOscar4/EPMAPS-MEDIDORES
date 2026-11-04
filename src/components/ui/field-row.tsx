import { Text, View } from 'react-native';

import { Brand } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { AppIcon } from './app-icon';

interface Props {
  label: string;
  value: string;
  icon?: IconName;
}

export function FieldRow({ label, value, icon }: Props) {
  return (
    <View className="flex-row items-center gap-3 py-[9px]">
      {icon ? (
        <View className="h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-brand-glass-border bg-brand-primary-light">
          <AppIcon name={icon} size={17} color={Brand.primary} />
        </View>
      ) : null}
      <View className="min-w-0 flex-1 gap-px">
        <Text className="text-[10px] font-bold uppercase tracking-[0.4px] text-brand-muted">
          {label}
        </Text>
        <Text className="text-[13px] font-bold text-brand-text">{value}</Text>
      </View>
    </View>
  );
}
