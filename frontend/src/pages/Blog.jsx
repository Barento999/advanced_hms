import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  Filter,
  X,
  BookOpen,
  Heart,
  Activity,
  Shield,
  FileText,
  Users,
  Stethoscope,
} from "lucide-react";
import Pagination from "../components/Pagination";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";

const Blog = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const allCategories = [
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
    fetchCategories();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
      };

      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await axios.get("http://localhost:5000/api/blog/posts", {
        params,
      });

      if (response.data.success) {
        setPosts(response.data.data.posts);
        setTotalPages(response.data.data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/blog/categories"
      );
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Health Tips": Heart,
      "Platform Updates": Activity,
      Guides: Shield,
      "Medical News": FileText,
      Wellness: Heart,
      Technology: Activity,
      "Patient Stories": Users,
      "Doctor Insights": Stethoscope,
    };
    return icons[category] || BookOpen;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Health Tips": "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
      "Platform Updates": "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
      Guides: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
      "Medical News": "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
      Wellness: "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20",
      Technology: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20",
      "Patient Stories": "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
      "Doctor Insights": "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20",
    };
    return colors[category] || "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Health & Wellness Blog
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Expert insights, health tips, and the latest updates from our healthcare professionals
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-gray-900 dark:text-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-white shadow-lg"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* Categories */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === "all"
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}>
                    All Articles
                    {categories.length > 0 && (
                      <span className="float-right text-sm">
                        {categories.reduce((sum, cat) => sum + cat.count, 0)}
                      </span>
                    )}
                  </button>
                  {allCategories.map((category) => {
                    const categoryData = categories.find(
                      (c) => c.name === category
                    );
                    const Icon = getCategoryIcon(category);
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          selectedCategory === category
                            ? "bg-primary text-white"
                            : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        }`}>
                        <Icon className="w-4 h-4" />
                        <span className="flex-1">{category}</span>
                        {categoryData && (
                          <span className="text-sm">{categoryData.count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/"
                    className="block text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">
                    ← Back to Home
                  </Link>
                  <Link
                    to="/register"
                    className="block text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-xl shadow-sm mb-6">
              <Filter className="w-5 h-5" />
              Filters & Categories
            </button>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                    Categories
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-slate-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === "all"
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}>
                    All Articles
                  </button>
                  {allCategories.map((category) => {
                    const Icon = getCategoryIcon(category);
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          selectedCategory === category
                            ? "bg-primary text-white"
                            : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        }`}>
                        <Icon className="w-4 h-4" />
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1">
            {/* Active Filters */}
            {(selectedCategory !== "all" || searchTerm) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-slate-400">
                  Active filters:
                </span>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-full text-sm">
                    {selectedCategory}
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className="hover:bg-blue-700 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-full text-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                      className="hover:bg-blue-700 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-slate-700"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-3"></div>
                      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-full mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  {searchTerm
                    ? `No results for "${searchTerm}"`
                    : "No articles in this category yet"}
                </p>
                {(selectedCategory !== "all" || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg transition-colors">
                    View All Articles
                  </button>
                )}
              </div>
            ) : (
              /* Blog Posts Grid */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {posts.map((post) => {
                    const CategoryIcon = getCategoryIcon(post.category);
                    return (
                      <article
                        key={post._id}
                        className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                        onClick={() => navigate(`/blog/${post.slug}`)}>
                        {/* Featured Image or Placeholder */}
                        <div className="h-48 bg-gradient-to-br from-primary/20 to-blue-800/20 dark:from-primary/30 dark:to-blue-800/30 flex items-center justify-center relative overflow-hidden">
                          {post.featuredImage ? (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML = `<div class="w-16 h-16 text-primary"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>`;
                              }}
                            />
                          ) : (
                            <CategoryIcon className="w-16 h-16 text-primary" />
                          )}
                        </div>

                        <div className="p-6">
                          {/* Category Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3 ${getCategoryColor(
                              post.category
                            )}`}>
                            <CategoryIcon className="w-3 h-3" />
                            {post.category}
                          </span>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-3">
                            {post.description}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-500">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.publishedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readTime} min
                              </span>
                            </div>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                          </div>

                          {/* Read More Link */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <span className="text-primary hover:text-blue-800 dark:hover:text-blue-400 font-medium inline-flex items-center gap-2 transition-colors">
                              Read More
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Blog;
