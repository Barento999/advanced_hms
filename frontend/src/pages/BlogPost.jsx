import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  User,
  Tag,
  BookOpen,
  Heart,
  Activity,
  Shield,
  FileText,
  Users,
  Stethoscope,
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/blog/posts/${slug}`
      );

      if (response.data.success) {
        setPost(response.data.data);
        // Fetch related posts
        fetchRelatedPosts(response.data.data.category, response.data.data._id);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load blog post");
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (category, currentPostId) => {
    try {
      const response = await axios.get("http://localhost:5000/api/blog/posts", {
        params: {
          category,
          limit: 3,
        },
      });

      if (response.data.success) {
        // Filter out current post
        const filtered = response.data.data.posts.filter(
          (p) => p._id !== currentPostId
        );
        setRelatedPosts(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
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
      "Platform Updates":
        "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
      Guides:
        "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
      "Medical News":
        "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
      Wellness:
        "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20",
      Technology:
        "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20",
      "Patient Stories":
        "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
      "Doctor Insights":
        "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20",
    };
    return (
      colors[category] ||
      "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20"
    );
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || "";

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
      setShowShareMenu(false);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
      setShowShareMenu(false);
    }
  };

  // Render markdown-like content
  const renderContent = (content) => {
    if (!content) return null;

    // Simple markdown rendering
    const lines = content.split("\n");
    const elements = [];
    let currentList = [];
    let inCodeBlock = false;
    let codeBlockContent = [];

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${index}`}
              className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4 overflow-x-auto my-4">
              <code className="text-sm font-mono text-gray-800 dark:text-slate-200">
                {codeBlockContent.join("\n")}
              </code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={index}
            className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-8 mb-4">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={index}
            className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-6 mb-3">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={index}
            className="text-xl font-bold text-gray-900 dark:text-slate-100 mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
      }
      // Lists
      else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        currentList.push(line.trim().substring(2));
      } else {
        // Flush list if exists
        if (currentList.length > 0) {
          elements.push(
            <ul
              key={`list-${index}`}
              className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-slate-300">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
          currentList = [];
        }

        // Regular paragraph
        if (line.trim()) {
          // Handle bold and italic
          let processedLine = line
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

          elements.push(
            <p
              key={index}
              className="text-gray-700 dark:text-slate-300 leading-relaxed my-4"
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          );
        } else {
          elements.push(<div key={index} className="h-4" />);
        }
      }
    });

    // Flush remaining list
    if (currentList.length > 0) {
      elements.push(
        <ul
          key="list-final"
          className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-slate-300">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-8"></div>
            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const CategoryIcon = getCategoryIcon(post.category);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Back Button */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </button>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Badge */}
        <div className="mb-6">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(
              post.category
            )}`}>
            <CategoryIcon className="w-4 h-4" />
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-slate-400 mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{post.author?.name || "Healthcare Team"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{post.readTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span>{post.views} views</span>
          </div>

          {/* Share Button */}
          <div className="ml-auto relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-10">
                <button
                  onClick={() => handleShare("facebook")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <LinkIcon className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Description */}
        <div className="text-xl text-gray-700 dark:text-slate-300 mb-8 leading-relaxed font-medium">
          {post.description}
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {renderContent(post.content)}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => {
                const RelatedIcon = getCategoryIcon(relatedPost.category);
                return (
                  <Link
                    key={relatedPost._id}
                    to={`/blog/${relatedPost.slug}`}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-blue-800/20 dark:from-primary/30 dark:to-blue-800/30 flex items-center justify-center">
                      {relatedPost.featuredImage ? (
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <RelatedIcon className="w-12 h-12 text-primary" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                        {relatedPost.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Take Control of Your Health?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of patients who trust our platform for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-primary rounded-xl font-medium hover:bg-blue-50 transition-colors">
              Get Started
            </Link>
            <Link
              to="/blog"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
              Read More Articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
