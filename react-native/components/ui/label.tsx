import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

const Label = (props: TextProps) => <Text {...props} style={[styles.label, props.style]} />;

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});

export { Label };
