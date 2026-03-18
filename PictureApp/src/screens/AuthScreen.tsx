import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/useUserStore";
import { toPublicError } from "@/utils/apiHelpers";
import { Ionicons } from "@expo/vector-icons";

export const AuthScreen = () => {
  const signIn = useUserStore((state) => state.signIn);
  const signUp = useUserStore((state) => state.signUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
        Alert.alert("Account created", "You can now sign in.");
        setIsSignUp(false);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (error) {
      Alert.alert("Auth failed", toPublicError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#080d1a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#080d1a" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: 24, alignItems: "center" }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: "#7c3aed",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                shadowColor: "#8b5cf6",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <Ionicons name="sparkles" size={36} color="#ffffff" />
            </View>
            <Text style={{ fontSize: 32, fontWeight: "800", color: "#f1f5f9", letterSpacing: -0.5 }}>
              StorySnap
            </Text>
            <Text style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
              AI storytelling from photos & text
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#0f172a",
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: "#1e293b",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#1e293b",
                borderRadius: 14,
                padding: 4,
                marginBottom: 20,
              }}
            >
              <Pressable
                onPress={() => setIsSignUp(false)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: !isSignUp ? "#7c3aed" : "transparent",
                }}
              >
                <Text style={{ fontWeight: "700", color: !isSignUp ? "#fff" : "#64748b", fontSize: 14 }}>
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsSignUp(true)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: isSignUp ? "#7c3aed" : "transparent",
                }}
              >
                <Text style={{ fontWeight: "700", color: isSignUp ? "#fff" : "#64748b", fontSize: 14 }}>
                  Sign Up
                </Text>
              </Pressable>
            </View>

            <Text style={{ color: "#94a3b8", fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
              EMAIL
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1e293b",
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#334155",
                paddingHorizontal: 16,
                marginBottom: 16,
              }}
            >
              <Ionicons name="mail-outline" size={18} color="#475569" style={{ marginRight: 10 }} />
              <TextInput
                style={{
                  flex: 1,
                  height: 48,
                  paddingVertical: 0,
                  color: "#f1f5f9",
                  fontSize: 15,
                  textAlignVertical: "center",
                }}
                placeholder="you@example.com"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={{ color: "#94a3b8", fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
              PASSWORD
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1e293b",
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#334155",
                paddingHorizontal: 16,
                marginBottom: 20,
              }}
            >
              <Ionicons name="lock-closed-outline" size={18} color="#475569" style={{ marginRight: 10 }} />
              <TextInput
                style={{
                  flex: 1,
                  height: 48,
                  paddingVertical: 0,
                  color: "#f1f5f9",
                  fontSize: 15,
                  textAlignVertical: "center",
                }}
                placeholder="Your password"
                placeholderTextColor="#475569"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#475569" />
              </Pressable>
            </View>

            <Pressable
              onPress={submit}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#334155" : "#7c3aed",
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                shadowColor: "#7c3aed",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: loading ? 0 : 0.4,
                shadowRadius: 12,
                elevation: loading ? 0 : 6,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
