package com.navident.clinic.controller;

import com.navident.clinic.model.User;
import com.navident.clinic.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@Slf4j
@PreAuthorize("hasRole('ADMINISTRATOR')")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<User> create(@Valid @RequestBody User user) {
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // ✅ ENSURE NEW USERS ARE ACTIVE BY DEFAULT
        if (user.isActive() == false) {
            user.setActive(true);
        }
        User saved = userService.createUser(user);
        // Remove password from response
        saved.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable String id) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(null); // Don't return password
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<Page<User>> list(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size,
                                           @RequestParam(defaultValue = "createdAt") String sortBy,
                                           @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Page<User> result = userService.getAllUsers(PageRequest.of(page, size, sort));
        // Remove passwords from response
        result.getContent().forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public List<User> search(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable String id, @Valid @RequestBody User user) {
        User updated = userService.updateUser(id, user);
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ NEW ENDPOINT: Toggle User Active Status
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<User> toggleActiveStatus(@PathVariable String id) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Toggle the active status
        user.setActive(!user.isActive());
        User updated = userService.updateUser(id, user);
        
        log.info("User {} active status changed to: {}", user.getUsername(), user.isActive());
        
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<Void> changePassword(@PathVariable String id, @RequestBody Map<String, String> request) {
        String newPassword = request.get("password");
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().build();
        }
        
        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userService.updateUser(id, user);
        
        return ResponseEntity.ok().build();
    }
}
