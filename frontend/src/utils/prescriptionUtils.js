import jsPDF from "jspdf";

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age > 0 ? age : null;
  } catch (error) {
    console.error("Error calculating age:", error);
    return null;
  }
};

// Safe text helper to handle undefined/null values
const safeText = (text, fallback = "N/A") => {
  return text && text.toString().trim() ? text.toString() : fallback;
};

// Prescription PDF Generator
export const generatePrescriptionPDF = (
  medicalRecord,
  patientInfo,
  doctorInfo,
) => {
  try {
    // Validate required data
    if (!medicalRecord) {
      throw new Error("Medical record is required");
    }
    if (!patientInfo) {
      throw new Error("Patient information is required");
    }
    if (!doctorInfo) {
      throw new Error("Doctor information is required");
    }
    if (
      !medicalRecord.prescription ||
      medicalRecord.prescription.length === 0
    ) {
      throw new Error("No prescription data available");
    }

    const doc = new jsPDF();

    // Header - Clinic/Hospital Information
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138); // Primary blue color
    doc.text("HealthCare Management System", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Digital Healthcare Solutions", 105, 28, { align: "center" });
    doc.text("Phone: +1 (555) 123-4567 | Email: info@healthcare.com", 105, 35, {
      align: "center",
    });

    // Draw header line
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);

    // Prescription Title
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text("PRESCRIPTION", 105, 55, { align: "center" });

    // Patient Information Box
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("PATIENT INFORMATION", 20, 70);

    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.rect(20, 72, 170, 25);

    doc.setFontSize(10);
    const patientAge = calculateAge(patientInfo.dateOfBirth);
    doc.text(`Name: ${safeText(patientInfo.name)}`, 25, 80);
    doc.text(`Age: ${patientAge || "N/A"}`, 25, 86);
    doc.text(`Gender: ${safeText(patientInfo.gender)}`, 25, 92);

    doc.text(`Phone: ${safeText(patientInfo.phone)}`, 110, 80);
    doc.text(`Email: ${safeText(patientInfo.email)}`, 110, 86);
    doc.text(`Blood Group: ${safeText(patientInfo.bloodGroup)}`, 110, 92);

    // Doctor Information Box
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("DOCTOR INFORMATION", 20, 110);

    doc.rect(20, 112, 170, 20);

    doc.setFontSize(10);
    doc.text(`Dr. ${safeText(doctorInfo.name)}`, 25, 120);
    doc.text(`Specialization: ${safeText(doctorInfo.specialization)}`, 25, 126);

    doc.text(`Phone: ${safeText(doctorInfo.phone)}`, 110, 120);
    doc.text(`Email: ${safeText(doctorInfo.email)}`, 110, 126);

    // Date and Diagnosis
    doc.setFontSize(12);
    doc.text("DATE & DIAGNOSIS", 20, 145);

    doc.rect(20, 147, 170, 15);

    doc.setFontSize(10);
    const recordDate = medicalRecord.createdAt
      ? new Date(medicalRecord.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString();
    doc.text(`Date: ${recordDate}`, 25, 155);
    doc.text(`Diagnosis: ${safeText(medicalRecord.diagnosis)}`, 25, 161);

    // Symptoms (if any)
    let currentY = 175;
    if (medicalRecord.symptoms && medicalRecord.symptoms.length > 0) {
      doc.setFontSize(12);
      doc.text("SYMPTOMS", 20, currentY);

      doc.setFontSize(10);
      const symptomsText = medicalRecord.symptoms.join(", ");
      const symptomsLines = doc.splitTextToSize(symptomsText, 170);
      doc.text(symptomsLines, 25, currentY + 7);
      currentY += symptomsLines.length * 5 + 15;
    }

    // Prescription Table
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("PRESCRIPTION", 20, currentY);

    // Table headers
    const tableStartY = currentY + 5;
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");

    doc.rect(20, tableStartY, 170, 10);
    doc.text("Medicine", 25, tableStartY + 7);
    doc.text("Dosage", 70, tableStartY + 7);
    doc.text("Duration", 110, tableStartY + 7);
    doc.text("Instructions", 150, tableStartY + 7);

    // Table content
    doc.setFont(undefined, "normal");
    let tableY = tableStartY + 10;

    medicalRecord.prescription.forEach((item, index) => {
      const rowHeight = 12;

      // Draw row background (alternating)
      if (index % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(20, tableY, 170, rowHeight, "F");
      }

      // Draw row borders
      doc.setDrawColor(200);
      doc.rect(20, tableY, 170, rowHeight);

      // Add text with safe handling
      doc.setFontSize(9);
      doc.text(safeText(item.medicine), 25, tableY + 7);
      doc.text(safeText(item.dosage), 70, tableY + 7);
      doc.text(safeText(item.duration), 110, tableY + 7);

      // Handle long instructions
      const instructions = safeText(item.instructions);
      const instructionLines = doc.splitTextToSize(instructions, 35);
      doc.text(instructionLines[0], 150, tableY + 7);

      tableY += rowHeight;
    });

    // Notes (if any)
    if (medicalRecord.notes && medicalRecord.notes.trim()) {
      tableY += 10;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("ADDITIONAL NOTES", 20, tableY);

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      const notesLines = doc.splitTextToSize(medicalRecord.notes, 170);
      doc.text(notesLines, 20, tableY + 8);
      tableY += notesLines.length * 5 + 8;
    }

    // Footer
    const footerY = Math.max(tableY + 20, 250);

    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.line(20, footerY, 190, footerY);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("This is a computer-generated prescription.", 105, footerY + 8, {
      align: "center",
    });
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      105,
      footerY + 15,
      { align: "center" },
    );

    // Doctor's signature area
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("Doctor's Signature: ________________________", 130, footerY + 25);
    doc.text(`Dr. ${safeText(doctorInfo.name)}`, 130, footerY + 32);

    return doc;
  } catch (error) {
    console.error("Prescription PDF generation error:", error);
    throw new Error(`Failed to generate prescription PDF: ${error.message}`);
  }
};

// Download prescription as PDF
export const downloadPrescription = (
  medicalRecord,
  patientInfo,
  doctorInfo,
) => {
  try {
    const doc = generatePrescriptionPDF(medicalRecord, patientInfo, doctorInfo);
    const patientName = patientInfo.name
      ? patientInfo.name.replace(/\s+/g, "_")
      : "patient";
    const filename = `prescription_${patientName}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error("Download prescription error:", error);
    throw error;
  }
};

// Print prescription
export const printPrescription = (medicalRecord, patientInfo, doctorInfo) => {
  try {
    const doc = generatePrescriptionPDF(medicalRecord, patientInfo, doctorInfo);

    // Create blob and URL for printing
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open in new window for printing
    const printWindow = window.open(pdfUrl, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Clean up URL after printing
          setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
          }, 1000);
        }, 500);
      };
    } else {
      // Fallback: download if popup blocked
      console.warn("Print window blocked, falling back to download");
      downloadPrescription(medicalRecord, patientInfo, doctorInfo);
      URL.revokeObjectURL(pdfUrl);
    }
  } catch (error) {
    console.error("Print prescription error:", error);
    throw error;
  }
};
