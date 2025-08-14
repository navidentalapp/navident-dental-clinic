package com.navident.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bills")
public class Bill {
    @Id
    private String id;
    
    private String patientId;
    private String billNumber;
    private LocalDate billDate;
    private BigDecimal totalAmount;
    private BigDecimal amountPaid;
    private BigDecimal amountDue;
    private String paymentStatus;
    private List<String> treatments;
    private String notes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
