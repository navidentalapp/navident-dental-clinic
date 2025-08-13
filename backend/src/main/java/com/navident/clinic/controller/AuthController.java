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
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login attempt for username: {}", loginRequest.getUsername());

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            // Generate JWT token
            String jwt = jwtTokenProvider.generateToken(authentication);
            
            // Get user details
            Optional<User> userOptional = userService.getUserByUsername(loginRequest.getUsername());
            if (userOptional.isEmpty()) {
                log.error("User not found after authentication: {}", loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("User not found after authentication");
            }

            User user = userOptional.get();
            
            // Create response
            AuthResponse authResponse = AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();

            log.info("Login successful for username: {}", loginRequest.getUsername());
            return ResponseEntity.ok(authResponse);

        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for username: {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
        } catch (AuthenticationException e) {
            log.error("Authentication failed for username: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Authentication failed");
        } catch (Exception e) {
            log.error("Login error for username: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Internal server error");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String token) {
        try {
            // Remove Bearer prefix
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Validate current token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
            }

            // Get username from token
            String username = jwtTokenProvider.getUsernameFromToken(token);
            
            // Generate new token
            String newToken = jwtTokenProvider.generateTokenFromUsername(username);
            
            // Get user details
            Optional<User> userOptional = userService.getUserByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }

            User user = userOptional.get();
            
            // Create response
            AuthResponse authResponse = AuthResponse.builder()
                .token(newToken)
                .type("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();

            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            log.error("Token refresh error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Token refresh failed");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            // Remove Bearer prefix
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Validate token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
            }

            // Get username from token
            String username = jwtTokenProvider.getUsernameFromToken(token);
            
            // Get user details
            Optional<User> userOptional = userService.getUserByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }

            User user = userOptional.get();
            
            // Remove password from response
            user.setPassword(null);
            
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            log.error("Get current user error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to get user details");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // For JWT, logout is handled on the client side by removing the token
        // Server-side logout would require token blacklisting which is optional
        return ResponseEntity.ok("Logged out successfully");
    }
}
