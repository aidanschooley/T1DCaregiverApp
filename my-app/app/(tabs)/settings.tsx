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

const hiNumberData = Array.from({ length: (200-125)+1 }, (_, i) => ({
  label: `${i + 125}`,
  value: i + 1,
}));

const loNumberData = Array.from({ length: (100-70)+1 }, (_, i) => ({
  label: `${i + 70}`,
  value: i + 1,
}));

export default function TabTwoScreen() {
  // Default values for general alerts
  const [loValue, setLoValue] = useState(1);
  const [hiValue, setHiValue] = useState(26);
  // Default values for night alerts
  const [loNightValue, setLoNightValue] = useState(1);
  const [hiNightValue, setHiNightValue] = useState(76);

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
  const [settingsTime, setSettingsTime] = useState('normal');
  const settingsData: SettingsData = {
    patientId: 1,
    lowThreshold: 70,
    highThreshold: 200,
    urgentHighThreshold: 250,
    urgentLowThreshold: 50,
    time: "normal"
  }

  const updateSettings = async (settingsData: any) => {
    try {
      const response = await fetch('api/settings/updateSettings', {
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
      </ThemedView>   
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
            //post to backend
            setSettingsLow(loValue)
            setSettingsTime("normal")
            updateSettings(settingsData);
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
          }}
        />
      </View>   

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Night Alerts</ThemedText>
      </ThemedView>
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
          value={loNightValue}
          autoScroll={false}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setLoNightValue(item.value);
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
          data={hiNumberData}
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
