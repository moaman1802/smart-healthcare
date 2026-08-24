package com.healthcare.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOTPEmail(String toEmail, String otp, String purpose) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("OTP Verification - Smart Healthcare");
        
        String body = String.format(
            "Dear User,\n\n" +
            "Your OTP for %s is: %s\n\n" +
            "This OTP is valid for 5 minutes.\n\n" +
            "If you did not request this, please ignore this email.\n\n" +
            "Regards,\n" +
            "Smart Healthcare Team",
            purpose, otp
        );
        
        message.setText(body);
        mailSender.send(message);
    }
}