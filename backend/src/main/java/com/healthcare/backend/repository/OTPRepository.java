package com.healthcare.backend.repository;

import com.healthcare.backend.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OTPRepository extends JpaRepository<OTP, Long> {

    Optional<OTP> findByEmailAndOtpAndPurpose(String email, String otp, String purpose);

    List<OTP> findByEmailAndPurposeAndVerifiedFalse(String email, String purpose);

    void deleteByEmailAndPurpose(String email, String purpose);

    void deleteByExpiryTimeBefore(LocalDateTime time);
}