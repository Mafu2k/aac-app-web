package pl.aac.app.aacappweb.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class HistoryDTO {
    private Long id;
    private String content;
    private Instant createdAt;
}
