import { Pressable, Text, View } from "react-native";
import { STORY_GENRES, StoryGenre } from "@/types";

interface Props {
  value: StoryGenre;
  onChange: (genre: StoryGenre) => void;
}

const GENRE_EMOJI: Record<StoryGenre, string> = {
  Horror: "👻",
  Romance: "💖",
  Comedy: "😂",
  Adventure: "🗺️",
  "Sci-Fi": "🚀",
  Mystery: "🔍",
};

export const GenreSelector = ({ value, onChange }: Props) => {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
      {STORY_GENRES.map((genre) => {
        const selected = value === genre;
        return (
          <Pressable
            key={genre}
            onPress={() => onChange(genre)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 14,
              backgroundColor: selected ? "#4c1d95" : "#1e293b",
              borderWidth: 1,
              borderColor: selected ? "#7c3aed" : "#334155",
            }}
          >
            <Text style={{ fontSize: 14 }}>{GENRE_EMOJI[genre]}</Text>
            <Text
              style={{
                fontWeight: "600",
                color: selected ? "#c4b5fd" : "#64748b",
                fontSize: 13,
              }}
            >
              {genre}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
