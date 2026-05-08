import { useState, useEffect } from "react";
import { Calendar, Clock, Save, Plus, Trash2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { ProfileSkeleton } from "../../components/LoadingSkeleton";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Schedule = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schedule, setSchedule] = useState({
    availableDays: [],
    availableTimeSlots: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const { data } = await api.get("/doctor/schedule");
      setSchedule({
        availableDays: data.data.availableDays || [],
        availableTimeSlots: data.data.availableTimeSlots || [],
      });
      // Delay to show skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const addTimeSlot = () => {
    setSchedule((prev) => ({
      ...prev,
      availableTimeSlots: [
        ...prev.availableTimeSlots,
        { startTime: "09:00", endTime: "17:00" },
      ],
    }));
  };

  const updateTimeSlot = (index, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      ),
    }));
  };

  const removeTimeSlot = (index) => {
    setSchedule((prev) => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (schedule.availableDays.length === 0) {
      toast.error("Please select at least one available day");
      return;
    }

    if (schedule.availableTimeSlots.length === 0) {
      toast.error("Please add at least one time slot");
      return;
    }

    setSaving(true);
    try {
      await api.put("/doctor/schedule", schedule);
      toast.success("Schedule updated successfully");
    } catch (error) {
      toast.error("Failed to update schedule");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-4 sm:p-6 lg:p-8 mt-16 sm:mt-20">
            {/* Real Header - Shows Immediately */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark dark:text-slate-100">
                Manage Your Schedule
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mt-1">
                Set your available days and working hours
              </p>
            </div>
            <ProfileSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-3 sm:p-4 md:p-6 lg:p-8 mt-16 sm:mt-20">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-dark dark:text-slate-100">
              Manage Your Schedule
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Set your available days and working hours
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Available Days */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-primary" size={24} />
                <h3 className="text-xl font-bold text-dark dark:text-slate-100">
                  Available Days
                </h3>
              </div>

              <div className="space-y-3">
                {daysOfWeek.map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={schedule.availableDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="font-medium text-gray-700 dark:text-slate-300">
                      {day}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="text-primary" size={24} />
                  <h3 className="text-xl font-bold text-dark dark:text-slate-100">
                    Time Slots
                  </h3>
                </div>
                <button
                  onClick={addTimeSlot}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-orange-600 transition-colors">
                  <Plus size={18} />
                  Add Slot
                </button>
              </div>

              <div className="space-y-4">
                {schedule.availableTimeSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                    <Clock
                      size={48}
                      className="mx-auto mb-3 text-gray-400 dark:text-slate-600"
                    />
                    <p>No time slots added yet</p>
                    <p className="text-sm mt-1">
                      Click "Add Slot" to create your first time slot
                    </p>
                  </div>
                ) : (
                  schedule.availableTimeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              updateTimeSlot(index, "startTime", e.target.value)
                            }
                            className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              updateTimeSlot(index, "endTime", e.target.value)
                            }
                            className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeTimeSlot(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
              <Save size={18} sm:size={20} />
              {saving ? "Saving..." : "Save Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
