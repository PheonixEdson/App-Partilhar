import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

const Input = (props: TextInputProps) => <TextInput {...props} style={[styles.input, props.style]} />;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
  },
});

export { Input };
