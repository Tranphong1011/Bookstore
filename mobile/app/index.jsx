import { Text, View } from "react-native";
import { Image } from "expo-image"
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/favicon.png")}
        style={{ width: 200, height: 200 }}
        contentFit="contain"
        transition={1000}
      />
      
      <Link href="/auth/signup">Signup</Link>
      <Link href="/auth">Login</Link>
    </View>
  );
}
