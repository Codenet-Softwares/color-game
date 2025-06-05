import { initializeApp, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import userSchema from "../models/user.model.js";

export default class NotificationService {
  static FIREBASE_APP = null;

  static initializeFirebase() {
    if (!getApps().length) {
      console.log("Initializing Firebase");
      this.FIREBASE_APP = initializeApp();
    } else {
      this.FIREBASE_APP = getApps()[0];
    }
  }

  async sendNotification(title, body, data = {}, fcm_token) {
    if (!fcm_token) return;

    const message = {
      notification: { title, body },
      data,
      token: fcm_token,
    };

    try {
      const response = await getMessaging(NotificationService.FIREBASE_APP).send(message);
      console.log("Successfully sent message:", response);
    } catch (error) {
      const code = error.code;
      if (
        code === "messaging/invalid-registration-token" ||
        code === "messaging/registration-token-not-registered" ||
        code === "messaging/invalid-argument"
      ) {
        console.log("Invalid token, deleting user FCM token");
        await this.deleteFcmToken(fcm_token);
      } else {
        console.error("Error sending FCM message:", error.message);
      }
    }
  }

  async deleteFcmToken(fcm_token) {
    try {
      const user = await userSchema.findOne({
        where: {
          fcm_token: fcm_token,
        },
      });

      if (!user) return;

      await user.update({ fcm_token: "" });
      console.log("Deleted FCM token for user:", user.id);
    } catch (err) {
      console.error("Error deleting FCM token:", err.message);
    }
  }
}
