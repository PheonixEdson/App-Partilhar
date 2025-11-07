import React from "react";
import { Modal, View, StyleSheet, ViewProps } from "react-native";

const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => (
  <Modal
    transparent={true}
    visible={open}
    onRequestClose={() => onOpenChange(false)}
  >
    {children}
  </Modal>
);

const DialogContent = (props: ViewProps) => (
  <View style={styles.dialogOverlay}>
    <View {...props} style={[styles.dialogContent, props.style]} />
  </View>
);
const DialogHeader = (props: ViewProps) => <View {...props} style={[styles.dialogHeader, props.style]} />;
const DialogTitle = (props: ViewProps) => <View {...props} style={[styles.dialogTitle, props.style]} />;

const styles = StyleSheet.create({
  dialogOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dialogContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: "90%",
    maxHeight: "90%",
  },
  dialogHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dialogTitle: {},
});

export { Dialog, DialogContent, DialogHeader, DialogTitle };
