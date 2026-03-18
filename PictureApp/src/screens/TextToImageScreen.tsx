import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View, StatusBar } from "react-native";
import { PromptInput } from "@/components/PromptInput";
import { ASPECT_RATIOS, IMAGE_STYLES } from "@/types";
import { useStoryStore } from "@/store/useStoryStore";
import { useUserStore } from "@/store/useUserStore";
import { storyService } from "@/services/storyService";
import { toPublicError } from "@/utils/apiHelpers";
import { Ionicons } from "@expo/vector-icons";

const STYLE_ICONS: Record<string, string> = {
  Realistic: "🌿",
  Anime: "⛩️",
  Watercolor: "🎨",
  "Oil painting": "🖼️",
  "Pixel art": "👾",
};

const RATIO_ICONS: Record<string, string> = {
  "1:1": "⬛",
  "4:3": "▬",
  "9:16": "▯",
};

export const TextToImageScreen = () => {
  const user = useUserStore((state) => state.user);
  const {
    textPrompt,
    selectedStyle,
    selectedAspectRatio,
    generatedImageUrl,
    setTextPrompt,
    setStyle,
    setAspectRatio,
    setGeneratedImageUrl,
  } = useStoryStore();
  const [busy, setBusy] = useState(false);
  const [revisedPrompt, setRevisedPrompt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const generate = async () => {
    setErrorMessage("");
    if (!user) {
      const msg = "Please sign in to generate and save images.";
      setErrorMessage(msg);
      Alert.alert("Sign in required", msg);
      return;
    }
    if (!textPrompt.trim()) {
      const msg = "Please enter a scene prompt first.";
      setErrorMessage(msg);
      Alert.alert("Prompt required", msg);
      return;
    }

    setBusy(true);
    try {
      const result = await storyService.textToImageAndSave({
        userId: user.id,
        prompt: textPrompt,
        style: selectedStyle,
        aspectRatio: selectedAspectRatio,
      });
      setGeneratedImageUrl(result.imageUrl);
      setRevisedPrompt(result.revisedPrompt);
    } catch (error) {
      const msg = toPublicError(error);
      setErrorMessage(msg);
      Alert.alert("Image generation failed", msg);
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "#1a0a3a",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#4c1d95",
            }}
          >
            <Ionicons name="color-wand" size={18} color="#a78bfa" />
          </View>
          <Text style={{ fontSize: 26, fontWeight: "800", color: "#f1f5f9", letterSpacing: -0.5 }}>
            Imagine
          </Text>
        </View>
        <Text style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
          Transform words into stunning AI visuals.
        </Text>

        {errorMessage ? (
          <View style={{ marginBottom: 14, backgroundColor: "#450a0a", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#7f1d1d" }}>
            <Text style={{ color: "#fca5a5", fontSize: 13 }}>{errorMessage}</Text>
          </View>
        ) : null}

        <PromptInput
          value={textPrompt}
          onChangeText={setTextPrompt}
          label="DESCRIBE YOUR VISION"
          placeholder="An ancient castle in fog at sunset, mist rolling through twisted oak trees..."
        />

        <View
          style={{
            backgroundColor: "#0f172a",
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: "#1e293b",
            marginTop: 14,
          }}
        >
          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", marginBottom: 14, letterSpacing: 1 }}>
            ART STYLE
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {IMAGE_STYLES.map((style) => {
              const selected = selectedStyle === style;
              return (
                <Pressable
                  key={style}
                  onPress={() => setStyle(style)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 14,
                    backgroundColor: selected ? "#4c1d95" : "#1e293b",
                    borderWidth: 1,
                    borderColor: selected ? "#7c3aed" : "#334155",
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{STYLE_ICONS[style] ?? "🎭"}</Text>
                  <Text style={{ color: selected ? "#c4b5fd" : "#64748b", fontWeight: "600", fontSize: 13 }}>
                    {style}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", marginBottom: 12, marginTop: 20, letterSpacing: 1 }}>
            ASPECT RATIO
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {ASPECT_RATIOS.map((ratio) => {
              const selected = selectedAspectRatio === ratio;
              return (
                <Pressable
                  key={ratio}
                  onPress={() => setAspectRatio(ratio)}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 12,
                    borderRadius: 14,
                    backgroundColor: selected ? "#4c1d95" : "#1e293b",
                    borderWidth: 1,
                    borderColor: selected ? "#7c3aed" : "#334155",
                    gap: 4,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{RATIO_ICONS[ratio] ?? "◻"}</Text>
                  <Text style={{ color: selected ? "#c4b5fd" : "#64748b", fontWeight: "600", fontSize: 13 }}>
                    {ratio}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={generate}
          disabled={busy}
          style={{
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
            marginTop: 16,
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            backgroundColor: busy ? "#1e293b" : "#7c3aed",
          }}
        >
          <Ionicons name={busy ? "hourglass-outline" : "color-wand"} size={20} color={busy ? "#475569" : "#fff"} />
          <Text style={{ fontSize: 16, fontWeight: "700", color: busy ? "#475569" : "#fff" }}>
            {busy ? "Generating..." : "Generate Image"}
          </Text>
        </Pressable>

        {revisedPrompt ? (
          <View
            style={{
              marginTop: 16,
              backgroundColor: "#0f172a",
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: "#1e293b",
              borderLeftWidth: 3,
              borderLeftColor: "#7c3aed",
            }}
          >
            <Text style={{ color: "#8b5cf6", fontSize: 11, fontWeight: "700", marginBottom: 6, letterSpacing: 1 }}>
              ✦ ENHANCED PROMPT
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 13, lineHeight: 20 }}>{revisedPrompt}</Text>
          </View>
        ) : null}

        {generatedImageUrl ? (
          <View
            style={{
              marginTop: 16,
              backgroundColor: "#0f172a",
              borderRadius: 20,
              padding: 14,
              borderWidth: 1,
              borderColor: "#1e293b",
              overflow: "hidden",
            }}
          >
            <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", marginBottom: 12, letterSpacing: 1 }}>
              RESULT
            </Text>
            <Image
              source={{ uri: generatedImageUrl }}
              style={{ width: "100%", height: 320, borderRadius: 14, backgroundColor: "#1e293b" }}
              resizeMode="cover"
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};
