import { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View, StatusBar, RefreshControl } from "react-native";
import { supabaseService } from "@/services/supabaseService";
import { CommunityItem } from "@/types";
import { toPublicError } from "@/utils/apiHelpers";
import { Ionicons } from "@expo/vector-icons";

export const HomeScreen = () => {
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(async () => {
    setRefreshing(true);
    setErrorMessage("");
    try {
      const items = await supabaseService.getCommunityFeed();
      setCommunityItems(items);
    } catch (error) {
      setErrorMessage(toPublicError(error));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  const typeColor = (type: string) =>
    type === "story" ? { bg: "#4c1d95", text: "#c4b5fd" } : { bg: "#1a3a2e", text: "#6ee7b7" };

  return (
    <View style={{ flex: 1, backgroundColor: "#080d1a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#080d1a" />
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 16,
          backgroundColor: "#080d1a",
          borderBottomWidth: 1,
          borderBottomColor: "#1e293b",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#f1f5f9", letterSpacing: -0.5 }}>
              Explore
            </Text>
            <Text style={{ color: "#64748b", fontSize: 14, marginTop: 2 }}>
              Community stories & creations
            </Text>
          </View>
          <Pressable
            onPress={loadFeed}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "#1e293b",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="refresh" size={20} color="#8b5cf6" />
          </Pressable>
        </View>
      </View>

      {errorMessage ? (
        <View style={{ margin: 16, backgroundColor: "#450a0a", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#7f1d1d" }}>
          <Text style={{ color: "#fca5a5", fontSize: 14 }}>{errorMessage}</Text>
        </View>
      ) : null}

      <FlatList
        data={communityItems}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadFeed}
            tintColor="#8b5cf6"
            colors={["#8b5cf6"]}
          />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
        renderItem={({ item }) => {
          const colors = typeColor(item.type);
          return (
            <View
              style={{
                marginBottom: 16,
                borderRadius: 20,
                backgroundColor: "#0f172a",
                borderWidth: 1,
                borderColor: "#1e293b",
                overflow: "hidden",
              }}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ height: 200, width: "100%", backgroundColor: "#1e293b" }}
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

              <View style={{ padding: 16, gap: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View
                    style={{
                      backgroundColor: colors.bg,
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                    }}
                  >
                    <Text style={{ color: colors.text, fontSize: 11, fontWeight: "700" }}>
                      {item.type === "story" ? "✦ STORY" : "◈ AI IMAGE"}
                    </Text>
                  </View>
                  <Text style={{ color: "#475569", fontSize: 11 }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <Text style={{ color: "#f1f5f9", fontWeight: "700", fontSize: 16 }}>
                  {item.title}
                </Text>
                <Text style={{ color: "#64748b", fontSize: 12 }}>{item.subtitle}</Text>
                <Text numberOfLines={3} style={{ color: "#94a3b8", fontSize: 14, lineHeight: 22 }}>
                  {item.body}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          !refreshing ? (
            <View style={{ marginTop: 80, alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: "#1e293b",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="telescope-outline" size={32} color="#334155" />
              </View>
              <Text style={{ color: "#64748b", fontSize: 15 }}>No community content yet.</Text>
              <Text style={{ color: "#475569", fontSize: 13 }}>Be the first to create a story!</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};
