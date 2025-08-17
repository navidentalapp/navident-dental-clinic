package com.navident.clinic.service;

import com.navident.clinic.model.ConsultantDentist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface DentistService {
    ConsultantDentist createDentist(ConsultantDentist dentist);
    ConsultantDentist getDentistById(String id);
    List<ConsultantDentist> searchDentists(String query);
    ConsultantDentist updateDentist(String id, ConsultantDentist dentist);
    void deleteDentist(String id);

    byte[] exportDentistsToExcel();
    byte[] generateDentistPdf(String id);

    Page<ConsultantDentist> getAllDentists(Pageable pageable);
    List<ConsultantDentist> getAllDentists();
    List<ConsultantDentist> getActiveDentists();
    ConsultantDentist getChiefDentist(); // NEW METHOD
    List<ConsultantDentist> getDentistsBySpecialization(String specialization);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsByEmail(String email);
    boolean existsByLicenseNumber(String licenseNumber);
}
