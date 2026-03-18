import { Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  uri: string | null;
  label?: string;
}

export const ImagePreview = ({ uri, label }: Props) => {
  return (
    <View style={{ width: "100%" }}>
      {label ? (
        <Text style={{ marginBottom: 8, fontSize: 12, fontWeight: "700", color: "#64748b", letterSpacing: 1 }}>
          {label}
        </Text>
      ) : null}
      {uri ? (
        <Image
          source={{ uri }}
          style={{
            height: 220,
            width: "100%",
            borderRadius: 16,
            backgroundColor: "#1e293b",
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            height: 220,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            backgroundColor: "#1e293b",
            borderWidth: 2,
            borderColor: "#334155",
            borderStyle: "dashed",
            gap: 10,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: "#0f172a",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#334155",
            }}
          >
            <Ionicons name="image-outline" size={26} color="#475569" />
          </View>
          <Text style={{ color: "#475569", fontSize: 14, fontWeight: "500" }}>No photo selected</Text>
          <Text style={{ color: "#334155", fontSize: 12 }}>Tap Camera or Gallery below</Text>
        </View>
      )}
    </View>
  );
};
