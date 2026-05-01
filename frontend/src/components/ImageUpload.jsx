import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const ImageUpload = ({ value, onChange, label = "Upload Image" }) => {
  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // In a real application, you would upload to a service like:
    // - AWS S3
    // - Cloudinary
    // - Your own backend server
    // For now, we'll use the data URL or suggest using external URLs

    try {
      setUploading(true);
      
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll use the data URL
      // In production, replace this with actual upload logic
      const imageUrl = reader.result;
      onChange(imageUrl);
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlInput = (url) => {
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
        {label}
      </label>

      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => handleUrlInput(e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-slate-300"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview */}
      {preview && (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-slate-600"
            onError={() => {
              toast.error("Failed to load image");
              setPreview("");
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area (when no preview) */}
      {!preview && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary dark:hover:border-primary transition-colors">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-500">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-slate-400">
        💡 Tip: Use{" "}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline">
          Unsplash
        </a>{" "}
        for free high-quality images
      </p>
    </div>
  );
};

export default ImageUpload;
