import { useSession } from '@/provider/ctx';
import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';

export default function Index() {
  const { signOut } = useSession();
  const [loaded] = useFonts({
    font1: require('@/assets/fonts/font1.ttf'),
    font2: require('@/assets/fonts/font2.ttf'),
    font3: require('@/assets/fonts/font3.ttf'),
  });
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'font1', fontSize: 25, fontWeight: 'bold' }} className='mb-4'>
        ရေမော်တာဖွင့်ပြီးလျှင်ပြန်ပိတ််ရန် မမေ့ပါနှင့်။မ
      </Text>
      <Text style={{ fontFamily: 'font2', fontSize: 25, fontWeight: 'bold' }} className='mb-4'>
        ရေမော်တာဖွင့်ပြီးလျှင်ပြန်ပိတ််ရန် မမေ့ပါနှင့်။မ
      </Text>
      <Text style={{ fontFamily: 'font3', fontSize: 25, fontWeight: 'bold' }} className='mb-4'>
        ရေမော်တာဖွင့်ပြီးလျှင်ပြန်ပိတ််ရန် မမေ့ပါနှင့်။မ
      </Text>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
