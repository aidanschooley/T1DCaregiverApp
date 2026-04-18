import { Link } from 'expo-router';
import { StyleSheet, FlatList, View, Text, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import localData from '@/testData/testPatientData.json';

export default function ModalScreen() {

  const patientData = localData.patients;

  const navigation = useNavigation();

  const handlePress = (clickedPatientID: number) => {
    // set patient as selected when clicked and unselect previous selected patient
    const selectedPatient = patientData.find(patient => patient.patientSelected === true);
    const clikedPatient = patientData.find(patient => +patient.patientId === clickedPatientID);
    if (selectedPatient && +selectedPatient.patientId !== clickedPatientID) {
      selectedPatient.patientSelected = false;
    }
    if (clikedPatient) {
      clikedPatient.patientSelected = true;
    }
    navigation.goBack();
    console.log("We did it! Patient ID: ", clickedPatientID);
  };

  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Select Patient</ThemedText>
      <FlatList 
        data={patientData}
        keyExtractor={(item) => item.patientId.toString()}
        renderItem={({ item }) => (
          <View>
            {item.patientSelected? (
              <Link href="/" dismissTo style={styles.selectedPatient}>
                <View>
                  <ThemedText type={'subtitle'}>{item.patientName}</ThemedText>
                  <ThemedText>{item.patientId}</ThemedText>
                </View>
              </Link>
            ) : (
              <Pressable 
              onPress={ () => handlePress(+item.patientId)} 
              style={styles.patient}>
                  <View>
                    <ThemedText type={'subtitle'}>{item.patientName}</ThemedText>
                    <ThemedText>{item.patientId}</ThemedText>
                  </View>
              </Pressable>
            )}
          </View>
        )}
      />

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
    flex: 1,  
    justifyContent: 'center', 
    alignItems: 'center'
  }, 
  patient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 20,
  }
});
