package com.navident.clinic.service;

import com.navident.clinic.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserById(String id);
    Optional<User> getUserByUsername(String username);
    List<User> getAllUsers();
    Page<User> getAllUsers(Pageable pageable); // ✅ ADDED PAGINATION
    List<User> searchUsers(String query); // ✅ ADDED SEARCH
    User updateUser(String id, User user);
    void deleteUser(String id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
