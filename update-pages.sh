#!/bin/bash

# List of files to update (excluding AdminDashboard.jsx which is already done)
files=(
  "frontend/src/pages/patient/MyAppointments.jsx"
  "frontend/src/pages/patient/Reviews.jsx"
  "frontend/src/pages/patient/Profile.jsx"
  "frontend/src/pages/patient/Payments.jsx"
  "frontend/src/pages/patient/PatientDashboard.jsx"
  "frontend/src/pages/patient/MedicalRecords.jsx"
  "frontend/src/pages/patient/BookAppointment.jsx"
  "frontend/src/pages/doctor/ViewMedicalRecords.jsx"
  "frontend/src/pages/doctor/Schedule.jsx"
  "frontend/src/pages/doctor/Profile.jsx"
  "frontend/src/pages/doctor/Patients.jsx"
  "frontend/src/pages/doctor/MyReviews.jsx"
  "frontend/src/pages/doctor/MedicalRecords.jsx"
  "frontend/src/pages/doctor/DoctorDashboard.jsx"
  "frontend/src/pages/doctor/Appointments.jsx"
  "frontend/src/pages/admin/Appointments.jsx"
  "frontend/src/pages/admin/Analytics.jsx"
  "frontend/src/pages/admin/AdminManagement.jsx"
  "frontend/src/pages/admin/Doctors.jsx"
  "frontend/src/pages/admin/DoctorProfile.jsx"
  "frontend/src/pages/admin/PatientProfile.jsx"
  "frontend/src/pages/admin/Profile.jsx"
  "frontend/src/pages/admin/Patients.jsx"
  "frontend/src/pages/admin/Reviews.jsx"
  "frontend/src/pages/admin/Reports.jsx"
  "frontend/src/pages/admin/BlogManagement.jsx"
  "frontend/src/pages/Notifications.jsx"
)

echo "Updating ${#files[@]} files..."

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Add sidebarOpen state if useState is already imported
    sed -i 's/const \[\([^,]*\), set\([^]]*\)\] = useState(\([^)]*\));/const [\1, set\2] = useState(\3);\n  const [sidebarOpen, setSidebarOpen] = useState(false);/' "$file" | head -1
    
    # Update Sidebar usage
    sed -i 's/<Sidebar \/>/<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} \/>/g' "$file"
    
    # Update Navbar usage  
    sed -i 's/<Navbar \/>/<Navbar onMenuClick={() => setSidebarOpen(true)} \/>/g' "$file"
    
    # Update content wrapper class
    sed -i 's/className="flex-1 ml-64"/className="flex-1 ml-0 lg:ml-64"/g' "$file"
    
    # Update main content padding
    sed -i 's/className="p-8 mt-20"/className="p-4 sm:p-6 lg:p-8 mt-16 sm:mt-20"/g' "$file"
    
    echo "✓ Updated $file"
  else
    echo "✗ File not found: $file"
  fi
done

echo "Done!"
