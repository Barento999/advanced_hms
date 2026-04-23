import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Heart,
  AlertCircle,
  Phone,
  MapPin,
  Plus,
  X,
  Save,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { ProfileSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
    medicalHistory: [],
    allergies: [],
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState({
    condition: "",
    diagnosedDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/patient/profile");
      if (data.success) {
        setProfile({
          dateOfBirth: data.data.dateOfBirth
            ? new Date(data.data.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: data.data.gender || "",
          bloodGroup: data.data.bloodGroup || "",
          address: data.data.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
          },
          emergencyContact: data.data.emergencyContact || {
            name: "",
            phone: "",
            relation: "",
          },
          medicalHistory: data.data.medicalHistory || [],
          allergies: data.data.allergies || [],
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [name]: value },
    }));
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setProfile((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (index) => {
    setProfile((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const handleAddCondition = () => {
    if (newCondition.condition.trim()) {
      setProfile((prev) => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, { ...newCondition }],
      }));
      setNewCondition({ condition: "", diagnosedDate: "", notes: "" });
    }
  };

  const handleRemoveCondition = (index) => {
    setProfile((prev) => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data } = await api.put("/patient/profile", profile);
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
              Complete your profile for better healthcare experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <User size={20} className="text-primary" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    className="input">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={profile.bloodGroup}
                    onChange={handleInputChange}
                    className="input">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="card">
              <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={profile.address.street}
                    onChange={handleAddressChange}
                    className="input"
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profile.address.city}
                    onChange={handleAddressChange}
                    className="input"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={profile.address.state}
                    onChange={handleAddressChange}
                    className="input"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={profile.address.zipCode}
                    onChange={handleAddressChange}
                    className="input"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card">
              <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <Phone size={20} className="text-primary" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.emergencyContact.name}
                    onChange={handleEmergencyContactChange}
                    className="input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.emergencyContact.phone}
                    onChange={handleEmergencyContactChange}
                    className="input"
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relation
                  </label>
                  <input
                    type="text"
                    name="relation"
                    value={profile.emergencyContact.relation}
                    onChange={handleEmergencyContactChange}
                    className="input"
                    placeholder="Spouse, Parent, etc."
                  />
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="card">
              <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-danger" />
                Allergies
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddAllergy())
                  }
                  className="input flex-1"
                  placeholder="Add allergy (e.g., Penicillin, Peanuts)"
                />
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="btn-primary flex items-center gap-2">
                  <Plus size={18} />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {allergy}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(index)}
                      className="hover:text-red-900">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {profile.allergies.length === 0 && (
                  <p className="text-gray-500 text-sm">No allergies added</p>
                )}
              </div>
            </div>

            {/* Medical History */}
            <div className="card">
              <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <Heart size={20} className="text-primary" />
                Medical History
              </h3>
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newCondition.condition}
                    onChange={(e) =>
                      setNewCondition({
                        ...newCondition,
                        condition: e.target.value,
                      })
                    }
                    className="input"
                    placeholder="Condition (e.g., Diabetes)"
                  />
                  <input
                    type="date"
                    value={newCondition.diagnosedDate}
                    onChange={(e) =>
                      setNewCondition({
                        ...newCondition,
                        diagnosedDate: e.target.value,
                      })
                    }
                    className="input"
                  />
                  <input
                    type="text"
                    value={newCondition.notes}
                    onChange={(e) =>
                      setNewCondition({
                        ...newCondition,
                        notes: e.target.value,
                      })
                    }
                    className="input"
                    placeholder="Notes (optional)"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="btn-primary flex items-center gap-2">
                  <Plus size={18} />
                  Add Condition
                </button>
              </div>
              <div className="space-y-3">
                {profile.medicalHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark">
                        {item.condition}
                      </h4>
                      {item.diagnosedDate && (
                        <p className="text-sm text-gray-600 mt-1">
                          Diagnosed:{" "}
                          {new Date(item.diagnosedDate).toLocaleDateString()}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(index)}
                      className="text-red-600 hover:text-red-800">
                      <X size={18} />
                    </button>
                  </div>
                ))}
                {profile.medicalHistory.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No medical history added
                  </p>
                )}
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
