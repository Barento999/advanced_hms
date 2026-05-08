import mongoose from "mongoose";
import dotenv from "dotenv";
import BlogPost from "../models/BlogPost.js";

dotenv.config({ path: './backend/.env' });

const restoreDeletedPost = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the deleted post
    const deletedPost = await BlogPost.findOne({ 
      title: "Understanding Your Digital Medical Records",
      deleted: true 
    });

    if (!deletedPost) {
      console.log('❌ No deleted post found with that title');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`\n📝 Found deleted post: "${deletedPost.title}"`);
    console.log(`   Status: ${deletedPost.status}`);
    console.log(`   Deleted: ${deletedPost.deleted}`);

    // Restore the post
    deletedPost.deleted = false;
    await deletedPost.save();

    console.log(`\n✅ Post restored successfully!`);
    console.log(`   Title: ${deletedPost.title}`);
    console.log(`   Status: ${deletedPost.status}`);
    console.log(`   Deleted: ${deletedPost.deleted}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error restoring post:", error);
    process.exit(1);
  }
};

restoreDeletedPost();
