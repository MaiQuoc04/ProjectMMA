import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  messages?: string[];
}

const defaultMessages = [
  "Analyzing image...",
  "Finding inspiration...",
  "Writing your story...",
  "Adding final touches...",
];

const PulseDot = ({ delay }: { delay: number }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);

  return (
    <Animated.View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#8b5cf6",
        opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
        transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.2] }) }],
      }}
    />
  );
};

export const LoadingAnimation = ({ messages = defaultMessages }: Props) => {
  const messageList = useMemo(() => messages, [messages]);
  const [index, setIndex] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 2400, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [rotateAnim]);

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setIndex((prev) => (prev + 1) % messageList.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [messageList, fadeAnim]);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        backgroundColor: "#0f172a",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#1e293b",
        paddingHorizontal: 32,
        paddingVertical: 32,
        width: "100%",
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
        <Animated.View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
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
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#1e293b",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="sparkles" size={22} color="#8b5cf6" />
        </View>
      </View>

      <Animated.Text
        style={{
          fontSize: 15,
          fontWeight: "600",
          color: "#94a3b8",
          opacity: fadeAnim,
          textAlign: "center",
        }}
      >
        {messageList[index]}
      </Animated.Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <PulseDot delay={0} />
        <PulseDot delay={170} />
        <PulseDot delay={340} />
      </View>
    </View>
  );
};
