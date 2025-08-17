package com.navident.clinic.service.impl;

import com.navident.clinic.exception.ResourceNotFoundException;
import com.navident.clinic.model.ConsultantDentist;
import com.navident.clinic.repository.DentistRepository;
import com.navident.clinic.service.DentistService;
import com.navident.clinic.util.ExcelUtil;
import com.navident.clinic.util.PdfUtil;
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
public class DentistServiceImpl implements DentistService {

    private final DentistRepository repo;

    @Override
    public ConsultantDentist createDentist(ConsultantDentist dentist) {
        // Handle chief dentist logic - only one chief dentist allowed
        if (dentist.isChiefDentist()) {
            // Remove chief dentist status from all other dentists
            List<ConsultantDentist> currentChiefDentists = repo.findByChiefDentistTrue();
            currentChiefDentists.forEach(d -> {
                d.setChiefDentist(false);
                d.setUpdatedAt(LocalDateTime.now());
            });
            repo.saveAll(currentChiefDentists);
        }
        
        dentist.setCreatedAt(LocalDateTime.now());
        dentist.setUpdatedAt(LocalDateTime.now());
        return repo.save(dentist);
    }

    @Override
    public ConsultantDentist getDentistById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dentist", "id", id));
    }

    @Override
    public List<ConsultantDentist> searchDentists(String query) {
        return repo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
    }

    @Override
    public ConsultantDentist updateDentist(String id, ConsultantDentist dentist) {
        ConsultantDentist existing = getDentistById(id);
        
        // Handle chief dentist logic
        if (dentist.isChiefDentist() && !existing.isChiefDentist()) {
            // Remove chief dentist status from all other dentists
            List<ConsultantDentist> currentChiefDentists = repo.findByChiefDentistTrue();
            currentChiefDentists.forEach(d -> {
                if (!d.getId().equals(id)) {
                    d.setChiefDentist(false);
                    d.setUpdatedAt(LocalDateTime.now());
                }
            });
            repo.saveAll(currentChiefDentists);
        }
        
        existing.setFirstName(dentist.getFirstName());
        existing.setLastName(dentist.getLastName());
        existing.setEmail(dentist.getEmail());
        existing.setMobileNumber(dentist.getMobileNumber());
        existing.setSpecializations(dentist.getSpecializations());
        existing.setActive(dentist.isActive());
        existing.setChiefDentist(dentist.isChiefDentist());
        existing.setQualification(dentist.getQualification());
        existing.setExperienceYears(dentist.getExperienceYears());
        existing.setConsultationFee(dentist.getConsultationFee());
        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }

    @Override
    public void deleteDentist(String id) {
        repo.delete(getDentistById(id));
    }

    @Override
    public byte[] exportDentistsToExcel() {
        return ExcelUtil.dentistsToExcel(repo.findAll());
    }

    @Override
    public byte[] generateDentistPdf(String id) {
        return PdfUtil.generateDentistPdf(getDentistById(id));
    }

    @Override
    public Page<ConsultantDentist> getAllDentists(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Override
    public List<ConsultantDentist> getAllDentists() {
        return repo.findAll();
    }

    @Override
    public List<ConsultantDentist> getActiveDentists() {
        return repo.findByActiveTrue();
    }

    @Override
    public ConsultantDentist getChiefDentist() {
        List<ConsultantDentist> chiefs = repo.findByChiefDentistTrue();
        return chiefs.isEmpty() ? null : chiefs.get(0);
    }

    @Override
    public List<ConsultantDentist> getDentistsBySpecialization(String specialization) {
        return repo.findBySpecializationsContaining(specialization);
    }

    @Override
    public boolean existsByMobileNumber(String mobileNumber) {
        return repo.existsByMobileNumber(mobileNumber);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repo.existsByEmail(email);
    }

    @Override
    public boolean existsByLicenseNumber(String licenseNumber) {
        return repo.existsByLicenseNumber(licenseNumber);
    }
}
