import { Image } from 'expo-image';
import { View, Platform, StyleSheet, Pressable, TextInput } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
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
  }
});
