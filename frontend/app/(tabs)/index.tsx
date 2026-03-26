import { Text, View, Button } from 'react-native';
import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export default function HomeScreen() {
  const callBackend = async () => {
    try {
      const res = await axios.get(BASE_URL);
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Error connecting to backend");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Test Backend Connection</Text>
      <Button title="Call Backend" onPress={callBackend} />
    </View>
  );
}

console.log("BASE_URL:", BASE_URL);