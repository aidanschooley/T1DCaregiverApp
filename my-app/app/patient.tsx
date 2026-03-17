import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Select Patient</ThemedText>
      <Link href="/" dismissTo style={styles.selectedPatient}>
        <ThemedText>Joe Smith</ThemedText>
      </Link>
      <Link href="/" dismissTo style={styles.patient}>
        <ThemedText>Mary Smith</ThemedText>
      </Link>

      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Back</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  link: {
    marginTop: 15,
    marginLeft: 20,
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
  },
  selectedPatient: {
    padding: 20,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 20,
  }, 
  patient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 20,
  }
});
