import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const migrateEmailIndex = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Get existing indexes
    const indexes = await usersCollection.indexes();
    console.log(
      "Existing indexes:",
      indexes.map((idx) => ({ name: idx.name, key: idx.key })),
    );

    // Drop the old unique email index if it exists
    try {
      await usersCollection.dropIndex("email_1");
      console.log("Dropped old email_1 index");
    } catch (error) {
      if (error.code === 27) {
        console.log("Old email_1 index not found, skipping drop");
      } else {
        console.log("Error dropping old index:", error.message);
      }
    }

    // Create new partial unique index for email (only for non-deleted users)
    try {
      await usersCollection.createIndex(
        { email: 1 },
        {
          unique: true,
          partialFilterExpression: { isDeleted: false },
          name: "email_unique_non_deleted",
        },
      );
      console.log("Created new partial unique index: email_unique_non_deleted");
    } catch (error) {
      if (error.code === 85) {
        console.log("Index email_unique_non_deleted already exists");
      } else {
        console.log("Error creating new index:", error.message);
      }
    }

    // Verify the new index
    const newIndexes = await usersCollection.indexes();
    console.log(
      "Updated indexes:",
      newIndexes.map((idx) => ({
        name: idx.name,
        key: idx.key,
        unique: idx.unique,
        partialFilterExpression: idx.partialFilterExpression,
      })),
    );

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run migration
migrateEmailIndex();
