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
@Document(collection = "clinic_finance")
public class ClinicFinance {
    @Id
    private String id;
    
    private String description;
    private BigDecimal amount;
    private String category;
    private String type; // INCOME or EXPENSE
    private LocalDate transactionDate;
    private String vendorName;
    private String status;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
