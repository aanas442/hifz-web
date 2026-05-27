import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "gold";
export type ButtonSize = "sm" | "md" | "lg";

interface Props {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  fullWidth = true,
}: Props) {
  const styleVariant = VARIANT_STYLES[variant];
  const styleSize = SIZE_STYLES[size];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styleVariant.container,
        styleSize.container,
        fullWidth && { alignSelf: "stretch" },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={styleVariant.text.color} />
      ) : (
        <View style={styles.row}>
          {typeof children === "string" ? (
            <Text style={[styles.text, styleVariant.text, styleSize.text]}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  text: { fontWeight: "600" },
});

const VARIANT_STYLES = {
  primary: {
    container: { backgroundColor: "#1B4332" },
    text: { color: "#FFFFFF" },
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "#1B4332",
    },
    text: { color: "#1B4332" },
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    text: { color: "#1B4332" },
  },
  danger: {
    container: { backgroundColor: "#8B1A1A" },
    text: { color: "#FFFFFF" },
  },
  gold: {
    container: { backgroundColor: "#C9A84C" },
    text: { color: "#1B4332" },
  },
} as const;

const SIZE_STYLES = {
  sm: { container: { paddingVertical: 8, paddingHorizontal: 14 }, text: { fontSize: 13 } },
  md: { container: { paddingVertical: 14, paddingHorizontal: 18 }, text: { fontSize: 15 } },
  lg: { container: { paddingVertical: 18, paddingHorizontal: 22 }, text: { fontSize: 17 } },
} as const;
