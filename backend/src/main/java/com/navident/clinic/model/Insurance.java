package com.navident.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "insurance")
public class Insurance {
    @Id
    private String id;
    
    private String patientId;
    private String agencyName;
    private String policyNumber;
    private LocalDate policyEndDate;
    private String status;
    private boolean claimSubmitted = false;
    private BigDecimal claimAmount;
    private String treatmentDescription;
    private boolean claimApproved = false;
    private BigDecimal approvedClaimAmount;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
