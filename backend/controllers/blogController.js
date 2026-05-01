import BlogPost from "../models/BlogPost.js";

// @desc    Get all published blog posts with pagination
// @route   GET /api/blog/posts
// @access  Public
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = { status: "published", deleted: false };

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Search if search term provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email")
      .select("-content"); // Exclude full content for list view

    const total = await BlogPost.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog posts",
      error: error.message,
    });
  }
};

// @desc    Get single blog post by ID or slug
// @route   GET /api/blog/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let post = await BlogPost.findOne({
      $or: [{ _id: id }, { slug: id }],
      status: "published",
      deleted: false,
    }).populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Increment views
    await post.incrementViews();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog post",
      error: error.message,
    });
  }
};

// @desc    Get featured blog posts for landing page
// @route   GET /api/blog/featured
// @access  Public
export const getFeaturedPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const posts = await BlogPost.getFeatured(limit);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured posts",
      error: error.message,
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/blog/posts
// @access  Private/Admin
export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      category,
      featuredImage,
      tags,
      status,
      featured,
    } = req.body;

    // Validate required fields
    if (!title || !description || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, content, and category",
      });
    }

    const post = await BlogPost.create({
      title,
      description,
      content,
      author: req.user._id,
      category,
      featuredImage,
      tags: tags || [],
      status: status || "draft",
      featured: featured || false,
    });

    const populatedPost = await BlogPost.findById(post._id).populate(
      "author",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: populatedPost,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog post",
      error: error.message,
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/posts/:id
// @access  Private/Admin
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      content,
      category,
      featuredImage,
      tags,
      status,
      featured,
    } = req.body;

    let post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Update fields
    if (title) post.title = title;
    if (description) post.description = description;
    if (content) post.content = content;
    if (category) post.category = category;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (tags) post.tags = tags;
    if (status) post.status = status;
    if (featured !== undefined) post.featured = featured;

    // Reset slug if title changed
    if (title) {
      post.slug = undefined;
    }

    await post.save();

    const updatedPost = await BlogPost.findById(post._id).populate(
      "author",
      "name email"
    );

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog post",
      error: error.message,
    });
  }
};

// @desc    Delete blog post (soft delete)
// @route   DELETE /api/blog/posts/:id
// @access  Private/Admin
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Soft delete
    post.deleted = true;
    await post.save();

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting blog post",
      error: error.message,
    });
  }
};

// @desc    Get all posts for admin (including drafts)
// @route   GET /api/blog/admin/posts
// @access  Private/Admin
export const getAdminPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = { deleted: false };

    if (status) {
      query.status = status;
    }

    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email");

    const total = await BlogPost.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

// @desc    Get blog categories with post counts
// @route   GET /api/blog/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await BlogPost.aggregate([
      {
        $match: {
          status: "published",
          deleted: false,
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: categories.map((cat) => ({
        name: cat._id,
        count: cat.count,
      })),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};
