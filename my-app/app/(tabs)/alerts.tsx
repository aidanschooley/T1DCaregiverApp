import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

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
      headerBackgroundColor={{ light: '#90EE90', dark: '#77DD77' }}
      headerHeight={0}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            paddingVertical: 16,
          }}>
          Alerts
        </ThemedText>
      </ThemedView>
      <ThemedText type="subtitle" style={{ paddingHorizontal: 16 }}>Friday Mar 13</ThemedText>
      <View>
        <ThemedView style={styles.generalAlertContainer}>
          <ThemedText type="subtitle">Low Blood Sugar: 68</ThemedText>
          <ThemedText>Eat carbs</ThemedText>
        </ThemedView>
      </View>
      <View>
        <ThemedView style={styles.generalAlertContainer}>
          <ThemedText type="subtitle">High Blood Sugar: 250</ThemedText>
          <ThemedText>Take insulin</ThemedText>
        </ThemedView>
      </View>
      <View>
        <ThemedView style={styles.nightAlertContainer}>
          <ThemedText type="subtitle">Low Blood Sugar: 68</ThemedText>
          <ThemedText>Eat carbs</ThemedText>
        </ThemedView>
      </View>

      <ThemedText type="subtitle" style={{ paddingHorizontal: 16 }}>Thursday Mar 12</ThemedText>
      <View>
        <ThemedView style={styles.generalAlertContainer}>
          <ThemedText type="subtitle">Low Blood Sugar: 68</ThemedText>
          <ThemedText>Eat carbs</ThemedText>
        </ThemedView>
      </View>
      <View>
        <ThemedView style={styles.generalAlertContainer}>
          <ThemedText type="subtitle">No Signal</ThemedText>
          <ThemedText>Check Dexcom</ThemedText>
        </ThemedView>
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
  alertContainer: {
    borderWidth: 1,
    padding: 16,
    flexDirection: 'column',
    gap: 8,
  }, 
  generalAlertContainer: {
    borderColor: '#c4c4c4',
    backgroundColor: '#f7f7f7',
    borderWidth: 2,
    borderRadius: 6,
    padding: 13,
    flexDirection: 'column',
    gap: 8,
  },
  nightAlertContainer: {
    borderColor: '#929292',
    backgroundColor: '#d7d7d7',
    borderWidth: 2,
    borderRadius: 6,
    padding: 13,
    flexDirection: 'column',
    gap: 8,
  },
});
