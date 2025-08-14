package com.navident.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescriptions")
public class Prescription {
    @Id
    private String id;
    
    private String patientId;
    private String dentistId;
    private String diagnosis;
    private List<String> medications;
    private String notes;
    private LocalDate prescriptionDate;
    private String status;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
