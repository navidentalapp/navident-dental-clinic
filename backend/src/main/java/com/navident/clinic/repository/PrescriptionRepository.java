package com.navident.clinic.repository;

import com.navident.clinic.model.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface PrescriptionRepository extends MongoRepository<Prescription, String> {
    List<Prescription> findByPatientNameContainingIgnoreCaseOrDentistNameContainingIgnoreCase(String patientName, String dentistName);
    List<Prescription> findByPatientId(String patientId);
    List<Prescription> findByDentistId(String dentistId);
    List<Prescription> findByPrescriptionDateBetween(LocalDate start, LocalDate end);
    List<Prescription> findByStatus(String status);
    List<Prescription> findByRequiresFollowUpTrue();
}
