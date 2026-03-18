import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Share, Text, TextInput, View, StatusBar } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { useStoryStore } from "@/store/useStoryStore";
import { storyService } from "@/services/storyService";
import { supabaseService } from "@/services/supabaseService";
import { toPublicError } from "@/utils/apiHelpers";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "StoryResult">;

export const StoryResultScreen = ({ route, navigation }: Props) => {
  const {
    selectedGenre,
    selectedLength,
    generatedStory,
    setGeneratedStory,
  } = useStoryStore();
  const [localText, setLocalText] = useState(generatedStory);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setLocalText(generatedStory); }, [generatedStory]);

  const storyId = route.params?.storyId;
  const originalImageUrl = route.params?.imageUrl;

  const regenerate = async () => {
    if (!originalImageUrl || !storyId) return;
    setBusy(true);
    try {
      const regenerated = await storyService.regenerateStory({
        imageUrl: originalImageUrl,
        genre: selectedGenre,
        length: selectedLength,
      });
      setGeneratedStory(regenerated.story);
      setLocalText(regenerated.story);
      await supabaseService.updateStory(storyId, regenerated.story);
    } catch (error) {
      Alert.alert("Regenerate failed", toPublicError(error));
    } finally {
      setBusy(false);
    }
  };

  const saveEdits = async () => {
    if (!storyId) return;
    try {
      await supabaseService.updateStory(storyId, localText);
      setGeneratedStory(localText);
      Alert.alert("Saved ✓", "Your story has been updated.");
    } catch (error) {
      Alert.alert("Save failed", toPublicError(error));
    }
  };

  const shareStory = async () => {
    await Share.share({ message: localText });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#080d1a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {originalImageUrl ? (
          <Image
            source={{ uri: originalImageUrl }}
            style={{ height: 220, width: "100%", borderRadius: 20, backgroundColor: "#1e293b", marginBottom: 16 }}
            resizeMode="cover"
          />
        ) : null}

        <View
          style={{
            backgroundColor: "#0f172a",
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: "#1e293b",
            marginBottom: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", letterSpacing: 1 }}>
              YOUR STORY
            </Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <View style={{ backgroundColor: "#1e293b", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ color: "#64748b", fontSize: 11 }}>{selectedGenre}</Text>
              </View>
              <View style={{ backgroundColor: "#1e293b", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ color: "#64748b", fontSize: 11 }}>{selectedLength}w</Text>
              </View>
            </View>
          </View>
          <TextInput
            multiline
            value={localText}
            onChangeText={setLocalText}
            style={{
              minHeight: 200,
              backgroundColor: "#1e293b",
              borderRadius: 14,
              padding: 16,
              color: "#e2e8f0",
              fontSize: 15,
              lineHeight: 26,
              textAlignVertical: "top",
              borderWidth: 1,
              borderColor: "#334155",
            }}
            placeholderTextColor="#475569"
          />

          <View style={{ flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <Pressable
              onPress={regenerate}
              disabled={busy}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                flex: 1,
                justifyContent: "center",
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: busy ? "#1e293b" : "#4c1d95",
                borderWidth: 1,
                borderColor: busy ? "#334155" : "#7c3aed",
              }}
            >
              <Ionicons name="refresh" size={15} color={busy ? "#475569" : "#c4b5fd"} />
              <Text style={{ color: busy ? "#475569" : "#c4b5fd", fontWeight: "600", fontSize: 13 }}>
                Regenerate
              </Text>
            </Pressable>
            <Pressable
              onPress={saveEdits}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                flex: 1,
                justifyContent: "center",
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: "#1e293b",
                borderWidth: 1,
                borderColor: "#334155",
              }}
            >
              <Ionicons name="save-outline" size={15} color="#94a3b8" />
              <Text style={{ color: "#94a3b8", fontWeight: "600", fontSize: 13 }}>Save</Text>
            </Pressable>
            <Pressable
              onPress={shareStory}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                flex: 1,
                justifyContent: "center",
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: "#1e293b",
                borderWidth: 1,
                borderColor: "#334155",
              }}
            >
              <Ionicons name="share-outline" size={15} color="#94a3b8" />
              <Text style={{ color: "#94a3b8", fontWeight: "600", fontSize: 13 }}>Share</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate("MainTabs", { screen: "Library" })}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: "#1e293b",
            borderWidth: 1,
            borderColor: "#334155",
          }}
        >
          <Ionicons name="library-outline" size={18} color="#94a3b8" />
          <Text style={{ fontWeight: "700", color: "#94a3b8", fontSize: 14 }}>Go to Library</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};
