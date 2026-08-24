package com.healthcare.backend.service;

import com.healthcare.backend.entity.Role;
import com.healthcare.backend.entity.User;
import com.healthcare.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ===== SAVE / REGISTER =====
    public User saveUser(User user) {
        if (user.getRole() == null) {
            user.setRole(Role.PATIENT);
        }
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // ===== UPDATE USER (FIXED LOGIC) =====
    public User updateUser(User user) {
        // 1. Pehle database mein existing user dhoondo
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Agar naya password khali (blank) ya null hai, toh purana password preserve karo
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword(existing.getPassword());
        } else {
            // 3. Agar naya password diya hai, toh encode karke save karo
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // 4. Baaki fields update karke save karo
        return userRepository.save(user);
    }

    // ===== GET ALL USERS =====
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ===== GET BY ID =====
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    // ===== GET BY EMAIL =====
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ===== DELETE USER =====
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    // ===== SEARCH BY NAME OR EMAIL =====
    public List<User> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllUsers();
        }
        String lower = query.toLowerCase().trim();
        return userRepository.findAll().stream()
                .filter(u -> u.getName().toLowerCase().contains(lower)
                        || u.getEmail().toLowerCase().contains(lower))
                .collect(Collectors.toList());
    }

    // ===== FILTER BY ROLE =====
    public List<User> filterByRole(Role role) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == role)
                .collect(Collectors.toList());
    }

    // ===== CHECK PASSWORD =====
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}