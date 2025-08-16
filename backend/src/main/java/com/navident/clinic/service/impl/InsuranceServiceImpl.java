package com.navident.clinic.service.impl;

import com.navident.clinic.exception.ResourceNotFoundException;
import com.navident.clinic.model.Insurance;
import com.navident.clinic.repository.InsuranceRepository;
import com.navident.clinic.service.InsuranceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InsuranceServiceImpl implements InsuranceService {

    private final InsuranceRepository repo;

    @Override
    public Insurance createInsurance(Insurance insurance) {
        insurance.setCreatedAt(LocalDateTime.now());
        insurance.setUpdatedAt(LocalDateTime.now());
        return repo.save(insurance);
    }

    @Override
    public Insurance getInsuranceById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Insurance", "id", id));
    }

    @Override
    public List<Insurance> searchInsurance(String query) {
        return repo.findByAgencyNameContainingIgnoreCase(query);
    }

    @Override
    public Insurance updateInsurance(String id, Insurance insurance) {
        Insurance existing = getInsuranceById(id);
        existing.setAgencyName(insurance.getAgencyName());
        existing.setPolicyNumber(insurance.getPolicyNumber());
        existing.setPolicyEndDate(insurance.getPolicyEndDate());
        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }

    @Override
    public void deleteInsurance(String id) {
        repo.delete(getInsuranceById(id));
    }

    @Override
    public List<Insurance> listByPatient(String patientId) {
        return repo.findByPatientId(patientId);
    }

    @Override
    public byte[] exportInsuranceExcel(String patientId) {
        return new byte[0]; // Call ExcelUtil in full impl
    }

    @Override
    public Page<Insurance> getAllInsurance(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Override
    public List<Insurance> getAllInsurance() {
        return repo.findAll();
    }

    @Override
    public List<Insurance> getInsuranceByAgency(String agencyName) {
        return repo.findByAgencyName(agencyName);
    }

    @Override
    public List<Insurance> getActiveInsurance() {
        return repo.findByActiveTrue();
    }

    @Override
    public List<Insurance> getExpiringSoonInsurance(int days) {
        LocalDate now = LocalDate.now();
        return repo.findByPolicyEndDateBetweenAndActiveTrue(now, now.plusDays(days));
    }

    @Override
    public Insurance submitClaim(String id, String claimAmount, String treatmentDetails) {
        Insurance ins = getInsuranceById(id);
        ins.setClaimSubmitted(true);
        ins.setClaimAmount(new BigDecimal(claimAmount));
        ins.setTreatmentDescription(treatmentDetails);
        ins.setUpdatedAt(LocalDateTime.now());
        return repo.save(ins);
    }

    @Override
    public Insurance approveClaim(String id, String approvedAmount) {
        Insurance ins = getInsuranceById(id);
        ins.setClaimApproved(true);
        ins.setApprovedClaimAmount(new BigDecimal(approvedAmount));
        ins.setUpdatedAt(LocalDateTime.now());
        return repo.save(ins);
    }

    @Override
    public Insurance updateInsuranceStatus(String id, String status) {
        Insurance ins = getInsuranceById(id);
        ins.setStatus(status);
        ins.setUpdatedAt(LocalDateTime.now());
        return repo.save(ins);
    }
}
