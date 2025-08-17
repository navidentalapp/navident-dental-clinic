package com.navident.clinic.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "insurances")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insurance {
    @Id
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
    private String status; // ACTIVE, EXPIRED, CLAIMED, APPROVED
    private String treatmentDescription;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
