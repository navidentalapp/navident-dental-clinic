package com.navident.clinic.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.time.LocalDateTime;

@Data
@Document(collection = "patients")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String gender;
    private String bloodGroup;
    private String dateOfBirth;
    private List<String> allergies;
    private Address address;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Nested class for address common in healthcare record systems
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Address {
        private String street;
        private String city;
        private String state;
        private String postalCode;
        private String country;
    }
}
