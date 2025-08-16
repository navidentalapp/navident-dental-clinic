package com.navident.clinic.model.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillDto {
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
    private String paymentStatus;
}
