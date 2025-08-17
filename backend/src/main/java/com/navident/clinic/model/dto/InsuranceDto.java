package com.navident.clinic.model.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InsuranceDto {
    private String id;
    private String patientId;
    private String agencyName;
    private String policyNumber;
    private LocalDate policyEndDate;
    private boolean active;
    private boolean claimSubmitted;
    private boolean claimApproved;
    private BigDecimal claimAmount;
    private BigDecimal approvedClaimAmount;
    private String status;
    private String treatmentDescription;
}
