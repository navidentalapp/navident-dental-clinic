package com.navident.clinic.util;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.navident.clinic.model.*;
import lombok.experimental.UtilityClass;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;

@UtilityClass
public class PdfUtil {

    private static final Font TITLE_FONT  = new Font(Font.HELVETICA, 16, Font.BOLD, Color.BLUE);
    private static final Font HEADER_FONT = new Font(Font.HELVETICA, 12, Font.BOLD, Color.WHITE);
    private static final Font CELL_FONT   = new Font(Font.HELVETICA, 11, Font.NORMAL, Color.BLACK);

    public byte[] generatePatientPdf(Patient p) {
        return buildPdf(doc -> {
            doc.add(new Paragraph("Patient Summary", TITLE_FONT));
            doc.add(new Paragraph(" "));
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            addRow(table, "Full Name", p.getFirstName() + " " + p.getLastName());
            addRow(table, "Email", p.getEmail());
            addRow(table, "Mobile", p.getMobileNumber());
            addRow(table, "Gender", p.getGender());
            addRow(table, "DOB", p.getDateOfBirth());
            addRow(table, "Blood Group", p.getBloodGroup());
            addRow(table, "Allergies", p.getAllergies() != null ? String.join(", ", p.getAllergies()) : "");
            doc.add(table);
        });
    }

    public byte[] generateBillPdf(Bill b) {
        return buildPdf(doc -> {
            doc.add(new Paragraph("Bill #" + b.getBillId(), TITLE_FONT));
            doc.add(new Paragraph(" "));
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(80);
            addRow(table, "Patient", b.getPatientName());
            addRow(table, "Dentist", b.getDentistName());
            addRow(table, "Amount Due", currency(b.getAmountDue()));
            addRow(table, "Amount Paid", currency(b.getAmountPaid()));
            addRow(table, "Status", b.getPaymentStatus());
            doc.add(table);
        });
    }

    public byte[] generateDentistPdf(ConsultantDentist d) {
        return buildPdf(doc -> {
            doc.add(new Paragraph("Dentist Info", TITLE_FONT));
            doc.add(new Paragraph(" "));
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            addRow(table, "Name", d.getFirstName() + " " + d.getLastName());
            addRow(table, "License", d.getLicenseNumber());
            addRow(table, "Email", d.getEmail());
            addRow(table, "Mobile", d.getMobileNumber());
            addRow(table, "Specializations", d.getSpecializations() != null ? String.join(", ", d.getSpecializations()) : "");
            addRow(table, "Active", d.isActive() ? "YES" : "NO");
            doc.add(table);
        });
    }

    public byte[] generatePrescriptionPdf(Prescription p) {
        return buildPdf(doc -> {
            doc.add(new Paragraph("Prescription", TITLE_FONT));
            doc.add(new Paragraph(" "));
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            addRow(table, "Patient", p.getPatientName());
            addRow(table, "Dentist", p.getDentistName());
            addRow(table, "Diagnosis", p.getDiagnosis());
            addRow(table, "Medications", p.getMedications());
            addRow(table, "Status", p.getStatus());
            doc.add(table);
        });
    }

    private String currency(java.math.BigDecimal amount) {
        if (amount == null) return "";
        return NumberFormat.getCurrencyInstance().format(amount);
    }

    private byte[] buildPdf(DocumentWriter writer) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document doc = new Document();
            PdfWriter.getInstance(doc, baos);
            doc.open();
            writer.write(doc);
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error building PDF: " + e.getMessage(), e);
        }
    }

    private void addRow(PdfPTable table, String key, String value) {
        PdfPCell keyCell = new PdfPCell(new Phrase(key, HEADER_FONT));
        keyCell.setBackgroundColor(Color.GRAY);
        keyCell.setPadding(5);
        table.addCell(keyCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "", CELL_FONT));
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }

    @FunctionalInterface
    public interface DocumentWriter {
        void write(Document doc) throws Exception;
    }
}
