import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View, StatusBar } from "react-native";
import { RootStackParamList } from "@/navigation/types";
import { supabaseService } from "@/services/supabaseService";
import { toPublicError } from "@/utils/apiHelpers";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "StoryDetail">;

export const StoryDetailScreen = ({ route }: Props) => {
  const { story } = route.params;
  const [editableText, setEditableText] = useState(story.story_text);
  const [editing, setEditing] = useState(false);

  const save = async () => {
    try {
      await supabaseService.updateStory(story.id, editableText);
      Alert.alert("Saved ✓", "Story updates were saved.");
      setEditing(false);
    } catch (error) {
      Alert.alert("Save failed", toPublicError(error));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#080d1a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: "#4c1d95",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ color: "#c4b5fd", fontSize: 12, fontWeight: "700" }}>
              {story.genre}
            </Text>
          </View>
          <Text style={{ color: "#475569", fontSize: 12 }}>
            {new Date(story.created_at).toLocaleString()}
          </Text>
        </View>

        {story.image_url ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: "#64748b", fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 10 }}>
              ORIGINAL PHOTO
            </Text>
            <Image
              source={{ uri: story.image_url }}
              style={{ height: 240, width: "100%", borderRadius: 20, backgroundColor: "#1e293b" }}
              resizeMode="cover"
            />
          </View>
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
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", letterSpacing: 1 }}>
              STORY
            </Text>
            <Pressable
              onPress={() => setEditing((e) => !e)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: editing ? "#4c1d95" : "#1e293b",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderWidth: 1,
                borderColor: editing ? "#7c3aed" : "#334155",
              }}
            >
              <Ionicons name={editing ? "checkmark" : "pencil-outline"} size={13} color={editing ? "#c4b5fd" : "#64748b"} />
              <Text style={{ color: editing ? "#c4b5fd" : "#64748b", fontSize: 12, fontWeight: "600" }}>
                {editing ? "Done" : "Edit"}
              </Text>
            </Pressable>
          </View>

          {editing ? (
            <TextInput
              multiline
              value={editableText}
              onChangeText={setEditableText}
              style={{
                minHeight: 240,
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
              textAlignVertical="top"
            />
          ) : (
            <Text style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 28 }}>
              {editableText}
            </Text>
          )}

          {editing && (
            <Pressable
              onPress={save}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 14,
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: "#7c3aed",
              }}
            >
              <Ionicons name="save-outline" size={16} color="#fff" />
              <Text style={{ fontWeight: "700", color: "#fff", fontSize: 14 }}>Save Changes</Text>
            </Pressable>
          )}
        </View>

        {story.illustration?.image_url ? (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: "#64748b", fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 10 }}>
              ILLUSTRATION
            </Text>
            <Image
              source={{ uri: story.illustration.image_url }}
              style={{ height: 280, width: "100%", borderRadius: 20, backgroundColor: "#1e293b" }}
              resizeMode="cover"
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};
