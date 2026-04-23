import { useState, useEffect } from "react";
import {
  User,
  Award,
  Briefcase,
  DollarSign,
  Star,
  Users,
  Save,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    specialization: "",
    qualification: "",
    experience: 0,
    consultationFee: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/doctor/profile");
      if (data.success) {
        setProfile({
          specialization: data.data.specialization || "",
          qualification: data.data.qualification || "",
          experience: data.data.experience || 0,
          consultationFee: data.data.consultationFee || 0,
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data } = await api.put("/doctor/profile", profile);
      if (data.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="p-8 mt-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="p-8 mt-20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark">My Profile</h2>
            <p className="text-gray-600 mt-1">
              Manage your professional information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Professional Information */}
            <div className="card">
              <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <User size={20} className="text-primary" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Award size={16} />
                      Specialization
                    </span>
                  </label>
                  <select
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleInputChange}
                    className="input"
                    required>
                    <option value="">Select Specialization</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="ENT">ENT</option>
                    <option value="Dentistry">Dentistry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Award size={16} />
                      Qualification
                    </span>
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={profile.qualification}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., MBBS, MD"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Briefcase size={16} />
                      Experience (Years)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={profile.experience}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <DollarSign size={16} />
                      Consultation Fee ($)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={profile.consultationFee}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2">
                <Save size={18} />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
