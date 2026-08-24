package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Role;
import com.healthcare.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Service is calling this method
    Optional<User> findByEmail(String email);
    
    // Search logic (Name OR Email)
    List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
    
    // Filter logic using Role Enum
    List<User> findByRole(Role role);
}