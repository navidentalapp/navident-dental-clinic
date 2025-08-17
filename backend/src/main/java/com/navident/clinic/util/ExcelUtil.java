package com.navident.clinic.util;

import com.navident.clinic.model.*;
import lombok.experimental.UtilityClass;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@UtilityClass
public class ExcelUtil {

    private byte[] toByteArray(Workbook workbook) throws IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] appointmentsToExcel(List<Appointment> list) {
        return writeSimpleExcel("Appointments",
                new String[]{"ID", "Patient", "Dentist", "Date", "Time", "Status", "Notes"},
                list, (row, ap) -> {
                    row.createCell(0).setCellValue(ap.getId());
                    row.createCell(1).setCellValue(ap.getPatientName());
                    row.createCell(2).setCellValue(ap.getDentistName());
                    row.createCell(3).setCellValue(ap.getAppointmentDate() != null ? ap.getAppointmentDate().toString() : "");
                    row.createCell(4).setCellValue(ap.getAppointmentTime() != null ? ap.getAppointmentTime() : "");
                    row.createCell(5).setCellValue(ap.getStatus());
                    row.createCell(6).setCellValue(ap.getNotes() != null ? ap.getNotes() : "");
                });
    }

    public byte[] patientsToExcel(List<Patient> list) {
        return writeSimpleExcel("Patients",
                new String[]{"ID", "Name", "Email", "Mobile", "Gender", "DOB", "Blood Group", "City"},
                list, (row, p) -> {
                    row.createCell(0).setCellValue(p.getId());
                    row.createCell(1).setCellValue(p.getFirstName() + " " + p.getLastName());
                    row.createCell(2).setCellValue(p.getEmail());
                    row.createCell(3).setCellValue(p.getMobileNumber());
                    row.createCell(4).setCellValue(p.getGender());
                    row.createCell(5).setCellValue(p.getDateOfBirth());
                    row.createCell(6).setCellValue(p.getBloodGroup());
                    row.createCell(7).setCellValue(p.getAddress() != null ? p.getAddress().getCity() : "");
                });
    }

    public byte[] billsToExcel(List<Bill> list) {
        return writeSimpleExcel("Bills",
                new String[]{"ID", "Bill#", "Patient", "Dentist", "Bill Date", "Due Date", "Amount Due", "Amount Paid", "Status"},
                list, (row, b) -> {
                    row.createCell(0).setCellValue(b.getId());
                    row.createCell(1).setCellValue(b.getBillId());
                    row.createCell(2).setCellValue(b.getPatientName());
                    row.createCell(3).setCellValue(b.getDentistName());
                    row.createCell(4).setCellValue(b.getBillDate() != null ? b.getBillDate().toString() : "");
                    row.createCell(5).setCellValue(b.getDueDate() != null ? b.getDueDate().toString() : "");
                    row.createCell(6).setCellValue(b.getAmountDue() != null ? b.getAmountDue().toString() : "");
                    row.createCell(7).setCellValue(b.getAmountPaid() != null ? b.getAmountPaid().toString() : "");
                    row.createCell(8).setCellValue(b.getPaymentStatus());
                });
    }

    public byte[] dentistsToExcel(List<ConsultantDentist> list) {
        return writeSimpleExcel("Dentists",
                new String[]{"ID", "First Name", "Last Name", "License#", "Email", "Mobile", "Specializations", "Active"},
                list, (row, d) -> {
                    row.createCell(0).setCellValue(d.getId());
                    row.createCell(1).setCellValue(d.getFirstName());
                    row.createCell(2).setCellValue(d.getLastName());
                    row.createCell(3).setCellValue(d.getLicenseNumber());
                    row.createCell(4).setCellValue(d.getEmail());
                    row.createCell(5).setCellValue(d.getMobileNumber());
                    row.createCell(6).setCellValue(d.getSpecializations() != null ? String.join(", ", d.getSpecializations()) : "");
                    row.createCell(7).setCellValue(d.isActive());
                });
    }

    public byte[] prescriptionsToExcel(List<Prescription> list) {
        return writeSimpleExcel("Prescriptions",
                new String[]{"ID", "Patient", "Dentist", "Date", "Diagnosis", "Medications", "Status"},
                list, (row, p) -> {
                    row.createCell(0).setCellValue(p.getId());
                    row.createCell(1).setCellValue(p.getPatientName());
                    row.createCell(2).setCellValue(p.getDentistName());
                    row.createCell(3).setCellValue(p.getPrescriptionDate() != null ? p.getPrescriptionDate().toString() : "");
                    row.createCell(4).setCellValue(p.getDiagnosis());
                    row.createCell(5).setCellValue(p.getMedications());
                    row.createCell(6).setCellValue(p.getStatus());
                });
    }

    private <T> byte[] writeSimpleExcel(String sheetName, String[] headers, List<T> data, RowFiller<T> filler) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(sheetName);
            int rowIdx = 0;
            Row headerRow = sheet.createRow(rowIdx++);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }
            for (T obj : data) {
                Row row = sheet.createRow(rowIdx++);
                filler.fill(row, obj);
            }
            for (int i = 0; i < headers.length; i++) sheet.autoSizeColumn(i);
            return toByteArray(workbook);
        } catch (IOException e) {
            throw new RuntimeException("Error generating Excel for " + sheetName, e);
        }
    }

    @FunctionalInterface
    public interface RowFiller<T> {
        void fill(Row row, T t);
    }
}
