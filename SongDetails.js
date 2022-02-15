import { WebView } from "react-native-webview";

export default function SongDetails({ route }) {
  const params = route.params;
  return (
    <WebView source={{ uri: params.externalURL }} />
  );
}