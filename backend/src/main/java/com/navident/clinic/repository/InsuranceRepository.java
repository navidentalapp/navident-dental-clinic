package com.navident.clinic.repository;

import com.navident.clinic.model.Insurance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface InsuranceRepository extends MongoRepository<Insurance, String> {
    List<Insurance> findByPatientId(String patientId);
    List<Insurance> findByAgencyNameContainingIgnoreCase(String agencyName);
    List<Insurance> findByAgencyName(String agencyName);
    List<Insurance> findByActiveTrue();
    List<Insurance> findByPolicyEndDateBetweenAndActiveTrue(LocalDate start, LocalDate end);
}
