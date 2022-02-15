import { WebView } from "react-native-webview";

export default function SongPreview({ route }) {
  const params = route.params;
  return (
    <WebView source={{ uri: params.previewURL }} />
  );
}