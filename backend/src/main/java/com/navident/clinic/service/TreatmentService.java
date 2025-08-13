package com.navident.clinic.service;

import com.navident.clinic.model.Treatment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TreatmentService {
    Treatment createTreatment(Treatment treatment);
    Treatment getTreatmentById(String id);
    List<Treatment> searchTreatments(String query);
    Treatment updateTreatment(String id, Treatment treatment);
    void deleteTreatment(String id);

    List<Treatment> listActiveTreatments();

    Page<Treatment> getAllTreatments(Pageable pageable);
    List<Treatment> getAllTreatments();
    List<Treatment> getTreatmentsByCategory(String category);
    boolean existsByTreatmentName(String treatmentName);
}
