import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { Alert, FlatList, Image, Pressable, Text, View, StatusBar } from "react-native";
import { StoryCard } from "@/components/StoryCard";
import { RootStackParamList } from "@/navigation/types";
import { supabaseService } from "@/services/supabaseService";
import { useStoryStore } from "@/store/useStoryStore";
import { useUserStore } from "@/store/useUserStore";
import { GeneratedImage } from "@/types";
import { toPublicError } from "@/utils/apiHelpers";
import { Ionicons } from "@expo/vector-icons";

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export const LibraryScreen = () => {
  const navigation = useNavigation<RootNav>();
  const user = useUserStore((state) => state.user);
  const stories = useStoryStore((state) => state.libraryStories);
  const setStories = useStoryStore((state) => state.setLibraryStories);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [activeTab, setActiveTab] = useState<"stories" | "images">("stories");

  const load = useCallback(async () => {
    if (!user) return;
    const [storyData, imageData] = await Promise.all([
      supabaseService.getStoriesByUser(user.id),
      supabaseService.getGeneratedImagesByUser(user.id),
    ]);
    setStories(storyData);
    setGeneratedImages(imageData);
  }, [setStories, user]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onDelete = (storyId: string) => {
    Alert.alert("Delete story", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await supabaseService.deleteStory(storyId);
            await load();
          } catch (error) {
            Alert.alert("Delete failed", toPublicError(error));
          }
        },
      },
    ]);
  };

  const onDeleteGenerated = (id: string) => {
    Alert.alert("Delete image", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await supabaseService.deleteGeneratedImage(id);
            await load();
          } catch (error) {
            Alert.alert("Delete failed", toPublicError(error));
          }
        },
      },
    ]);
  };

  const TABS = [
    { key: "stories", label: "Stories", icon: "book", count: stories.length },
    { key: "images", label: "Images", icon: "images", count: generatedImages.length },
  ] as const;

  return (
    <View style={{ flex: 1, backgroundColor: "#080d1a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#080d1a" />

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#1e293b",
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#f1f5f9", letterSpacing: -0.5 }}>
          Library
        </Text>
        <Text style={{ color: "#64748b", fontSize: 14, marginTop: 2 }}>
          Your saved creations
        </Text>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: active ? "#4c1d95" : "#1e293b",
                  borderWidth: 1,
                  borderColor: active ? "#7c3aed" : "#334155",
                }}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={15}
                  color={active ? "#c4b5fd" : "#64748b"}
                />
                <Text style={{ fontWeight: "700", color: active ? "#c4b5fd" : "#64748b", fontSize: 14 }}>
                  {tab.label}
                </Text>
                <View
                  style={{
                    backgroundColor: active ? "#7c3aed" : "#334155",
                    borderRadius: 10,
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ color: active ? "#ede9fe" : "#64748b", fontSize: 11, fontWeight: "700" }}>
                    {tab.count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {activeTab === "stories" ? (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>
              <StoryCard
                item={item}
                onPress={() => navigation.navigate("StoryDetail", { story: item })}
              />
              <Pressable
                onPress={() => onDelete(item.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginTop: -8,
                  paddingVertical: 10,
                  backgroundColor: "#1a0a0a",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#450a0a",
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
              >
                <Ionicons name="trash-outline" size={14} color="#f87171" />
                <Text style={{ color: "#f87171", fontWeight: "600", fontSize: 13 }}>Delete Story</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ marginTop: 60, alignItems: "center", gap: 10 }}>
              <Ionicons name="book-outline" size={40} color="#334155" />
              <Text style={{ color: "#64748b", fontSize: 15 }}>No saved stories yet.</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={generatedImages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 16,
                backgroundColor: "#0f172a",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#1e293b",
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: item.image_url }}
                style={{ height: 220, width: "100%", backgroundColor: "#1e293b" }}
                resizeMode="cover"
              />
              <View style={{ padding: 14, gap: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <View style={{ backgroundColor: "#1e293b", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ color: "#94a3b8", fontSize: 11, fontWeight: "600" }}>{item.style}</Text>
                    </View>
                    <View style={{ backgroundColor: "#1e293b", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ color: "#94a3b8", fontSize: 11, fontWeight: "600" }}>{item.aspect_ratio}</Text>
                    </View>
                  </View>
                  <Text style={{ color: "#475569", fontSize: 11 }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text numberOfLines={2} style={{ color: "#94a3b8", fontSize: 13, lineHeight: 20 }}>
                  {item.prompt}
                </Text>
                <Pressable
                  onPress={() => onDeleteGenerated(item.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    paddingVertical: 10,
                    backgroundColor: "#1a0a0a",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#450a0a",
                  }}
                >
                  <Ionicons name="trash-outline" size={14} color="#f87171" />
                  <Text style={{ color: "#f87171", fontWeight: "600", fontSize: 13 }}>Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ marginTop: 60, alignItems: "center", gap: 10 }}>
              <Ionicons name="images-outline" size={40} color="#334155" />
              <Text style={{ color: "#64748b", fontSize: 15 }}>No generated images yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};
