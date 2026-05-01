import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Health Tips",
        "Platform Updates",
        "Guides",
        "Medical News",
        "Wellness",
        "Technology",
        "Patient Stories",
        "Doctor Insights",
      ],
    },
    featuredImage: {
      type: String,
      default: null,
    },
    readTime: {
      type: Number, // in minutes
      default: 5,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
blogPostSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  }
  next();
});

// Set publishedAt date when status changes to published
blogPostSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Calculate read time based on content length (average reading speed: 200 words per minute)
blogPostSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

// Index for better query performance
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ featured: 1, status: 1 });

// Virtual for formatted published date
blogPostSchema.virtual("formattedPublishedDate").get(function () {
  if (!this.publishedAt) return null;
  return this.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Method to increment views
blogPostSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

// Static method to get published posts
blogPostSchema.statics.getPublished = function (filter = {}) {
  return this.find({
    ...filter,
    status: "published",
    deleted: false,
  }).sort({ publishedAt: -1 });
};

// Static method to get featured posts
blogPostSchema.statics.getFeatured = function (limit = 3) {
  return this.find({
    status: "published",
    featured: true,
    deleted: false,
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate("author", "name email");
};

// Static method to get posts by category
blogPostSchema.statics.getByCategory = function (category, limit = 10) {
  return this.find({
    category,
    status: "published",
    deleted: false,
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate("author", "name email");
};

// Static method to search posts
blogPostSchema.statics.search = function (searchTerm) {
  return this.find({
    status: "published",
    deleted: false,
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { content: { $regex: searchTerm, $options: "i" } },
      { tags: { $regex: searchTerm, $options: "i" } },
    ],
  })
    .sort({ publishedAt: -1 })
    .populate("author", "name email");
};

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
