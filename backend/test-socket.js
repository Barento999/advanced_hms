// Simple test to verify Socket.io is working
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected to server, socket ID:", socket.id);

  // Register a test user
  socket.emit("register", "test-user-123");
  console.log("Registered test user");
});

socket.on("notification", (data) => {
  console.log("🔔 Received notification:", data);
});

socket.on("connect_error", (error) => {
  console.error("❌ Connection error:", error);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Keep the script running
console.log("Socket test client started. Press Ctrl+C to exit.");
