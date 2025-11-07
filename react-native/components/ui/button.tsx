import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewProps } from "react-native";

interface ButtonProps extends ViewProps {
  variant?: "outline" | "default";
  size?: "icon" | "default";
  children: React.ReactNode;
}

const Button = ({ variant = "default", size = "default", children, ...props }: ButtonProps) => {
  const textStyle = variant === "outline" ? styles.outlineText : styles.defaultText;
  return (
    <TouchableOpacity {...props} style={[styles.button, styles[variant], size === "icon" && styles.icon]}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  default: {
    backgroundColor: "#007AFF",
  },
  outline: {
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  icon: {
    width: 40,
    height: 40,
    padding: 0,
  },
  defaultText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#007AFF",
  },
});

export { Button };
