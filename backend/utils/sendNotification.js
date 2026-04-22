import Notification from "../models/Notification.js";

export const sendNotification = async (io, userId, notificationData) => {
  try {
    // Save notification to database
    const notification = await Notification.create({
      userId,
      ...notificationData,
    });

    // Send real-time notification via Socket.io
    io.to(userId.toString()).emit("notification", notification);

    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
