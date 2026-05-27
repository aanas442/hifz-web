import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

export function ArabicText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[styles.arabic, props.style]}
      // RN handles RTL per character; explicit hint helps
      // @ts-ignore
      writingDirection="rtl"
    />
  );
}

export function BnText(props: TextProps) {
  return <Text {...props} style={[styles.bn, props.style]} />;
}

const styles = StyleSheet.create({
  arabic: { fontFamily: "ScheherazadeNew", color: "#1A1A18" },
  bn: { fontFamily: "NotoSerifBengali", color: "#1A1A18" },
});
