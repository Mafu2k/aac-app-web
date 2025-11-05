package pl.aac.app.aacappweb.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> upload(Authentication auth,
                                                      @RequestPart("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Empty file"));
        }
        // Ensure uploads dir exists
        Path dir = Path.of("./uploads");
        Files.createDirectories(dir);

        // Create safe filename
        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
            if (ext.length() > 8) ext = ext.substring(0, 8); // guard
        }
        String name = UUID.randomUUID() + (ext.isBlank() ? ".bin" : ext.toLowerCase());
        Path target = dir.resolve(name);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String url = "/uploads/" + name;
        Map<String, String> resp = new HashMap<>();
        resp.put("url", url);
        return ResponseEntity.ok(resp);
    }
}
