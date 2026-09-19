package com.backend.Service;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private final String adminEmail =
            "ashwanth07012007@gmail.com";


    // =========================
    // REGISTRATION EMAIL
    // =========================
    @Async
    public void sendRegistrationNotification(
            String username,
            String email) {

        // Don't send email for Ashwanth
        if ("ashwanth".equalsIgnoreCase(username)) {
            return;
        }

        try {

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setTo(adminEmail);

            message.setSubject(
                    "WhatsUp - New User Registered"
            );

            message.setText(
                    "A new user has registered in WhatsUp.\n\n"
                            + "Username: " + username + "\n"
                            + "Email: " + email + "\n"
            );

            mailSender.send(message);

            System.out.println(
                    "Registration notification email sent."
            );

        } catch (MailException e) {

            System.out.println(
                    "Email notification failed: "
                            + e.getMessage()
            );
        }
    }


    // =========================
    // LOGIN EMAIL
    // =========================
    @Async
    public void sendLoginNotification(
            String username) {

        // Don't send email for Ashwanth
        if ("ashwanth".equalsIgnoreCase(username)) {
            return;
        }

        try {

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setTo(adminEmail);

            message.setSubject(
                    "WhatsUp - User Login"
            );

            message.setText(
                    "A user has logged into WhatsUp.\n\n"
                            + "Username: " + username + "\n"
            );

            mailSender.send(message);

            System.out.println(
                    "Login notification email sent."
            );

        } catch (MailException e) {

            System.out.println(
                    "Email notification failed: "
                            + e.getMessage()
            );
        }
    }
}