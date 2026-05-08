import mongoose from "mongoose";
import dotenv from "dotenv";
import BlogPost from "../models/BlogPost.js";

dotenv.config({ path: './backend/.env' });

const checkBlogPosts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all posts including deleted ones
    const allPosts = await BlogPost.find({}).select('title status deleted author');
    
    console.log(`\n📊 Total posts in database: ${allPosts.length}\n`);
    
    allPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Deleted: ${post.deleted}`);
      console.log(`   Author: ${post.author || 'No author'}`);
      console.log('');
    });

    // Count by status
    const published = allPosts.filter(p => p.status === 'published' && !p.deleted).length;
    const draft = allPosts.filter(p => p.status === 'draft' && !p.deleted).length;
    const archived = allPosts.filter(p => p.status === 'archived' && !p.deleted).length;
    const deleted = allPosts.filter(p => p.deleted).length;

    console.log('\n📈 Summary:');
    console.log(`   Published (not deleted): ${published}`);
    console.log(`   Draft (not deleted): ${draft}`);
    console.log(`   Archived (not deleted): ${archived}`);
    console.log(`   Deleted: ${deleted}`);
    console.log(`   Total visible in admin: ${published + draft + archived}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error checking blog posts:", error);
    process.exit(1);
  }
};

checkBlogPosts();
