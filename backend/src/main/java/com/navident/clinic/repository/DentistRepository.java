package com.navident.clinic.repository;

import com.navident.clinic.model.ConsultantDentist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DentistRepository extends MongoRepository<ConsultantDentist, String> {
    List<ConsultantDentist> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    List<ConsultantDentist> findByActiveTrue();
    List<ConsultantDentist> findByChiefDentistTrue(); // NEW METHOD
    List<ConsultantDentist> findBySpecializationsContaining(String specialization);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsByEmail(String email);
    boolean existsByLicenseNumber(String licenseNumber);
}
