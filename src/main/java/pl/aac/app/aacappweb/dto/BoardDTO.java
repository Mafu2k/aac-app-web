package pl.aac.app.aacappweb.dto;

import lombok.Data;

import java.util.List;

@Data
public class BoardDTO {
    private Long id;
    private String name;
    private String layout;
    private String colorScheme;
    private List<SymbolDTO> symbols;
}
