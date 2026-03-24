import { useState } from 'react';
import { Image } from 'expo-image';
import { View, Platform, StyleSheet, Pressable, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const hiNumberData = Array.from({ length: (200-125)+1 }, (_, i) => ({
  label: `${i + 125}`,
  value: i + 125,
}));

const loNumberData = Array.from({ length: (100-70)+1 }, (_, i) => ({
  label: `${i + 70}`,
  value: i + 1,
}));

export default function TabTwoScreen() {
  const [value, setValue] = useState(1);

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
          <ThemedText style={styles.text}>Low Blood Sugar</ThemedText>
        </View>
        <View>
          <TextInput style={styles.input}>70</TextInput>
        </View>
      </View>   
      <View style={styles.settingsBox}>
        <View>
          <ThemedText style={styles.text}>High Blood Sugar</ThemedText>
        </View>
        <View>
          <TextInput style={styles.input}>180</TextInput>
        </View>
      </View>   

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Night Alerts</ThemedText>
      </ThemedView>
      <View style={styles.settingsBox}>
        <View>
          <ThemedText style={styles.text}>Low Blood Sugar</ThemedText>
        </View>
        <View>
          <TextInput style={styles.input}>70</TextInput>
        </View>
      </View>   
      <View style={styles.settingsBox}>
        <View>
          <ThemedText style={styles.text}>High Blood Sugar</ThemedText>
        </View>
        <View>
          <TextInput style={styles.input}>200</TextInput>
        </View>
      </View>   

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Test Dropdown </ThemedText>
      </ThemedView>
      <View>
        <View>
          <ThemedText>
            Low Blood Suagr
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={loNumberData}
          labelField='label'
          valueField='value'
          value={value}
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setValue(item.value);
          }}
        />
      </View>
      <View>
        <View>
          <ThemedText>
            High Blood Suagr
          </ThemedText>
        </View>
        <Dropdown
          style={styles.dropdown}
          data={hiNumberData}
          labelField='label'
          valueField='value'
          placeholderStyle={{ color: '#808080' }}
          selectedTextStyle={{ color: '#000000' }}
          onChange={item => {
            setValue(item.value);
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
  dropdownBox: {

  },
  settingsBox: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1.2,
    borderColor: '#A9A9A9',
    borderRadius: 4,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
