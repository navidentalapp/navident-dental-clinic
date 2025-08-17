package com.navident.clinic.service.impl;

import com.navident.clinic.exception.ResourceNotFoundException;
import com.navident.clinic.model.Prescription;
import com.navident.clinic.repository.PrescriptionRepository;
import com.navident.clinic.service.PrescriptionService;
import com.navident.clinic.util.ExcelUtil;
import com.navident.clinic.util.PdfUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository repo;

    @Override
    public Prescription createPrescription(Prescription prescription) {
        prescription.setCreatedAt(LocalDateTime.now());
        prescription.setUpdatedAt(LocalDateTime.now());
        return repo.save(prescription);
    }

    @Override
    public Prescription getPrescriptionById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));
    }

    @Override
    public List<Prescription> searchPrescriptions(String query) {
        return repo.findByPatientNameContainingIgnoreCaseOrDentistNameContainingIgnoreCase(query, query);
    }

    @Override
    public Prescription updatePrescription(String id, Prescription prescription) {
        Prescription existing = getPrescriptionById(id);
        existing.setDiagnosis(prescription.getDiagnosis());
        existing.setMedications(prescription.getMedications());
        existing.setNotes(prescription.getNotes());
        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }

    @Override
    public void deletePrescription(String id) {
        repo.delete(getPrescriptionById(id));
    }

    @Override
    public byte[] exportPrescriptionsExcel(String patientId) {
        return ExcelUtil.prescriptionsToExcel(repo.findByPatientId(patientId));
    }

    @Override
    public byte[] generatePrescriptionPdf(String id) {
        return PdfUtil.generatePrescriptionPdf(getPrescriptionById(id));
    }

    @Override
    public Page<Prescription> getAllPrescriptions(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Override
    public List<Prescription> getAllPrescriptions() {
        return repo.findAll();
    }

    @Override
    public List<Prescription> getPrescriptionsByPatientId(String patientId) {
        return repo.findByPatientId(patientId);
    }

    @Override
    public List<Prescription> getPrescriptionsByDentistId(String dentistId) {
        return repo.findByDentistId(dentistId);
    }

    @Override
    public List<Prescription> getPrescriptionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return repo.findByPrescriptionDateBetween(startDate, endDate);
    }

    @Override
    public List<Prescription> getActivePrescriptions() {
        return repo.findByStatus("ACTIVE");
    }

    @Override
    public List<Prescription> getPrescriptionsRequiringFollowUp() {
        return repo.findByRequiresFollowUpTrue();
    }

    @Override
    public byte[] exportAllPrescriptionsExcel(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return ExcelUtil.prescriptionsToExcel(repo.findByPrescriptionDateBetween(startDate, endDate));
        }
        return ExcelUtil.prescriptionsToExcel(repo.findAll());
    }

    @Override
    public Prescription updatePrescriptionStatus(String id, String status) {
        Prescription existing = getPrescriptionById(id);
        existing.setStatus(status);
        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }
}
