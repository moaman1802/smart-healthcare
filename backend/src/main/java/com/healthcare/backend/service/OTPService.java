package com.healthcare.backend.service;

import com.healthcare.backend.entity.OTP;
import com.healthcare.backend.repository.OTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OTPService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 3;

    @Autowired
    private OTPRepository otpRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateOTP() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    @Transactional
    public OTP createOTP(String email, String purpose) {
        // Delete existing OTPs for this email and purpose
        otpRepository.deleteByEmailAndPurpose(email, purpose);

        OTP otp = new OTP();
        otp.setEmail(email);
        otp.setOtp(generateOTP());
        otp.setPurpose(purpose);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        otp.setAttempts(0);
        otp.setVerified(false);
        otp.setCreatedAt(LocalDateTime.now());

        return otpRepository.save(otp);
    }

    @Transactional
    public boolean verifyOTP(String email, String otpCode, String purpose) {
        Optional<OTP> otpOptional = otpRepository.findByEmailAndOtpAndPurpose(email, otpCode, purpose);

        if (otpOptional.isEmpty()) {
            return false;
        }

        OTP otp = otpOptional.get();

        if (otp.getVerified()) {
            return false;
        }

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            return false;
        }

        otp.setVerified(true);
        otpRepository.save(otp);

        return true;
    }

    @Transactional
    public OTP resendOTP(String email, String purpose) {
        otpRepository.deleteByEmailAndPurpose(email, purpose);
        return createOTP(email, purpose);
    }

    @Transactional
    public Optional<OTP> validateOTP(String email, String otpCode, String purpose) {
        Optional<OTP> otpOptional = otpRepository.findByEmailAndOtpAndPurpose(email, otpCode, purpose);

        if (otpOptional.isEmpty()) {
            return Optional.empty();
        }

        OTP otp = otpOptional.get();

        if (otp.getVerified()) {
            return Optional.empty();
        }

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            return Optional.empty();
        }

        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            return Optional.empty();
        }

        otp.setAttempts(otp.getAttempts() + 1);
        otpRepository.save(otp);

        return Optional.of(otp);
    }

    @Transactional
    public void markVerified(String email, String purpose) {
        otpRepository.findByEmailAndPurposeAndVerifiedFalse(email, purpose)
                .forEach(otp -> {
                    otp.setVerified(true);
                    otpRepository.save(otp);
                });
    }

    @Transactional
    public void deleteExpiredOTPs() {
        otpRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
    }
}