package com.navident.clinic.controller;

import com.navident.clinic.model.User;
import com.navident.clinic.model.dto.AuthResponse;
import com.navident.clinic.model.dto.LoginRequest;
import com.navident.clinic.security.JwtTokenProvider;
import com.navident.clinic.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login attempt for username: {}", loginRequest.getUsername());
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            String token = jwtTokenProvider.generateToken(authentication);
            Optional<User> userOpt = userService.getUserByUsername(loginRequest.getUsername());
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                AuthResponse authResponse = AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .build();
                
                log.info("Login successful for user: {}", loginRequest.getUsername());
                return ResponseEntity.ok(authResponse);
            } else {
                log.error("User not found after successful authentication: {}", loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("User data not found");
            }
            
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication failed");
        } catch (Exception e) {
            log.error("Unexpected error during login for user: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred");
        }
    }
}
