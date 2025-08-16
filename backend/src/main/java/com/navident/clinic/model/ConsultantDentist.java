package com.navident.clinic.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.time.LocalDateTime;

@Data
@Document(collection = "dentists")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultantDentist {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String licenseNumber;
    private String email;
    private String mobileNumber;
    private List<String> specializations;
    private boolean active;
    private boolean chiefDentist; // NEW FIELD for chief dentist
    private String qualification;
    private Integer experienceYears;
    private String consultationFee;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
