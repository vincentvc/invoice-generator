import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    fontSize: 8,
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
});

export function PdfWatermark() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Created with InvoiceForge</Text>
    </View>
  );
}
