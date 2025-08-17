package com.navident.clinic.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "prescriptions")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {
    @Id
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
    private String status; // ACTIVE, COMPLETED, EXPIRED

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
