package com.navident.clinic.service;

import com.navident.clinic.model.Insurance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface InsuranceService {
    Insurance createInsurance(Insurance insurance);
    Insurance getInsuranceById(String id);
    List<Insurance> searchInsurance(String query);
    Insurance updateInsurance(String id, Insurance insurance);
    void deleteInsurance(String id);

    List<Insurance> listByPatient(String patientId);
    byte[] exportInsuranceExcel(String patientId);

    Page<Insurance> getAllInsurance(Pageable pageable);
    List<Insurance> getAllInsurance();
    List<Insurance> getInsuranceByAgency(String agencyName);
    List<Insurance> getActiveInsurance();
    List<Insurance> getExpiringSoonInsurance(int days);

    Insurance submitClaim(String id, String claimAmount, String treatmentDetails);
    Insurance approveClaim(String id, String approvedAmount);
    Insurance updateInsuranceStatus(String id, String status);
}
