package com.navident.clinic.service;

import com.navident.clinic.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PatientService {
    Patient createPatient(Patient patient);
    Patient getPatientById(String id);
    List<Patient> searchPatients(String query);
    Patient updatePatient(String id, Patient patient);
    void deletePatient(String id);

    Page<Patient> getAllPatients(Pageable pageable);
    List<Patient> getAllPatients();
    List<Patient> getPatientsByCity(String city);
    List<Patient> getPatientsByMobileNumber(String mobileNumber);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsByEmail(String email);
}
