package com.navident.clinic.model.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AppointmentDto {
    private String id;
    private String patientId;
    private String patientName;
    private String dentistId;
    private String dentistName;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private String status;
    private String notes;
}
