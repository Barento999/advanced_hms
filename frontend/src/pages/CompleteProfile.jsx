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
    allergiesAcknowledged: false,
    medicationsAcknowledged: false,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Check if current step is complete (required fields filled)
  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.dateOfBirth && formData.gender && formData.bloodGroup;
      case 2:
        return (
          formData.address.street.trim() &&
          formData.address.city.trim() &&
          formData.address.state.trim() &&
          formData.address.zipCode.trim() &&
          formData.emergencyContact.name.trim() &&
          formData.emergencyContact.phone.trim() &&
          formData.emergencyContact.relation
        );
      case 3:
        // Require acknowledgment of allergies and medications (even if "None")
        return (
          formData.allergiesAcknowledged && formData.medicationsAcknowledged
        );
      default:
        return false;
    }
  };

  // Check if current step is valid (no validation errors)
  const isStepValid = (stepNumber) => {
    return validateStep(stepNumber);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      // Personal Information validation
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (birthDate > today) {
          newErrors.dateOfBirth = "Date of birth cannot be in the future";
        } else if (age > 120) {
          newErrors.dateOfBirth = "Please enter a valid date of birth";
        }
      }

      if (!formData.gender) {
        newErrors.gender = "Gender is required";
      }

      if (!formData.bloodGroup) {
        newErrors.bloodGroup = "Blood group is required";
      }
    }

    if (currentStep === 2) {
      // Address validation
      if (!formData.address.street.trim()) {
        newErrors["address.street"] = "Street address is required";
      }

      if (!formData.address.city.trim()) {
        newErrors["address.city"] = "City is required";
      }

      if (!formData.address.state.trim()) {
        newErrors["address.state"] = "State is required";
      }

      if (!formData.address.zipCode.trim()) {
        newErrors["address.zipCode"] = "ZIP code is required";
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.address.zipCode)) {
        newErrors["address.zipCode"] =
          "Please enter a valid ZIP code (12345 or 12345-6789)";
      }

      // Emergency contact validation
      if (!formData.emergencyContact.name.trim()) {
        newErrors["emergencyContact.name"] =
          "Emergency contact name is required";
      }

      if (!formData.emergencyContact.phone.trim()) {
        newErrors["emergencyContact.phone"] =
          "Emergency contact phone is required";
      } else if (
        !/^[\+]?[1-9][\d]{0,15}$/.test(
          formData.emergencyContact.phone.replace(/[\s\-\(\)]/g, ""),
        )
      ) {
        newErrors["emergencyContact.phone"] =
          "Please enter a valid phone number";
      }

      if (!formData.emergencyContact.relation) {
        newErrors["emergencyContact.relation"] = "Relationship is required";
      }
    }

    if (currentStep === 3) {
      return validateStep3();
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const nextStep = () => {
    if (isStepComplete(step) && validateStep(step)) {
      setStep(step + 1);
    } else if (!isStepComplete(step)) {
      toast.error("Please fill in all required fields");
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all steps are complete before submission
    if (!isStepComplete(1) || !isStepComplete(2) || !isStepComplete(3)) {
      toast.error(
        "Please complete all required fields in all steps before submitting",
      );
      return;
    }

    // Validate all steps before submission
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error("Please fix all errors before submitting");
      return;
    }

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

  const validateStep3 = () => {
    const newErrors = {};

    // No required fields in step 3, but we can validate format if provided
    if (
      formData.currentMedications &&
      formData.currentMedications.length > 1000
    ) {
      newErrors.currentMedications =
        "Current medications description is too long (max 1000 characters)";
    }

    if (formData.medicalHistory && formData.medicalHistory.length > 2000) {
      newErrors.medicalHistory =
        "Medical history description is too long (max 2000 characters)";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
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
            className={`input-field ${errors.dateOfBirth ? "border-red-500 focus:ring-red-500" : ""}`}
            max={new Date().toISOString().split("T")[0]}
            required
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`input-field ${errors.gender ? "border-red-500 focus:ring-red-500" : ""}`}
            required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
            Blood Group *
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            className={`input-field ${errors.bloodGroup ? "border-red-500 focus:ring-red-500" : ""}`}
            required>
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
          {errors.bloodGroup && (
            <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
          )}
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
              className={`input-field ${errors["address.street"] ? "border-red-500 focus:ring-red-500" : ""}`}
              placeholder="123 Main Street"
              required
            />
            {errors["address.street"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["address.street"]}
              </p>
            )}
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
                className={`input-field ${errors["address.city"] ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="City"
                required
              />
              {errors["address.city"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["address.city"]}
                </p>
              )}
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
                className={`input-field ${errors["address.state"] ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="State"
                required
              />
              {errors["address.state"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["address.state"]}
                </p>
              )}
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
                className={`input-field ${errors["address.zipCode"] ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="12345"
                required
              />
              {errors["address.zipCode"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["address.zipCode"]}
                </p>
              )}
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
              className={`input-field ${errors["emergencyContact.name"] ? "border-red-500 focus:ring-red-500" : ""}`}
              placeholder="Emergency contact name"
              required
            />
            {errors["emergencyContact.name"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["emergencyContact.name"]}
              </p>
            )}
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
              className={`input-field ${errors["emergencyContact.phone"] ? "border-red-500 focus:ring-red-500" : ""}`}
              placeholder="(555) 123-4567"
              required
            />
            {errors["emergencyContact.phone"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["emergencyContact.phone"]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark dark:text-slate-200 mb-2">
              Relationship *
            </label>
            <select
              name="emergencyContact.relation"
              value={formData.emergencyContact.relation}
              onChange={handleInputChange}
              className={`input-field ${errors["emergencyContact.relation"] ? "border-red-500 focus:ring-red-500" : ""}`}
              required>
              <option value="">Select Relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="child">Child</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
            {errors["emergencyContact.relation"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["emergencyContact.relation"]}
              </p>
            )}
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
            className={`input-field ${errors.currentMedications ? "border-red-500 focus:ring-red-500" : ""}`}
            rows="3"
            maxLength="1000"
            placeholder="e.g., Lisinopril 10mg daily, Metformin 500mg twice daily"
          />
          {errors.currentMedications && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentMedications}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {formData.currentMedications.length}/1000 characters
          </p>
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
          className={`input-field ${errors.medicalHistory ? "border-red-500 focus:ring-red-500" : ""}`}
          rows="4"
          maxLength="2000"
          placeholder="Please describe any chronic conditions, previous surgeries, or significant medical history..."
        />
        {errors.medicalHistory && (
          <p className="text-red-500 text-sm mt-1">{errors.medicalHistory}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          {formData.medicalHistory.length}/2000 characters
        </p>
      </div>

      {/* Required Acknowledgments */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-dark dark:text-slate-100 mb-4">
          Medical Information Confirmation *
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="allergiesAcknowledged"
              name="allergiesAcknowledged"
              checked={formData.allergiesAcknowledged}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  allergiesAcknowledged: e.target.checked,
                }))
              }
              className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              required
            />
            <label
              htmlFor="allergiesAcknowledged"
              className="text-sm text-dark dark:text-slate-200">
              I have reviewed and provided accurate information about my
              allergies. If I have no known allergies, I have left the field
              blank or indicated "None".
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="medicationsAcknowledged"
              name="medicationsAcknowledged"
              checked={formData.medicationsAcknowledged}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  medicationsAcknowledged: e.target.checked,
                }))
              }
              className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              required
            />
            <label
              htmlFor="medicationsAcknowledged"
              className="text-sm text-dark dark:text-slate-200">
              I have reviewed and provided accurate information about my current
              medications and medical history. If I have no current medications
              or medical history, I have left the fields blank or indicated
              "None".
            </label>
          </div>
        </div>

        {(!formData.allergiesAcknowledged ||
          !formData.medicationsAcknowledged) && (
          <p className="text-red-500 text-sm mt-3">
            Please acknowledge that you have reviewed your medical information
            above.
          </p>
        )}
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-slate-400">
                Step {step} of 3
              </span>
              {isStepComplete(step) && (
                <span className="text-green-600 text-sm">✓ Complete</span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>

          {/* Step completion indicators */}
          <div className="flex justify-between mt-2 text-xs">
            <span
              className={`${step >= 1 ? (isStepComplete(1) ? "text-green-600" : "text-primary") : "text-gray-400"}`}>
              Personal Info {isStepComplete(1) && "✓"}
            </span>
            <span
              className={`${step >= 2 ? (isStepComplete(2) ? "text-green-600" : "text-primary") : "text-gray-400"}`}>
              Contact Info {isStepComplete(2) && "✓"}
            </span>
            <span className={`${step >= 3 ? "text-primary" : "text-gray-400"}`}>
              Medical Info
            </span>
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
                <div className="flex flex-col items-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepComplete(step)}
                    className={`px-8 py-2 rounded-xl font-medium transition-colors ${
                      isStepComplete(step)
                        ? "bg-primary hover:bg-primary-dark text-white"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                    }`}>
                    Next Step
                  </button>
                  {!isStepComplete(step) && (
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Please fill in all required fields (*)
                    </p>
                  )}
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !isStepComplete(1) ||
                    !isStepComplete(2) ||
                    !isStepComplete(3)
                  }
                  className={`px-8 py-2 rounded-xl font-medium transition-colors ${
                    loading ||
                    !isStepComplete(1) ||
                    !isStepComplete(2) ||
                    !isStepComplete(3)
                      ? "bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-dark text-white"
                  }`}>
                  {loading ? "Completing Profile..." : "Complete Profile"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <div className="mb-4">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-2">
              Form Completion Progress
            </div>
            <div className="flex justify-center gap-4 text-xs">
              <span
                className={`flex items-center gap-1 ${isStepComplete(1) ? "text-green-600" : "text-gray-400"}`}>
                {isStepComplete(1) ? "✓" : "○"} Personal Info
              </span>
              <span
                className={`flex items-center gap-1 ${isStepComplete(2) ? "text-green-600" : "text-gray-400"}`}>
                {isStepComplete(2) ? "✓" : "○"} Contact Info
              </span>
              <span
                className={`flex items-center gap-1 ${isStepComplete(3) ? "text-green-600" : "text-gray-400"}`}>
                {isStepComplete(3) ? "✓" : "○"} Medical Info
              </span>
            </div>
          </div>
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
