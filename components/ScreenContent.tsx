// components/ScreenContent.tsx
import { View, Text } from 'react-native';

export function ScreenContent({
  title,
  path,
  children,
}: {
  title: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1">
      <Text className="text-3xl text-red-500 px-6 mb-2">{path}</Text>
      <Text className="text-2xl font-bold px-6 mb-4">{title}</Text>
      {children}
    </View>
  );
}