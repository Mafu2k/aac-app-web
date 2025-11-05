package pl.aac.app.aacappweb.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenService {

    private final byte[] secret;
    private final long expirationSeconds;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtTokenService(
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.expiration-seconds}") long expirationSeconds
    ) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(String username, String role) {
        try {
            Map<String, Object> header = new HashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            long now = Instant.now().getEpochSecond();
            long exp = now + expirationSeconds;

            Map<String, Object> payload = new HashMap<>();
            payload.put("sub", username);
            payload.put("role", role);
            payload.put("iat", now);
            payload.put("exp", exp);

            String headerB64 = base64Url(objectMapper.writeValueAsBytes(header));
            String payloadB64 = base64Url(objectMapper.writeValueAsBytes(payload));
            String signingInput = headerB64 + "." + payloadB64;
            String signature = sign(signingInput);
            return signingInput + "." + signature;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate token", e);
        }
    }

    public String validateAndGetUsername(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;
            String signingInput = parts[0] + "." + parts[1];
            String expectedSig = sign(signingInput);
            if (!constantTimeEquals(expectedSig, parts[2])) return null;

            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            @SuppressWarnings("unchecked")
            Map<String, Object> payload = objectMapper.readValue(payloadBytes, Map.class);
            long exp = ((Number) payload.get("exp")).longValue();
            if (Instant.now().getEpochSecond() > exp) return null;
            return (String) payload.get("sub");
        } catch (Exception e) {
            return null;
        }
    }

    public String getRole(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;
            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            @SuppressWarnings("unchecked")
            Map<String, Object> payload = objectMapper.readValue(payloadBytes, Map.class);
            return (String) payload.get("role");
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        byte[] sig = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return base64Url(sig);
    }

    private static String base64Url(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null || a.length() != b.length()) return false;
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}
