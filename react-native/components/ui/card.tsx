import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

const Card = (props: ViewProps) => <View {...props} style={[styles.card, props.style]} />;
const CardHeader = (props: ViewProps) => <View {...props} style={[styles.cardHeader, props.style]} />;
const CardTitle = (props: ViewProps) => <View {...props} style={[styles.cardTitle, props.style]} />;
const CardContent = (props: ViewProps) => <View {...props} style={[styles.cardContent, props.style]} />;

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cardTitle: {},
  cardContent: {
    padding: 16,
  },
});

export { Card, CardHeader, CardTitle, CardContent };
