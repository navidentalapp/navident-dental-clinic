package com.navident.clinic.model.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PrescriptionDto {
    private String id;
    private String patientId;
    private String patientName;
    private String dentistId;
    private String dentistName;
    private LocalDate prescriptionDate;
    private String diagnosis;
    private String medications;
    private String notes;
    private boolean requiresFollowUp;
    private String status;
}
