package com.navident.clinic.service.impl;

import com.navident.clinic.exception.ResourceNotFoundException;
import com.navident.clinic.model.Patient;
import com.navident.clinic.repository.PatientRepository;
import com.navident.clinic.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository repo;

    @Override
    public Patient createPatient(Patient patient) {
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());
        return repo.save(patient);
    }

    @Override
    public Patient getPatientById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
    }

    @Override
    public List<Patient> searchPatients(String query) {
        return repo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
    }

    @Override
    public Patient updatePatient(String id, Patient patient) {
        Patient existing = getPatientById(id);
        existing.setFirstName(patient.getFirstName());
        existing.setLastName(patient.getLastName());
        existing.setEmail(patient.getEmail());
        existing.setAddress(patient.getAddress());
        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }

    @Override
    public void deletePatient(String id) {
        repo.delete(getPatientById(id));
    }

    @Override
    public Page<Patient> getAllPatients(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Override
    public List<Patient> getAllPatients() {
        return repo.findAll();
    }

    @Override
    public List<Patient> getPatientsByCity(String city) {
        return repo.findByAddress_City(city);
    }

    @Override
    public List<Patient> getPatientsByMobileNumber(String mobileNumber) {
        return repo.findByMobileNumber(mobileNumber);
    }

    @Override
    public boolean existsByMobileNumber(String mobileNumber) {
        return repo.existsByMobileNumber(mobileNumber);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repo.existsByEmail(email);
    }
}
