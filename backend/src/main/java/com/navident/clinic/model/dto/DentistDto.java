package com.navident.clinic.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class DentistDto {
    private String id;
    private String firstName;
    private String lastName;
    private String licenseNumber;
    private String email;
    private String mobileNumber;
    private List<String> specializations;
    private boolean active;
    private boolean chiefDentist; // ✅ ADDED MISSING FIELD
    private String qualification;
    private Integer experienceYears;
    private String consultationFee;
}
