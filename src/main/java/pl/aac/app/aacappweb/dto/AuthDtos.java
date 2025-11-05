package pl.aac.app.aacappweb.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class RegisterRequest {
        @NotBlank
        @Size(min = 3, max = 50)
        private String username;
        @Email
        @NotBlank
        private String email;
        @NotBlank
        @Size(min = 6, max = 100)
        private String password;
        private String displayName;
        private String role; // USER, CAREGIVER, ADMIN
    }

    @Data
    public static class LoginRequest {
        @NotBlank
        private String username;
        @NotBlank
        private String password;
    }

    @Data
    public static class AuthResponse {
        private final String token;
    }
}
