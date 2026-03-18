import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, Pressable, ScrollView, Text, TextInput, View, StatusBar } from "react-native";
import { useStoryStore } from "@/store/useStoryStore";
import { ImagePreview } from "@/components/ImagePreview";
import { GenreSelector } from "@/components/GenreSelector";
import { STORY_LENGTHS } from "@/types";
import { storyService } from "@/services/storyService";
import { useUserStore } from "@/store/useUserStore";
import { toPublicError } from "@/utils/apiHelpers";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { Ionicons } from "@expo/vector-icons";

type RootNav = NativeStackNavigationProp<RootStackParamList>;

const LENGTH_LABELS: Record<number, { label: string; desc: string }> = {
  500: { label: "Short", desc: "~500 words" },
  1000: { label: "Medium", desc: "~1000 words" },
  2000: { label: "Long", desc: "~2000 words" },
};

export const CreateScreen = () => {
  const navigation = useNavigation<RootNav>();
  const user = useUserStore((state) => state.user);
  const {
    selectedImageUri,
    selectedGenre,
    selectedLength,
    setSelectedImageUri,
    setGenre,
    setLength,
    setGeneratedStory,
    setSceneDescription,
    setGenerating,
  } = useStoryStore();
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ideaText, setIdeaText] = useState("");

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow media access in settings.");
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 0.8,
        });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const generateStory = async () => {
    setErrorMessage("");
    if (!user || !selectedImageUri) {
      const msg = "Please sign in and choose a photo first.";
      setErrorMessage(msg);
      Alert.alert("Missing data", msg);
      return;
    }

    setBusy(true);
    setGenerating(true);
    navigation.navigate("Loading");
    try {
      const { aiResult, story } = await storyService.createStoryFromPhoto({
        userId: user.id,
        imageUri: selectedImageUri,
        genre: selectedGenre,
        length: selectedLength,
        ideaText: ideaText.trim() || undefined,
      });
      setGeneratedStory(aiResult.story);
      setSceneDescription(aiResult.sceneDescription);
      setGenerating(false);
      navigation.replace("StoryResult", {
        storyId: story.id,
        imageUrl: story.image_url,
      });
    } catch (error) {
      setGenerating(false);
      navigation.goBack();
      const msg = toPublicError(error);
      setErrorMessage(msg);
      Alert.alert("Generation failed", msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#080d1a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#080d1a" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#f1f5f9", letterSpacing: -0.5 }}>
          Photo to Story
        </Text>
        <Text style={{ color: "#64748b", fontSize: 14, marginTop: 4, marginBottom: 20 }}>
          Capture a moment, let AI craft the narrative.
        </Text>

        {errorMessage ? (
          <View style={{ marginBottom: 16, backgroundColor: "#450a0a", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#7f1d1d" }}>
            <Text style={{ color: "#fca5a5", fontSize: 13 }}>{errorMessage}</Text>
          </View>
        ) : null}

        <View
          style={{
            backgroundColor: "#0f172a",
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: "#1e293b",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", marginBottom: 12, letterSpacing: 1 }}>
            PHOTO
          </Text>
          <ImagePreview uri={selectedImageUri} label="" />

          <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            <Pressable
              onPress={() => pickImage(true)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: "#7c3aed",
                borderRadius: 14,
                paddingVertical: 13,
              }}
            >
              <Ionicons name="camera" size={18} color="#fff" />
              <Text style={{ fontWeight: "700", color: "#fff", fontSize: 14 }}>Camera</Text>
            </Pressable>
            <Pressable
              onPress={() => pickImage(false)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: "#1e293b",
                borderRadius: 14,
                paddingVertical: 13,
                borderWidth: 1,
                borderColor: "#334155",
              }}
            >
              <Ionicons name="images-outline" size={18} color="#94a3b8" />
              <Text style={{ fontWeight: "700", color: "#94a3b8", fontSize: 14 }}>Gallery</Text>
            </Pressable>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#0f172a",
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: "#1e293b",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#94a3b8",
              fontSize: 12,
              fontWeight: "700",
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            STORY IDEA (OPTIONAL)
          </Text>
          <TextInput
            value={ideaText}
            onChangeText={setIdeaText}
            multiline
            numberOfLines={4}
            placeholder="Ex: Main character is a brave child looking for a lost family treasure."
            placeholderTextColor="#64748b"
            style={{
              minHeight: 96,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#334155",
              backgroundColor: "#111827",
              color: "#e2e8f0",
              paddingHorizontal: 12,
              paddingVertical: 10,
              textAlignVertical: "top",
              fontSize: 14,
            }}
          />
          <Text style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>
            AI will combine your image details with this idea.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#0f172a",
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: "#1e293b",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", letterSpacing: 1 }}>
              GENRE
            </Text>
            <Pressable
              onPress={() => navigation.navigate("GenreSelection")}
              style={{
                backgroundColor: "#1e293b",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 5,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons name="settings-outline" size={12} color="#8b5cf6" />
              <Text style={{ color: "#8b5cf6", fontSize: 12, fontWeight: "600" }}>Full settings</Text>
            </Pressable>
          </View>
          <GenreSelector value={selectedGenre} onChange={setGenre} />

          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", marginTop: 20, marginBottom: 12, letterSpacing: 1 }}>
            LENGTH
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {STORY_LENGTHS.map((length) => {
              const meta = LENGTH_LABELS[length];
              const selected = selectedLength === length;
              return (
                <Pressable
                  key={length}
                  onPress={() => setLength(length)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 14,
                    alignItems: "center",
                    backgroundColor: selected ? "#4c1d95" : "#1e293b",
                    borderWidth: 1,
                    borderColor: selected ? "#7c3aed" : "#334155",
                  }}
                >
                  <Text style={{ fontWeight: "700", color: selected ? "#c4b5fd" : "#64748b", fontSize: 13 }}>
                    {meta?.label}
                  </Text>
                  <Text style={{ color: selected ? "#a78bfa" : "#475569", fontSize: 11, marginTop: 2 }}>
                    {meta?.desc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          disabled={!selectedImageUri || busy}
          onPress={generateStory}
          style={{
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            backgroundColor: !selectedImageUri || busy ? "#1e293b" : "#7c3aed",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Ionicons
            name={busy ? "hourglass-outline" : "sparkles"}
            size={20}
            color={!selectedImageUri || busy ? "#475569" : "#fff"}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: !selectedImageUri || busy ? "#475569" : "#fff",
            }}
          >
            {busy ? "Generating Story..." : "Generate Story"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};
