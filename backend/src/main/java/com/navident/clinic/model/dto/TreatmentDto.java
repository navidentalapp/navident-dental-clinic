package com.navident.clinic.model.dto;

import lombok.Data;

@Data
public class TreatmentDto {
    private String id;
    private String treatmentName;
    private String category;
    private String description;
    private boolean availableForBooking;
}
