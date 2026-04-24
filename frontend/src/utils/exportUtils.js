import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Alternative PDF Export without autoTable (fallback)
export const exportToPDFSimple = (data, columns, title, filename) => {
  try {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(title, 20, 20);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    let yPosition = 50;
    const lineHeight = 6;

    // Add headers
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    let xPosition = 20;
    columns.forEach((col, index) => {
      doc.text(col.header, xPosition, yPosition);
      xPosition += 40; // Adjust spacing as needed
    });

    yPosition += lineHeight;
    doc.setFont(undefined, "normal");

    // Add data rows
    data.forEach((item) => {
      if (yPosition > 280) {
        // Start new page if needed
        doc.addPage();
        yPosition = 20;
      }

      xPosition = 20;
      columns.forEach((col) => {
        let value;
        if (col.accessor.includes(".")) {
          value = col.accessor
            .split(".")
            .reduce((obj, key) => obj?.[key], item);
        } else {
          value = item[col.accessor];
        }

        const displayValue =
          value !== undefined && value !== null ? String(value) : "N/A";
        doc.text(displayValue.substring(0, 15), xPosition, yPosition); // Truncate long text
        xPosition += 40;
      });

      yPosition += lineHeight;
    });

    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Simple PDF Export Error:", error);
    throw new Error(`Simple PDF export failed: ${error.message}`);
  }
};

// PDF Export Functions
export const exportToPDF = (data, columns, title, filename) => {
  try {
    // Check if jsPDF is properly loaded
    if (typeof jsPDF === "undefined") {
      throw new Error("jsPDF library is not loaded");
    }

    const doc = new jsPDF();

    // Check if autoTable is available
    if (typeof doc.autoTable !== "function") {
      console.warn("jsPDF autoTable plugin not available, using simple export");
      return exportToPDFSimple(data, columns, title, filename);
    }

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138); // Primary color
    doc.text(title, 14, 22);

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = data.map((item) =>
      columns.map((col) => {
        if (col.accessor.includes(".")) {
          // Handle nested properties
          const value = col.accessor
            .split(".")
            .reduce((obj, key) => obj?.[key], item);
          return value !== undefined && value !== null ? String(value) : "N/A";
        }
        const value = item[col.accessor];
        return value !== undefined && value !== null ? String(value) : "N/A";
      }),
    );

    // Add table
    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [30, 58, 138], // Primary color
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Light gray
      },
      margin: { top: 40 },
    });

    // Save the PDF
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF Export Error:", error);
    // Fallback to simple export
    try {
      console.log("Attempting fallback to simple PDF export...");
      exportToPDFSimple(data, columns, title, filename);
    } catch (fallbackError) {
      console.error("Fallback PDF Export Error:", fallbackError);
      throw new Error(`PDF export failed: ${error.message}`);
    }
  }
};

