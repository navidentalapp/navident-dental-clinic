package com.navident.clinic.service.impl;

import com.navident.clinic.exception.ResourceNotFoundException;
import com.navident.clinic.model.Treatment;
import com.navident.clinic.repository.TreatmentRepository;
import com.navident.clinic.service.TreatmentService;
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
public class TreatmentServiceImpl implements TreatmentService {

    private final TreatmentRepository repo;

    @Override
    public Treatment createTreatment(Treatment treatment) {
        treatment.setCreatedAt(LocalDateTime.now());
        treatment.setUpdatedAt(LocalDateTime.now());
        return repo.save(treatment);
    }

    @Override
    public Treatment getTreatmentById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treatment", "id", id));
    }

    @Override
    public List<Treatment> searchTreatments(String query) {
        return repo.findByTreatmentNameContainingIgnoreCase(query);
    }

    @Override
    public Treatment updateTreatment(String id, Treatment treatment) {
        Treatment existing = getTreatmentById(id);
        existing.setTreatmentName(treatment.getTreatmentName());
        existing.setDescription(treatment.getDescription());
        existing.setCategory(treatment.getCategory());
        existing.setAvailableForBooking(treatment.isAvailableForBooking());
        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }

    @Override
    public void deleteTreatment(String id) {
        repo.delete(getTreatmentById(id));
    }

    @Override
    public List<Treatment> listActiveTreatments() {
        return repo.findByAvailableForBookingTrue();
    }

    @Override
    public Page<Treatment> getAllTreatments(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Override
    public List<Treatment> getAllTreatments() {
        return repo.findAll();
    }

    @Override
    public List<Treatment> getTreatmentsByCategory(String category) {
        return repo.findByCategory(category);
    }

    @Override
    public boolean existsByTreatmentName(String treatmentName) {
        return repo.existsByTreatmentName(treatmentName);
    }
}
