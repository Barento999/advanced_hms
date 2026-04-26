import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Heart, Phone, MapPin, AlertTriangle, Pill } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
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
    allergies: [],
    currentMedications: "",
    medicalHistory: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Check if user is authenticated and is a patient
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== "patient") {
      navigate("/login");
      return;
    }

    // Fetch existing patient data to pre-populate form
    fetchPatientData();
  }, [navigate]);

  const fetchPatientData = async () => {
    try {
      const response = await api.get("/patient/profile");
      const patientData = response.data.data;

      if (patientData) {
        setFormData((prev) => ({
          ...prev,
          dateOfBirth: patientData.dateOfBirth
            ? patientData.dateOfBirth.split("T")[0]
            : "",
          gender: patientData.gender || "",
          bloodGroup: patientData.bloodGroup || "",
          address: patientData.address || prev.address,
          emergencyContact:
            patientData.emergencyContact || prev.emergencyContact,
          allergies: patientData.allergies || [],
        }));
      }
    } catch (error) {
      console.log("No existing patient data found, starting fresh");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAllergyChange = (e) => {
    const allergies = e.target.value
      .split(",")
      .map((allergy) => allergy.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      allergies,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/patient/complete-profile", formData);
      toast.success("Medical profile completed successfully!");
      navigate("/patient");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
          Personal Information
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Complete your remaining personal details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="input-field"
            required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            className="input-field">
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
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
          Contact Information
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Your address and emergency contact details
        </p>
      </div>

      {/* Address */}
      <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-slate-100 mb-4">
          Home Address
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleInputChange}
              className="input-field"
              placeholder="123 Main Street"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                City *
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="input-field"
                placeholder="City"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                State *
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className="input-field"
                placeholder="State"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleInputChange}
                className="input-field"
                placeholder="12345"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-dark dark:text-slate-100">
            Emergency Contact
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Emergency contact name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="emergencyContact.phone"
              value={formData.emergencyContact.phone}
              onChange={handleInputChange}
              className="input-field"
              placeholder="(555) 123-4567"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Relationship *
            </label>
            <select
              name="emergencyContact.relation"
              value={formData.emergencyContact.relation}
              onChange={handleInputChange}
              className="input-field"
              required>
              <option value="">Select Relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="child">Child</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
          Medical Information
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Help us provide better care with your medical history
        </p>
      </div>

      {/* Allergies */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-dark dark:text-slate-100">
            Allergies
          </h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
            Known Allergies (separate with commas)
          </label>
          <input
            type="text"
            value={formData.allergies.join(", ")}
            onChange={handleAllergyChange}
            className="input-field"
            placeholder="e.g., Penicillin, Peanuts, Latex"
          />
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            List any known allergies to medications, foods, or other substances
          </p>
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-dark dark:text-slate-100">
            Current Medications
          </h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
            List Current Medications
          </label>
          <textarea
            name="currentMedications"
            value={formData.currentMedications}
            onChange={handleInputChange}
            className="input-field"
            rows="3"
            placeholder="e.g., Lisinopril 10mg daily, Metformin 500mg twice daily"
          />
        </div>
      </div>

      {/* Medical History */}
      <div>
        <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
          Medical History & Chronic Conditions
        </label>
        <textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleInputChange}
          className="input-field"
          rows="4"
          placeholder="Please describe any chronic conditions, previous surgeries, or significant medical history..."
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-dark dark:text-slate-100">
              Complete Your Medical Profile
            </h1>
            <span className="text-sm text-gray-600 dark:text-slate-400">
              Step {step} of 3
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-border dark:border-slate-700">
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                  step === 1
                    ? "bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                }`}>
                Previous
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary px-8">
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8">
                  {loading ? "Completing Profile..." : "Complete Profile"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/patient")}
            className="text-gray-600 dark:text-slate-400 hover:text-primary transition-colors text-sm">
            Skip for now (you can complete this later in your profile)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
