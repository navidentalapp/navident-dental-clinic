package com.navident.clinic.model.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FinanceDto {
    private String id;
    private LocalDate transactionDate;
    private String category;
    private String type;
    private BigDecimal amount;
    private String vendorName;
    private String description;
    private String status;
}
