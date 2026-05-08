import { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  X,
  Save,
  FileText,
  TrendingUp,
} from "lucide-react";
import { TableSkeleton } from "../../components/LoadingSkeleton";
import Pagination from "../../components/Pagination";
import ConfirmationModal from "../../components/ConfirmationModal";
import ImageUpload from "../../components/ImageUpload";

const BlogManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create or edit
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Health Tips",
    featuredImage: "",
    tags: "",
    status: "draft",
    featured: false,
  });

  const categories = [
    "Health Tips",
    "Platform Updates",
    "Guides",
    "Medical News",
    "Wellness",
    "Technology",
    "Patient Stories",
    "Doctor Insights",
  ];

  useEffect(() => {
    fetchPosts();
  }, [currentPage, statusFilter, categoryFilter, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await api.get("/blog/admin/posts", { params });

      if (response.data.success) {
        setPosts(response.data.data.posts);
        setTotalPages(response.data.data.pagination.pages);

        // Calculate stats
        const allPosts = response.data.data.posts;
        setStats({
          total: response.data.data.pagination.total,
          published: allPosts.filter((p) => p.status === "published").length,
          draft: allPosts.filter((p) => p.status === "draft").length,
          archived: allPosts.filter((p) => p.status === "archived").length,
        });
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, post = null) => {
    setModalMode(mode);
    if (mode === "edit" && post) {
      setSelectedPost(post);
      setFormData({
        title: post.title,
        description: post.description,
        content: post.content,
        category: post.category,
        featuredImage: post.featuredImage || "",
        tags: post.tags.join(", "),
        status: post.status,
        featured: post.featured,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "Health Tips",
        featuredImage: "",
        tags: "",
        status: "draft",
        featured: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "Health Tips",
      featuredImage: "",
      tags: "",
      status: "draft",
      featured: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const postData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (modalMode === "create") {
        const response = await api.post("/blog/posts", postData);

        if (response.data.success) {
          toast.success("Blog post created successfully");
          fetchPosts();
          handleCloseModal();
        }
      } else {
        const response = await api.put(
          `/blog/posts/${selectedPost._id}`,
          postData
        );

        if (response.data.success) {
          toast.success("Blog post updated successfully");
          fetchPosts();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(
        error.response?.data?.message || "Failed to save blog post"
      );
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(
        `/blog/posts/${postToDelete._id}`
      );

      if (response.data.success) {
        toast.success("Blog post deleted successfully");
        fetchPosts();
        setDeleteModal(false);
        setPostToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete blog post");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      archived: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-3 sm:p-4 md:p-6 lg:p-8 mt-16 sm:mt-20">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              Blog Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Create and manage blog posts for your healthcare platform
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mb-1 truncate">
                    Total Posts
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {stats.total}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mb-1 truncate">
                    Published
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {stats.published}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mb-1 truncate">
                    Drafts
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {stats.draft}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mb-1 truncate">
                    Archived
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100">
                    {stats.archived}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>

                {/* Create Button - Desktop */}
                <button
                  onClick={() => handleOpenModal("create")}
                  className="hidden sm:flex items-center gap-2 px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg transition-colors whitespace-nowrap">
                  <Plus className="w-5 h-5" />
                  Create Post
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100">
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100">
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Create Button - Mobile */}
              <button
                onClick={() => handleOpenModal("create")}
                className="sm:hidden flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-800 text-white rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
                Create Post
              </button>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <TableSkeleton rows={5} />
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-slate-400 text-lg">
                  No blog posts found
                </p>
                <button
                  onClick={() => handleOpenModal("create")}
                  className="mt-4 px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg transition-colors">
                  Create Your First Post
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                      {posts.map((post) => (
                        <tr
                          key={post._id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {post.featured && (
                                <span className="text-yellow-500">⭐</span>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                  {post.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                  {post.readTime} min read
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 dark:text-slate-400">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(post.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-slate-400">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 dark:text-slate-400">
                              {formatDate(post.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenModal("edit", post)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setPostToDelete(post);
                                  setDeleteModal(true);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-700 p-4 border-b border-gray-200 dark:border-slate-600">
                        <div className="flex items-start gap-2">
                          {post.featured && (
                            <span className="text-yellow-500 text-lg flex-shrink-0">⭐</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-dark dark:text-slate-100 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                              {post.readTime} min read
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">
                            {post.category}
                          </span>
                          {getStatusBadge(post.status)}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-slate-400">
                            <Eye className="w-4 h-4 flex-shrink-0" />
                            <span>{post.views} views</span>
                          </div>
                          <span className="text-gray-500 dark:text-slate-400 text-xs">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="px-4 pb-4 flex gap-2">
                        <button
                          onClick={() => handleOpenModal("edit", post)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setPostToDelete(post);
                            setDeleteModal(true);
                          }}
                          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-danger dark:text-red-400 rounded-lg transition-colors shadow-sm"
                          title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-700">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {modalMode === "create" ? "Create New Post" : "Edit Post"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  placeholder="Enter post title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  placeholder="Brief description (max 500 characters)"
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Content * (Markdown supported)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100 font-mono text-sm"
                  placeholder="Write your content here... (Markdown supported: # Heading, ## Subheading, **bold**, *italic*, etc.)"
                  required
                />
              </div>

              {/* Category and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                    required>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                    required>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Featured Image */}
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) =>
                  setFormData({ ...formData, featuredImage: url })
                }
                label="Featured Image"
              />

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  placeholder="health, wellness, tips (comma separated)"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Feature this post on landing page
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {modalMode === "create" ? "Create Post" : "Update Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setPostToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        type="delete"
      />
    </div>
  );
};

export default BlogManagement;
