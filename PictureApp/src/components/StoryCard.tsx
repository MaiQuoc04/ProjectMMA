import { Image, Pressable, Text, View } from "react-native";
import { StoryWithIllustration } from "@/types";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  item: StoryWithIllustration;
  onPress: () => void;
}

const GENRE_COLORS: Record<string, { bg: string; text: string }> = {
  Horror: { bg: "#450a0a", text: "#fca5a5" },
  Romance: { bg: "#500724", text: "#f9a8d4" },
  Comedy: { bg: "#451a03", text: "#fde68a" },
  Adventure: { bg: "#022c22", text: "#6ee7b7" },
  "Sci-Fi": { bg: "#0c1a4a", text: "#7dd3fc" },
  Mystery: { bg: "#2e1065", text: "#c4b5fd" },
};

export const StoryCard = ({ item, onPress }: Props) => {
  const genreColor = GENRE_COLORS[item.genre] ?? { bg: "#1e293b", text: "#94a3b8" };

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#1e293b",
        backgroundColor: "#0f172a",
        overflow: "hidden",
        marginBottom: 4,
      }}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={{ height: 170, width: "100%", backgroundColor: "#1e293b" }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            height: 80,
            backgroundColor: "#1e2235",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="book-outline" size={28} color="#334155" />
        </View>
      )}

      <View style={{ padding: 14, gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View
            style={{
              backgroundColor: genreColor.bg,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ color: genreColor.text, fontSize: 11, fontWeight: "700" }}>
              {item.genre}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {item.illustration?.image_url ? (
              <View
                style={{
                  backgroundColor: "#1e293b",
                  borderRadius: 8,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Ionicons name="brush" size={10} color="#8b5cf6" />
                <Text style={{ color: "#8b5cf6", fontSize: 10, fontWeight: "600" }}>Illustrated</Text>
              </View>
            ) : null}
            <Text style={{ color: "#475569", fontSize: 11 }}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text numberOfLines={3} style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 22 }}>
          {item.story_text}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="chevron-forward" size={12} color="#475569" />
          <Text style={{ color: "#475569", fontSize: 12 }}>Tap to read & edit</Text>
        </View>
      </View>
    </Pressable>
  );
};
