import messaging from "./firebaseConfig.js";

async function sendNotification(deviceToken, title, body, priority = "normal") {
  if (priority === "urgent") {
    const message = {
      notification: { title, body },
      token: deviceToken,
      android: {
        priority: "high",
        notification: {
          priority: "MAX",
          default_sound: true,
          default_vibrate_timings: true,
        },
      },
    };

    const response = await messaging.send(message);
    console.log("Sent:", response);
    console.log("Priority High")
  } else {
    const message = {
      notification: { title, body },
      token: deviceToken,
    };

    const response = await messaging.send(message);
    console.log("Sent:", response);
    console.log("Normal Priority")
  }
}

export default sendNotification;
