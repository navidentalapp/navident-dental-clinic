package com.navident.clinic.service;

import com.navident.clinic.model.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;

public interface PrescriptionService {
    Prescription createPrescription(Prescription prescription);
    Prescription getPrescriptionById(String id);
    List<Prescription> searchPrescriptions(String query);
    Prescription updatePrescription(String id, Prescription prescription);
    void deletePrescription(String id);

    byte[] exportPrescriptionsExcel(String patientId);
    byte[] generatePrescriptionPdf(String id);

    Page<Prescription> getAllPrescriptions(Pageable pageable);
    List<Prescription> getAllPrescriptions();
    List<Prescription> getPrescriptionsByPatientId(String patientId);
    List<Prescription> getPrescriptionsByDentistId(String dentistId);
    List<Prescription> getPrescriptionsByDateRange(LocalDate startDate, LocalDate endDate);
    List<Prescription> getActivePrescriptions();
    List<Prescription> getPrescriptionsRequiringFollowUp();
    byte[] exportAllPrescriptionsExcel(LocalDate startDate, LocalDate endDate);
    Prescription updatePrescriptionStatus(String id, String status);
}
