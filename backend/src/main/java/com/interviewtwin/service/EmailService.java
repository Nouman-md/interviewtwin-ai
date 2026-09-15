package com.interviewtwin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationCode(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("InterviewTwin AI - Email Verification Code");
        message.setText(
            "Hello,\n\n" +
            "Your InterviewTwin AI email verification code is:\n\n" +
            code + "\n\n" +
            "This code will expire in 10 minutes.\n\n" +
            "If you did not create an InterviewTwin AI account, please ignore this email.\n\n" +
            "Regards,\n" +
            "InterviewTwin AI Team"
        );

        mailSender.send(message);
    }

    public void sendPasswordResetCode(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("InterviewTwin AI - Password Reset Code");
        message.setText(
            "Hello,\n\n" +
            "Your InterviewTwin AI password reset code is:\n\n" +
            code + "\n\n" +
            "This code will expire in 10 minutes.\n\n" +
            "If you did not request a password reset, please ignore this email.\n\n" +
            "Regards,\n" +
            "InterviewTwin AI Team"
        );

        mailSender.send(message);
    }
}