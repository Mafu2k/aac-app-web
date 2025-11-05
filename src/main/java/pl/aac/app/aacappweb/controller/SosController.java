package pl.aac.app.aacappweb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sos")
public class SosController {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @PostMapping("/trigger")
    public ResponseEntity<?> triggerSos(@RequestBody SosRequest request, Authentication auth) {
        try {
            String username = auth != null ? auth.getName() : "Nieznany użytkownik";

            // Prepare emergency message
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
            String subject = "🆘 ALARM SOS - Potrzebna pomoc!";

            StringBuilder message = new StringBuilder();
            message.append("WIADOMOŚĆ SOS\n");
            message.append("===================\n\n");
            message.append("Czas: ").append(timestamp).append("\n");
            message.append("Użytkownik: ").append(username).append("\n\n");

            if (request.getUserName() != null && !request.getUserName().isEmpty()) {
                message.append("Imię i nazwisko: ").append(request.getUserName()).append("\n");
            }

            if (request.getMessage() != null && !request.getMessage().isEmpty()) {
                message.append("\nWiadomość:\n").append(request.getMessage()).append("\n");
            }

            if (request.getLocation() != null && !request.getLocation().isEmpty()) {
                message.append("\nLokalizacja: ").append(request.getLocation()).append("\n");
            }

            message.append("\n===================\n");
            message.append("Ta wiadomość została wysłana automatycznie z aplikacji AAC APP.\n");
            message.append("Proszę skontaktować się z użytkownikiem jak najszybciej!\n");

            // Send based on type
            Map<String, Object> response = new HashMap<>();

            switch (request.getSosType()) {
                case "email":
                    if (request.getSosEmail() != null && !request.getSosEmail().isEmpty()) {
                        sendEmail(request.getSosEmail(), subject, message.toString());
                        response.put("success", true);
                        response.put("message", "Email SOS wysłany na: " + request.getSosEmail());
                    } else {
                        response.put("success", false);
                        response.put("message", "Brak adresu email");
                    }
                    break;

                case "phone":
                    // W prawdziwej aplikacji tutaj byłoby API do wysyłania SMS lub wykonywania połączenia
                    response.put("success", true);
                    response.put("message", "SOS - telefon: " + request.getSosPhone1());
                    response.put("info", "W pełnej wersji zostałoby wykonane połączenie");
                    break;

                case "sms":
                    // W prawdziwej aplikacji tutaj byłoby API do wysyłania SMS (np. Twilio)
                    response.put("success", true);
                    response.put("message", "SMS wysłany na: " + request.getSosPhone1());
                    response.put("info", "W pełnej wersji SMS zostałby wysłany przez API");
                    break;

                case "emergency":
                    response.put("success", true);
                    response.put("message", "Numer alarmowy 112");
                    response.put("info", "W pełnej wersji aplikacji mobilnej zostałoby wykonane połączenie z 112");
                    break;

                default:
                    response.put("success", false);
                    response.put("message", "Nieznany typ SOS");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Błąd wysyłania SOS: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    private void sendEmail(String to, String subject, String text) {
        if (mailSender == null) {
            throw new RuntimeException("Mail sender nie jest skonfigurowany");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("noreply@aacapp.pl");

        mailSender.send(message);
    }

    // DTO for SOS request
    public static class SosRequest {
        private String sosType;
        private String sosEmail;
        private String sosPhone1;
        private String sosPhone2;
        private String userName;
        private String message;
        private String location;

        public String getSosType() { return sosType; }
        public void setSosType(String sosType) { this.sosType = sosType; }

        public String getSosEmail() { return sosEmail; }
        public void setSosEmail(String sosEmail) { this.sosEmail = sosEmail; }

        public String getSosPhone1() { return sosPhone1; }
        public void setSosPhone1(String sosPhone1) { this.sosPhone1 = sosPhone1; }

        public String getSosPhone2() { return sosPhone2; }
        public void setSosPhone2(String sosPhone2) { this.sosPhone2 = sosPhone2; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }
}
