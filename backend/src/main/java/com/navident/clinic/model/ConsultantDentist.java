package com.navident.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "consultant_dentists")
public class ConsultantDentist {
    @Id
    private String id;
    
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private List<String> specializations;
    private String qualification;
    private Integer experienceYears;
    private BigDecimal consultationFee;
    private boolean active = true;
    private boolean chiefDentist = false;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
