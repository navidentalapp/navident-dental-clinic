package com.navident.clinic.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "treatments")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Treatment {
    @Id
    private String id;
    private String treatmentName;
    private String category;
    private String description;
    private boolean availableForBooking;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
