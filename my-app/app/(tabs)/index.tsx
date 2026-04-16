import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { Link } from 'expo-router';
import { Button } from '@react-navigation/elements';
import fetchBg from '../../functions/fetchBg.js'

import api from '../../functions/api.js';
import localData from '@/testData/testPatientData.json';

export default function HomeScreen() {

  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/api/bg')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }, []);

  
  useEffect(() => {
    const configureNotificationsAsync = async () => {
      const { granted } = await Notifications.requestPermissionsAsync();
      if (!granted) {
        return console.warn("⚠️ Notification Permissions not granted!");
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true, // Play sound when notification is received
          shouldSetBadge: true, // Little red dot on app icon
          shouldShowBanner: true, // Appearing on screen
          shouldShowList: true, // Show in notification center (appears to show in center even when false?)
        }),
      });
    };
    configureNotificationsAsync();
  }, []);

  async function setInteractiveCategories() {
    await Notifications.setNotificationCategoryAsync('test-category', [
      {
        identifier: 'YES_ACTION',
        buttonTitle: 'Confirm',
      },
      {
        identifier: 'NO_ACTION',
        buttonTitle: 'Dismiss',
      },
    ]);
  }

  const sendNotification = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "🧪 Test Notification!",
        body: "This is a test.",
        categoryIdentifier: "test-category",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  };

  const patientData = localData.patients;
  const bgData = fetchBg();
  console.log(bgData);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerHeight={0}>
      <ThemedView style={styles.backContainer}>
        <Link href="/patient">
          <Link.Trigger>
            <ThemedText type="subtitle">{/*{
                    <IconSymbol
                      size={30}
                      color="#808080"
                      name="chevron.left"
                    />
                  }*/}
                  {patientData.find(patient => patient.patientSelected === true)?.patientName}
            </ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>
      </ThemedView>

      <ThemedView>
        <View style={styles.bgCircle}>
          <ThemedText style={{ fontSize: 32 }}>
            {/* {patientData.find(patient => patient.patientSelected === true)?.patientCurrentBG} */}
            {/*bgData*/} 100
          </ThemedText>
        </View>
      </ThemedView>
      <ThemedView style={styles.chart}>
        <ThemedText>
          Chart
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.suggestion}>
        <ThemedText >
        {data.records.value}
        </ThemedText>
        <ThemedView style={styles.buttons}>
          {/* Make custom button for styling purposes */}
          <Button style={styles.button}>Accept</Button>
          <Button style={styles.button}>Reject</Button>
          <Button style={styles.button} onPress={sendNotification}>Test</Button>
        </ThemedView>
      </ThemedView>
      <ThemedView>
        <ThemedText style={styles.text}>
          Current Encouragement
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  backContainer: {
    gap: 8,
    marginBottom: 8,
    paddingTop: 16,
  },
  bgCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    borderColor: '#808080',
    borderWidth: 2,
    borderRadius: 100,
    width: 150,
    height: 150,
  }, 
  chart: {
    borderColor: '#808080',
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
  }, 
  suggestion: {
    borderColor: '#808080',
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#fff',
    borderColor: '#c4c4c4',
    borderWidth: 1,
    color: '#000',
  },
  text: {
    borderColor: '#808080',
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
  }
});
