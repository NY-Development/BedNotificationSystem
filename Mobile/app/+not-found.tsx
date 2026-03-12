import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex flex-col">
        <Text className="m-8 items-center justify-center p-8">This screen doesn't exist.</Text>

        <Link href="/">
          <Text className="m-8 items-center justify-center p-8">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
