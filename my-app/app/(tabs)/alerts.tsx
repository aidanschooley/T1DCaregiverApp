import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { ScrollView, RefreshControl } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useState, useCallback } from 'react';
import api from "../../functions/api.js";

export default function TabTwoScreen() {
  const [alertData, setAlertData] = useState([]);
  const [bgData, setBgData] = useState([]);

  const fetchAlertData = () => {
    api
      .get("api/glucose/1/")
      .then((response) => {
        setAlertData(response.data);
        //console.log("Alert Bg Data:", response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const [refreshing, setRefreshing] = useState(false);
  
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchAlertData();
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }, []);

  return (
    <ScrollView
      style={styles.viewContainer}
      contentContainerStyle={{ gap: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
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
      {alertData.map((item: { bg_value: string; id: string; created_at: string; }) => (
      <View key={item.id}>
        <ThemedView style={styles.generalAlertContainer}>
          <ThemedText type="subtitle"> Blood Sugar: {item.bg_value}</ThemedText>
          <ThemedText>TIme: {item.created_at}</ThemedText>
        </ThemedView>
      </View>
      ))}
      {/* <ThemedText type="subtitle" style={{ paddingHorizontal: 16 }}>Friday Mar 13</ThemedText> */}
      {/* <View>
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
      </View> */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    padding: 16,
    marginTop: 26,
    backgroundColor: "#fff",
  },
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
