package com.navident.clinic.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "appointments")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @Id
    private String id;
    private String patientId;
    private String patientName;
    private String dentistId;
    private String dentistName;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private String status; // e.g. SCHEDULED, COMPLETED, CANCELLED
    private String notes;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
