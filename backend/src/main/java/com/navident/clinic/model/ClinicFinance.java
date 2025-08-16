package com.navident.clinic.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "finances")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicFinance {
    @Id
    private String id;
    private LocalDate transactionDate;
    private String category; // REVENUE, EXPENSE
    private String type; // Consultation, Supplies, Salary, etc.
    private BigDecimal amount;
    private String vendorName;
    private String description;
    private String status;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
