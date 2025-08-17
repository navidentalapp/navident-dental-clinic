package com.navident.clinic.model;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Document(collection = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    private String password;
    private String firstName;
    private String lastName;
    
    @Indexed(unique = true)
    private String email;
    
    private String role;
    private boolean active = true; // ✅ DEFAULT TO TRUE FOR NEW USERS
    @Builder.Default
    private boolean locked = false; // << Add this line
    private boolean credentialsExpired = false; // password expiry
    private boolean accountExpired =false;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
