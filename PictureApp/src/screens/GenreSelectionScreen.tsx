import { Pressable, ScrollView, Text, View, StatusBar } from "react-native";
import { useStoryStore } from "@/store/useStoryStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { STORY_GENRES, StoryGenre } from "@/types";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "GenreSelection">;

const GENRE_META: Record<StoryGenre, { emoji: string; desc: string; color: string; bg: string }> = {
  Horror: { emoji: "👻", desc: "Dark & thrilling", color: "#fca5a5", bg: "#450a0a" },
  Romance: { emoji: "💖", desc: "Love & passion", color: "#f9a8d4", bg: "#500724" },
  Comedy: { emoji: "😂", desc: "Light & funny", color: "#fde68a", bg: "#451a03" },
  Adventure: { emoji: "🗺️", desc: "Explore & discover", color: "#6ee7b7", bg: "#022c22" },
  "Sci-Fi": { emoji: "🚀", desc: "Future & beyond", color: "#7dd3fc", bg: "#0c1a4a" },
  Mystery: { emoji: "🔍", desc: "Secrets & clues", color: "#c4b5fd", bg: "#2e1065" },
};

const LENGTH_META = [
  { value: 500 as const, label: "Short", desc: "Quick read", icon: "flash-outline" },
  { value: 1000 as const, label: "Medium", desc: "5-10 min read", icon: "time-outline" },
  { value: 2000 as const, label: "Long", desc: "Full story", icon: "book-outline" },
];

export const GenreSelectionScreen = ({ navigation }: Props) => {
  const { selectedGenre, selectedLength, setGenre, setLength } = useStoryStore();

  return (
    <View style={{ flex: 1, backgroundColor: "#080d1a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 14 }}>
          CHOOSE GENRE
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
          {STORY_GENRES.map((genre) => {
            const meta = GENRE_META[genre];
            const selected = selectedGenre === genre;
            return (
              <Pressable
                key={genre}
                onPress={() => setGenre(genre)}
                style={{
                  width: "47%",
                  padding: 16,
                  borderRadius: 18,
                  backgroundColor: selected ? meta.bg : "#0f172a",
                  borderWidth: 2,
                  borderColor: selected ? meta.color + "60" : "#1e293b",
                }}
              >
                <Text style={{ fontSize: 28, marginBottom: 8 }}>{meta.emoji}</Text>
                <Text style={{ fontWeight: "700", color: selected ? meta.color : "#94a3b8", fontSize: 15, marginBottom: 3 }}>
                  {genre}
                </Text>
                <Text style={{ color: selected ? meta.color + "aa" : "#475569", fontSize: 12 }}>
                  {meta.desc}
                </Text>
                {selected && (
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: meta.color,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="checkmark" size={12} color="#000" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 14 }}>
          STORY LENGTH
        </Text>

        <View style={{ gap: 10, marginBottom: 28 }}>
          {LENGTH_META.map((item) => {
            const selected = selectedLength === item.value;
            return (
              <Pressable
                key={item.value}
                onPress={() => setLength(item.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: selected ? "#1a0a3a" : "#0f172a",
                  borderWidth: 1,
                  borderColor: selected ? "#7c3aed" : "#1e293b",
                  gap: 14,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: selected ? "#4c1d95" : "#1e293b",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={item.icon as any} size={18} color={selected ? "#c4b5fd" : "#475569"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "700", color: selected ? "#c4b5fd" : "#94a3b8", fontSize: 15 }}>
                    {item.label}
                  </Text>
                  <Text style={{ color: selected ? "#a78bfa" : "#475569", fontSize: 12 }}>
                    {item.desc} · ~{item.value} words
                  </Text>
                </View>
                {selected && <Ionicons name="checkmark-circle" size={20} color="#7c3aed" />}
              </Pressable>
            );
          })}
        </View>

        <View
          style={{
            backgroundColor: "#0f172a",
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: "#1e293b",
            borderLeftWidth: 3,
            borderLeftColor: "#7c3aed",
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Ionicons name="information-circle-outline" size={18} color="#8b5cf6" />
          <Text style={{ color: "#64748b", fontSize: 13, flex: 1 }}>
            {GENRE_META[selectedGenre]?.emoji} {selectedGenre} · {selectedLength} words
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            backgroundColor: "#7c3aed",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={{ fontWeight: "700", color: "#fff", fontSize: 15 }}>Apply Settings</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};
