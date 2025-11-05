package pl.aac.app.aacappweb.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "symbols")
public class Symbol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String label;

    private String ttsText;

    private String imageUrl; // optional uploaded or external URL

    private String glyph; // optional emoji/pictogram single character(s)

    private String color;

    // Order within a board for accessible predictable navigation / drag&drop
    private Integer position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;
}
