package com.navident.clinic.repository;

import com.navident.clinic.model.Treatment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TreatmentRepository extends MongoRepository<Treatment, String> {
    List<Treatment> findByTreatmentNameContainingIgnoreCase(String treatmentName);
    List<Treatment> findByAvailableForBookingTrue();
    List<Treatment> findByCategory(String category);
    boolean existsByTreatmentName(String treatmentName);
}
