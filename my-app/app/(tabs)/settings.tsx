import { useState } from 'react';
import { Image } from 'expo-image';
import { View, Platform, StyleSheet, Pressable, TextInput, Settings } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import api from "../../functions/api.js";
import { Button } from '@react-navigation/elements';

// const hiNumberData = Array.from({ length: (200-125)+1 }, (_, i) => ({
//   label: `${i + 125}`,
//   value: i + 1,
// }));

// const loNumberData = Array.from({ length: (100-70)+1 }, (_, i) => ({
//   label: `${i + 70}`,
//   value: i + 1,
// }));

export default function TabTwoScreen() {
  // Default values for general alerts
  const [loValue, setLoValue] = useState(70);
  const loNumberData = Array.from({ length: 21 }, (_, i) => ({
    label: `${70 + i}`, // Display value
    value: 70 + i,      // Actual value
  }));
  const [urgentLoValue, setUrgentLoValue] = useState(50);
  const urgentLoNumberData = Array.from({ length: 41 }, (_, i) => ({
    label: `${50 + i}`, // Display value
    value: 50 + i,      // Actual value
  }));
  const [hiValue, setHiValue] = useState(150);
  const hiNumberData = Array.from({ length: 71 }, (_, i) => ({
    label: `${130 + i}`, // Display value
    value: 130 + i,      // Actual value
  }));
  const [urgentHiValue, setUrgentHiValue] = useState(200);
  const urgentHiNumberData = Array.from({ length: 71 }, (_, i) => ({
    label: `${180 + i}`, // Display value
    value: 180 + i,      // Actual value
  }));
  // Default values for night alerts
  const [loNightValue, setLoNightValue] = useState(70);
  const loNightNumberData = Array.from({ length: 41 }, (_, i) => ({
    label: `${50 + i}`, // Display value
    value: 50 + i,      // Actual value
  }));
  const [urgentLoNightValue, setUrgentLoNightValue] = useState(50);
  const urgentLoNightNumberData = Array.from({ length: 41 }, (_, i) => ({
    label: `${50 + i}`, // Display value
    value: 50 + i,      // Actual value
  }));
  const [hiNightValue, setHiNightValue] = useState(180);
  const hiNightNumberData = Array.from({ length: 71 }, (_, i) => ({
    label: `${130 + i}`, // Display value
    value: 130 + i,      // Actual value
  }));
  const [urgentHiNightValue, setUrgentHiNightValue] = useState(250);
  const urgentHiNightNumberData = Array.from({ length: 71 }, (_, i) => ({
    label: `${180 + i}`, // Display value
    value: 180 + i,      // Actual value
  }));

  interface SettingsData {
    patientId: number,
    lowThreshold: number,
    highThreshold: number,
    urgentHighThreshold: number,
    urgentLowThreshold: number,
    time: string
  }
  const [settingsId, setSettingsId] = useState(1);
  const [settingsLow, setSettingsLow] = useState(70);
  const [settingsUrgentLow, setSettingsUrgentLow] = useState(50);
  const [settingsHigh, setSettingsHigh] = useState(200);
  const [settingsUrgentHigh, setSettingsUrgentHigh] = useState(250);
  const settingsData: SettingsData = {
    patientId: settingsId,
    lowThreshold: settingsLow,
    highThreshold: settingsHigh,
    urgentHighThreshold: settingsUrgentHigh,
    urgentLowThreshold: settingsUrgentLow,
    time: "normal"
  }

  const [settingsNightLow, setSettingsNightLow] = useState(70);
  const [settingsUrgentNightLow, setSettingsUrgentNightLow] = useState(50);
  const [settingsNightHigh, setSettingsNightHigh] = useState(200);
  const [settingsUrgentNightHigh, setSettingsUrgentNightHigh] = useState(250);
  const settingsNightData: SettingsData = {
    patientId: settingsId,
    lowThreshold: settingsNightLow,
    highThreshold: settingsNightHigh,
    urgentHighThreshold: settingsUrgentNightHigh,
    urgentLowThreshold: settingsUrgentNightLow,
    time: "night"
  }

  const updateSettings = async (settingsData: any) => {
    try {
      const response = await fetch('https://t1dcaregiverapp.onrender.com/api/settings/updateSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });
      //console.log("Settings data sent to backend: ", settingsData)
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Post error:', error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={300}
          color="#808080"
          name="gear"
          style={styles.headerImage}
        />
      }
      headerHeight={0}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            paddingVertical: 16,
          }}>
          Settings
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">General Alerts</ThemedText>
        <View>
        <Button 
          onPress={() => {updateSettings(settingsData);}}>
          Save General Settings
        </Button>
      </View>
      </ThemedView>   
      <View style={styles.settingsBox}>
        <View>
          <ThemedText>
            Urgent Low Blood Sugar
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={urgentLoNumberData}
          labelField='label'
          valueField='value'
          value={urgentLoValue}
          autoScroll={false}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setUrgentLoValue(item.value);
            setSettingsUrgentLow(item.value);
          }}
        />
      </View>
      <View style={styles.settingsBox}>
        <View>
          <ThemedText>
            Low Blood Sugar
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={loNumberData}
          labelField='label'
          valueField='value'
          value={loValue}
          autoScroll={false}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setLoValue(item.value);
            setSettingsLow(item.value);
          }}
        />
      </View>
      <View style={styles.settingsBox}>
        <View>
          <ThemedText>
            High Blood Sugar
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={hiNumberData.reverse()}
          labelField='label'
          valueField='value'
          value={hiValue}
          autoScroll={false}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setHiValue(item.value);
            setSettingsHigh(item.value);
          }}
        />
      </View>  
      <View style={styles.settingsBox}>
        <View>
          <ThemedText>
            Urgent High Blood Sugar
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={urgentHiNumberData.reverse()}
          labelField='label'
          valueField='value'
          value={urgentHiValue}
          autoScroll={false}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setUrgentHiValue(item.value);
            setSettingsUrgentHigh(item.value);
          }}
        />
      </View>   

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Night Alerts</ThemedText>
        <Button 
          onPress={() => {updateSettings(settingsNightData);}}>
          Save Night Settings
        </Button>
      </ThemedView>
      <View style={styles.settingsBox}>
        <View>
          <ThemedText>
            Urgent Low Blood Sugar
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={urgentLoNightNumberData}
          labelField='label'
          valueField='value'
          value={urgentLoNightValue}
          autoScroll={false}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setUrgentLoNightValue(item.value);
            setSettingsUrgentNightLow(item.value);
          }}
        />
      </View>
      <View style={styles.settingsBox}>
        <View>
          <ThemedText>
            Low Blood Sugar
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={loNightNumberData}
          labelField='label'
          valueField='value'
          value={loNightValue}
          autoScroll={false}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setLoNightValue(item.value);
            setSettingsNightLow(item.value);
          }}
        />
      </View>
      <View style={styles.settingsBox}>
        <View>
          <ThemedText>
            High Blood Sugar
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={hiNightNumberData.reverse()}
          labelField='label'
          valueField='value'
          value={hiNightValue}
          autoScroll={false}
          dropdownPosition='top'
          inverted={false}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setHiNightValue(item.value);
            setSettingsNightHigh(item.value);
          }}
        />
      </View>
      <View style={styles.settingsBox}>
        <View>
          <ThemedText>
            Urgent High Blood Sugar
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={urgentHiNightNumberData}
          labelField='label'
          valueField='value'
          value={urgentHiNightValue}
          autoScroll={false}
          dropdownPosition='top'
          inverted={false}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setUrgentHiNightValue(item.value);
            setSettingsUrgentNightHigh(item.value);
          }}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsBox: {
    fontSize: 16,
    borderWidth: 1.2,
    borderColor: '#A9A9A9',
    borderRadius: 4,
    padding: 10,
  }, 
  input: {
    paddingVertical: 10,
  }, 
  text: {
    paddingTop: 8,
  },
  dropdown: {
    margin: 16,
      height: 50,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
  }
});
