package com.navident.clinic.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "bills")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {
    @Id
    private String id;
    private String billId;
    private String patientId;
    private String patientName;
    private String dentistId;
    private String dentistName;
    private LocalDate billDate;
    private BigDecimal amountDue;
    private BigDecimal amountPaid;
    private LocalDate dueDate;
    private String paymentStatus; // PAID, PENDING, CANCELLED

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
