import { useCallback, useEffect, useRef } from "react";
import { Pressable, Text, View, Animated, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { useStoryStore } from "@/store/useStoryStore";
import { Ionicons } from "@expo/vector-icons";

type RootNav = NativeStackNavigationProp<RootStackParamList>;

const PulseDot = ({ delay }: { delay: number }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);

  return (
    <Animated.View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#8b5cf6",
        opacity: anim,
        transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.2] }) }],
      }}
    />
  );
};

export const LoadingScreen = () => {
  const navigation = useNavigation<RootNav>();
  const isGenerating = useStoryStore((state) => state.isGenerating);
  const setGenerating = useStoryStore((state) => state.setGenerating);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [rotateAnim]);

  const goToCreate = useCallback(() => {
    const nav = navigation as unknown as {
      replace?: (route: string, params?: unknown) => void;
      navigate?: (route: string, params?: unknown) => void;
    };
    if (typeof nav.replace === "function") {
      nav.replace("MainTabs", { screen: "Create" });
      return;
    }
    if (typeof nav.navigate === "function") {
      nav.navigate("MainTabs", { screen: "Create" });
    }
  }, [navigation]);

  useEffect(() => {
    if (!isGenerating) {
      const timer = setTimeout(() => { goToCreate(); }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [goToCreate, isGenerating]);

  const cancel = () => {
    setGenerating(false);
    goToCreate();
  };

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const steps = ["Analyzing image", "Finding inspiration", "Crafting narrative", "Polishing prose"];

  return (
    <View style={{ flex: 1, backgroundColor: "#080d1a", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
      <StatusBar barStyle="light-content" backgroundColor="#080d1a" />

      <View style={{ marginBottom: 32, alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: "transparent",
            borderTopColor: "#8b5cf6",
            borderRightColor: "#a78bfa",
            transform: [{ rotate: spin }],
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: "#1e293b",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="sparkles" size={28} color="#8b5cf6" />
        </View>
      </View>

      <Text style={{ fontSize: 24, fontWeight: "800", color: "#f1f5f9", marginBottom: 8, letterSpacing: -0.5 }}>
        AI in Progress
      </Text>
      <Text style={{ color: "#64748b", fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 32 }}>
        Weaving your story from light and imagination...
      </Text>

      <View style={{ gap: 10, width: "100%", marginBottom: 40 }}>
        {steps.map((step, i) => (
          <View key={step} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "#1e293b",
                borderWidth: 1,
                borderColor: "#334155",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#475569", fontSize: 10, fontWeight: "700" }}>{i + 1}</Text>
            </View>
            <Text style={{ color: "#475569", fontSize: 14 }}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 32 }}>
        <PulseDot delay={0} />
        <PulseDot delay={200} />
        <PulseDot delay={400} />
      </View>

      {isGenerating ? (
        <Pressable
          onPress={cancel}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#1e293b",
            borderRadius: 14,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: "#334155",
          }}
        >
          <Ionicons name="close-circle-outline" size={16} color="#94a3b8" />
          <Text style={{ color: "#94a3b8", fontWeight: "600", fontSize: 14 }}>Cancel</Text>
        </Pressable>
      ) : null}
    </View>
  );
};
