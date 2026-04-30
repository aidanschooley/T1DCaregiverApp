import { Image } from "expo-image";
import { useState, useEffect, useCallback } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import { G, Rect } from "react-native-svg";

import { LineChart } from "react-native-chart-kit";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { Link } from "expo-router";
import { Button } from "@react-navigation/elements";
import api from "../../functions/api.js";
import localData from "@/testData/testPatientData.json";
import useNotification from "../../src/notifications/useNotification.ts";
// import * as Notifications from "expo-notifications";

export default function HomeScreen() {
  const [currentBgData, setCurrentBgData] = useState([]);
  const [currentChartData, setCurrentChartData] = useState([]);
  //const [history, setHistory] = useState([]);

  useNotification();

  const fetchData = () => {
    api
      .get("dexcom/api/bg/")
      .then((response) => {
        setCurrentBgData(response.data.value);
        console.log("Glucose Data:", response.data.value);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const fetchChartData = () => {
    api
      .get("api/glucose/latest/")
      .then((response) => {
        //setHistory(response.data.history);
        // This gets the chart data from history and reverses it so that the most recent data is at the end of the array for the chart
        setCurrentChartData(response.data.history.map((item: { value: number; }) => item.value).reverse());
        console.log("Chart Data:", response.data.history.map((item: { value: number; }) => item.value).reverse());
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchChartData();

    const intervalId = setInterval(fetchData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    fetchChartData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const chartData = {
    labels: [
      "",
      "1hr 30min",
      "",
      "",
      "", // 1hr 15min
      "",
      "",
      "1hr",
      "", 
      "",
      "", // 45 min
      "",
      "",
      "30min",
      "",
      "",
      "", // 15 min
      "",
      "",
      "Now",
    ],
    datasets: [
      {
        data: [
          // Iterates through all history bg data 
          ...currentChartData, 
          // Adds current bg if needed
          // Number(currentBgData)
        ],
        color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
        withDots: true,
      },
      {
        data: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        withDots: false,
      }, // red line for low threshold
      {
        data: [180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180],
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
        withDots: false,
      }, // red line for high threshold
    ],
  };

  // useEffect(() => {
  //   const configureNotificationsAsync = async () => {
  //     const { granted } = await Notifications.requestPermissionsAsync();
  //     if (!granted) {
  //       return console.warn("⚠️ Notification Permissions not granted!");
  //     }

  //     Notifications.setNotificationHandler({
  //       handleNotification: async () => ({
  //         shouldPlaySound: true, // Play sound when notification is received
  //         shouldSetBadge: true, // Little red dot on app icon
  //         shouldShowBanner: true, // Appearing on screen
  //         shouldShowList: true, // Show in notification center (appears to show in center even when false?)
  //       }),
  //     });
  //   };
  //   configureNotificationsAsync();
  // }, []);

  // const sendNotification = () => {
  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "🧪 Test Notification!",
  //       body: "This is a test.",
  //       categoryIdentifier: "test-category",
  //     },
  //     trigger: {
  //       type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  //       seconds: 1,
  //     },
  //   });
  // };

  const patientData = localData.patients;
  return (
    <ScrollView
      style={styles.viewContainer}
      contentContainerStyle={{ gap: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.backContainer}>
        <Link href="/patient">
          <Link.Trigger>
            <ThemedText type="subtitle">
              {/*{
                    <IconSymbol
                      size={30}
                      color="#808080"
                      name="chevron.left"
                    />
                  }*/}
              {
                patientData.find((patient) => patient.patientSelected === true)
                  ?.patientName
              }
            </ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction
              title="Action"
              icon="cube"
              onPress={() => alert("Action pressed")}
            />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert("Share pressed")}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert("Delete pressed")}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>
      </ThemedView>

      <ThemedView>
        <View style={styles.bgCircle}>
          <ThemedText style={{ fontSize: 32 }}>{currentBgData}</ThemedText>
        </View>
      </ThemedView>
      <ThemedView style={styles.chart}>
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 60}
          height={Dimensions.get("window").width * 0.7}
          yAxisInterval={1} // optional, defaults to 1
          // yAxisSuffix=' mg/dL'
          fromNumber={250} //sets y axis range to 0-200 instead of lowest value to highest value
          fromZero //starts y axis at 0 instead of lowest value
          segments={5} //number of horizontal lines is segments+1
          withVerticalLines={true} // vertical lines
          withHorizontalLines={true} // horizontal lines
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            fillShadowGradientOpacity: 0,
            fillShadowGradient: "transparent",
            useShadowColorFromDataset: true,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "5", // size of dots
              strokeWidth: "0", // size of white border around dots
              stroke: "#ffffff",
            },
          }}
          onDataPointClick={(params) => {
            console.log({ params });
          }} //work on this
          bezier //makes line curvy
          style={{
            marginTop: 27,
            borderRadius: 16,
            paddingBottom: 0,
            marginBottom: 0,
          }}
        />
      </ThemedView>
      <ThemedView style={styles.suggestion}>
        <ThemedText>
          {/* This is just a temporary placeholder for until we get this logic running with specific preferences through the backend */}
          {suggestion(String(currentBgData))}
        </ThemedText>
        <ThemedView style={styles.buttons}>
          {/* Make custom button for styling purposes */}
          {/* Make these buttons not appear when bg is in normal range or if there is no suggestion */}
          <Button style={styles.button}>Accept</Button>
          <Button style={styles.button}>Reject</Button>
          {/* <Button style={styles.button} onPress={sendNotification}>Test</Button> */}
        </ThemedView>
      </ThemedView>
      <ThemedView>
        <ThemedText style={styles.text}>
          {/* This is a temporary placeholder */}
          You got this!
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    padding: 16,
    marginTop: 26,
    backgroundColor: "#fff",
  },
  backContainer: {
    gap: 8,
    marginBottom: 8,
    paddingTop: 16,
  },
  bgCircle: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    textAlign: "center",
    borderColor: "#808080",
    borderWidth: 2,
    borderRadius: 100,
    width: 150,
    height: 150,
  },
  chart: {
    borderColor: "#808080",
    borderWidth: 2,
    borderRadius: 6,
    padding: 0,
  },
  suggestion: {
    borderColor: "#808080",
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#fff",
    borderColor: "#c4c4c4",
    borderWidth: 1,
    color: "#000",
  },
  text: {
    borderColor: "#808080",
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
  },
});

// This is just a temporary placeholder for until we get this logic running with specific preferences through the backend
function suggestion(data: string) {
  const dataNum = Number(data);
  if (dataNum > 180) {
    return "Your blood glucose is high. Consider taking insulin or doing physical activity.";
  } else if (dataNum < 70) {
    return "Your blood glucose is low. Consider consuming carbohydrates.";
  } else {
    return "Your blood glucose is in the normal range. Keep up the good work!";
  }
}
