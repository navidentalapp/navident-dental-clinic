package com.navident.clinic.repository;

import com.navident.clinic.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PatientRepository extends MongoRepository<Patient, String> {
    List<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    List<Patient> findByAddress_City(String city);
    List<Patient> findByMobileNumber(String mobileNumber);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsByEmail(String email);
}
