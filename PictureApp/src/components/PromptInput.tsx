import { Text, TextInput, View } from "react-native";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
}

export const PromptInput = ({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = true,
}: Props) => (
  <View
    style={{
      backgroundColor: "#0f172a",
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: "#1e293b",
    }}
  >
    {label ? (
      <Text style={{ marginBottom: 10, fontSize: 12, fontWeight: "700", color: "#64748b", letterSpacing: 1 }}>
        {label}
      </Text>
    ) : null}
    <TextInput
      style={{
        minHeight: 120,
        backgroundColor: "#1e293b",
        borderRadius: 14,
        padding: 16,
        color: "#e2e8f0",
        fontSize: 15,
        lineHeight: 24,
        textAlignVertical: "top",
        borderWidth: 1,
        borderColor: "#334155",
      }}
      multiline={multiline}
      value={value}
      placeholder={placeholder}
      placeholderTextColor="#475569"
      onChangeText={onChangeText}
      textAlignVertical="top"
    />
  </View>
);
