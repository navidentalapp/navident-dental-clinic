package com.navident.clinic.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class PatientDto {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String gender;
    private String bloodGroup;
    private String dateOfBirth;
    private List<String> allergies;

    private AddressDto address;

    @Data
    public static class AddressDto {
        private String street;
        private String city;
        private String state;
        private String postalCode;
        private String country;
    }

    public String getFullName() {
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }
}