// Excel Export Functions
export const exportToExcel = (data, columns, title, filename) => {
  // Prepare worksheet data
  const wsData = [
    // Title row
    [title],
    [`Generated on: ${new Date().toLocaleDateString()}`],
    [], // Empty row
    // Header row
    columns.map((col) => col.header),
    // Data rows
    ...data.map((item) =>
      columns.map((col) => {
        if (col.accessor.includes(".")) {
          // Handle nested properties
          return (
            col.accessor.split(".").reduce((obj, key) => obj?.[key], item) ||
            "N/A"
          );
        }
        return item[col.accessor] || "N/A";
      }),
    ),
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Style the title
  ws["A1"] = { v: title, t: "s", s: { font: { bold: true, sz: 16 } } };

  // Set column widths
  const colWidths = columns.map(() => ({ wch: 15 }));
  ws["!cols"] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  // Save the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${filename}.xlsx`);
};

// Predefined column configurations for different data types
export const EXPORT_COLUMNS = {
  patients: [
    { header: "Name", accessor: "userId.name" },
    { header: "Email", accessor: "userId.email" },
    { header: "Phone", accessor: "userId.phone" },
    { header: "Gender", accessor: "gender" },
    { header: "Blood Group", accessor: "bloodGroup" },
    { header: "Status", accessor: "userId.isActive" },
    { header: "Created Date", accessor: "createdAt" },
  ],

  adminPatients: [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "isActive" },
    { header: "Created Date", accessor: "createdAt" },
  ],

  doctors: [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Specialization", accessor: "specialization" },
    { header: "Experience", accessor: "experience" },
    { header: "Rating", accessor: "rating" },
    { header: "Status", accessor: "isActive" },
  ],

  appointments: [
    { header: "Patient", accessor: "patientId.userId.name" },
    { header: "Doctor", accessor: "doctorId.userId.name" },
    { header: "Date", accessor: "appointmentDate" },
    { header: "Time", accessor: "timeSlot.startTime" },
    { header: "Reason", accessor: "reason" },
    { header: "Status", accessor: "status" },
  ],

  patientAppointments: [
    { header: "Doctor Name", accessor: "doctorId.userId.name" },
    { header: "Doctor Email", accessor: "doctorId.userId.email" },
    { header: "Date", accessor: "appointmentDate" },
    { header: "Time", accessor: "timeSlot.startTime" },
    { header: "End Time", accessor: "timeSlot.endTime" },
    { header: "Reason", accessor: "reason" },
    { header: "Status", accessor: "status" },
  ],

  doctorAppointments: [
    { header: "Patient Name", accessor: "patientId.userId.name" },
    { header: "Patient Email", accessor: "patientId.userId.email" },
    { header: "Patient Phone", accessor: "patientId.userId.phone" },
    { header: "Date", accessor: "appointmentDate" },
    { header: "Time", accessor: "timeSlot.startTime" },
    { header: "Reason", accessor: "reason" },
    { header: "Status", accessor: "status" },
  ],

  payments: [
    { header: "Date", accessor: "createdAt" },
    { header: "Transaction ID", accessor: "transactionId" },
    { header: "Amount", accessor: "amount" },
    { header: "Method", accessor: "paymentMethod" },
    { header: "Status", accessor: "status" },
  ],

  medicalRecords: [
    { header: "Date", accessor: "createdAt" },
    { header: "Doctor", accessor: "doctorId.userId.name" },
    { header: "Diagnosis", accessor: "diagnosis" },
    { header: "Symptoms", accessor: "symptoms" },
    { header: "Notes", accessor: "notes" },
  ],

  reviews: [
    { header: "Patient", accessor: "patientId.userId.name" },
    { header: "Doctor", accessor: "doctorId.userId.name" },
    { header: "Rating", accessor: "rating" },
    { header: "Comment", accessor: "comment" },
    { header: "Date", accessor: "createdAt" },
  ],

  users: [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Phone", accessor: "phone" },
    { header: "Status", accessor: "isActive" },
    { header: "Created Date", accessor: "createdAt" },
  ],
};

// Helper function to format data for export
export const formatDataForExport = (data, type) => {
  return data.map((item) => {
    // Create a deep copy to avoid modifying the original
    const formatted = JSON.parse(JSON.stringify(item));

    // Format dates
    if (formatted.createdAt) {
      formatted.createdAt = new Date(formatted.createdAt).toLocaleDateString();
    }
    if (formatted.appointmentDate) {
      formatted.appointmentDate = new Date(
        formatted.appointmentDate,
      ).toLocaleDateString();
    }

    // Format boolean values - handle nested properties
    if (typeof formatted.isActive === "boolean") {
      formatted.isActive = formatted.isActive ? "Active" : "Inactive";
    }
    if (formatted.userId && typeof formatted.userId.isActive === "boolean") {
      formatted.userId.isActive = formatted.userId.isActive
        ? "Active"
        : "Inactive";
    }

    // Format arrays (like symptoms)
    if (Array.isArray(formatted.symptoms)) {
      formatted.symptoms = formatted.symptoms.join(", ");
    }

    // Format time slots for appointments
    if (formatted.timeSlot && formatted.timeSlot.startTime) {
      // Keep the time slot as is, it's already formatted
    }

    // Format currency
    if (formatted.amount) {
      formatted.amount = `$${formatted.amount}`;
    }

    return formatted;
  });
};
