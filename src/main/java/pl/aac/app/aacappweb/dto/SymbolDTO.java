package pl.aac.app.aacappweb.dto;

import lombok.Data;

@Data
public class SymbolDTO {
    private Long id;
    private String label;
    private String ttsText;
    private String imageUrl;
    private String glyph;
    private String color;
}
