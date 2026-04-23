import Notification from "../models/Notification.js";

export const sendNotification = async (io, userId, notificationData) => {
  try {
    // Save notification to database
    const notification = await Notification.create({
      userId,
      ...notificationData,
    });

    console.log(
      `✅ Notification saved for user ${userId}:`,
      notificationData.title,
    );

    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
