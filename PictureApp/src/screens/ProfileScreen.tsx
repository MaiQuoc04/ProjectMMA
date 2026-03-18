import { Alert, Pressable, Text, View, StatusBar, Platform } from "react-native";
import { useUserStore } from "@/store/useUserStore";
import { toPublicError } from "@/utils/apiHelpers";
import { Ionicons } from "@expo/vector-icons";

export const ProfileScreen = () => {
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);

  const performSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Sign out failed", toPublicError(error));
    }
  };

  const onSignOut = async () => {
    if (Platform.OS === "web") {
      const shouldSignOut = typeof window !== "undefined" ? window.confirm("Are you sure you want to sign out?") : true;
      if (shouldSignOut) {
        await performSignOut();
      }
      return;
    }

    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: performSignOut,
      },
    ]);
  };

  const emailInitial = user?.email?.charAt(0).toUpperCase() ?? "?";
  const email = user?.email ?? "Unknown user";

  const menuItems = [
    { icon: "mail-outline", label: "Email", value: email, accent: false },
    { icon: "shield-checkmark-outline", label: "Account Type", value: "Free Plan", accent: false },
    { icon: "time-outline", label: "Member Since", value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—", accent: false },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#080d1a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#080d1a" />

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 28,
          borderBottomWidth: 1,
          borderBottomColor: "#1e293b",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#4c1d95",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: "#7c3aed",
            marginBottom: 14,
            shadowColor: "#7c3aed",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 32, fontWeight: "800", color: "#ede9fe" }}>
            {emailInitial}
          </Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#f1f5f9" }}>
          {email.split("@")[0]}
        </Text>
        <Text style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{email}</Text>

        <View
          style={{
            marginTop: 10,
            backgroundColor: "#1a1a2e",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: "#4c1d95",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Ionicons name="sparkles" size={12} color="#a78bfa" />
          <Text style={{ color: "#a78bfa", fontSize: 12, fontWeight: "600" }}>StorySnap Member</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
        <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 12 }}>
          ACCOUNT
        </Text>
        <View
          style={{
            backgroundColor: "#0f172a",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#1e293b",
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          {menuItems.map((item, index) => (
            <View
              key={item.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: "#1e293b",
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: "#1e293b",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name={item.icon as any} size={16} color="#8b5cf6" />
              </View>
              <Text style={{ color: "#94a3b8", fontSize: 14, flex: 1 }}>{item.label}</Text>
              <Text style={{ color: "#64748b", fontSize: 13 }} numberOfLines={1}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={onSignOut}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: "#1a0a0a",
            borderRadius: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: "#450a0a",
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#f87171" />
          <Text style={{ color: "#f87171", fontWeight: "700", fontSize: 15 }}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
};
