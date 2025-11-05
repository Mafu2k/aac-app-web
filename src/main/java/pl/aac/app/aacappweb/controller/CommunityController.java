package pl.aac.app.aacappweb.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.aac.app.aacappweb.model.Board;
import pl.aac.app.aacappweb.model.Symbol;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.BoardRepository;
import pl.aac.app.aacappweb.repository.SymbolRepository;
import pl.aac.app.aacappweb.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final BoardRepository boardRepository;
    private final SymbolRepository symbolRepository;
    private final UserRepository userRepository;

    public CommunityController(BoardRepository boardRepository, SymbolRepository symbolRepository, UserRepository userRepository) {
        this.boardRepository = boardRepository;
        this.symbolRepository = symbolRepository;
        this.userRepository = userRepository;
    }

    private User current(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping("/boards")
    public ResponseEntity<List<CommunityBoardDTO>> listPublicBoards() {
        List<Board> boards = boardRepository.findByPublicVisibleTrue();
        List<CommunityBoardDTO> out = boards.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(out);
    }

    @PostMapping("/publish/{boardId}")
    public ResponseEntity<Void> publish(Authentication auth, @PathVariable Long boardId) {
        User me = current(auth);
        Board b = boardRepository.findByIdAndOwner(boardId, me).orElseThrow();
        b.setPublicVisible(true);
        boardRepository.save(b);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unpublish/{boardId}")
    public ResponseEntity<Void> unpublish(Authentication auth, @PathVariable Long boardId) {
        User me = current(auth);
        Board b = boardRepository.findByIdAndOwner(boardId, me).orElseThrow();
        b.setPublicVisible(false);
        boardRepository.save(b);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/clone/{boardId}")
    public ResponseEntity<CommunityBoardDTO> cloneBoard(Authentication auth, @PathVariable Long boardId) {
        User me = current(auth);
        Board src = boardRepository.findById(boardId).orElseThrow();
        if (!Boolean.TRUE.equals(src.isPublicVisible()) && (src.getOwner() == null || !src.getOwner().getId().equals(me.getId()))) {
            return ResponseEntity.status(403).build();
        }
        Board copy = Board.builder()
                .name(src.getName() + " (kopia)")
                .layout(src.getLayout())
                .colorScheme(src.getColorScheme())
                .publicVisible(false)
                .owner(me)
                .build();
        boardRepository.save(copy);
        // clone symbols
        List<Symbol> srcSyms = symbolRepository.findByBoardOrderByPositionAsc(src);
        int pos = 1;
        for (Symbol s : srcSyms) {
            Symbol ns = Symbol.builder()
                    .label(s.getLabel())
                    .ttsText(s.getTtsText())
                    .imageUrl(s.getImageUrl())
                    .glyph(s.getGlyph())
                    .color(s.getColor())
                    .position(pos++)
                    .board(copy)
                    .build();
            symbolRepository.save(ns);
        }
        return ResponseEntity.ok(toDto(copy));
    }

    private CommunityBoardDTO toDto(Board b) {
        CommunityBoardDTO dto = new CommunityBoardDTO();
        dto.setId(b.getId());
        dto.setName(b.getName());
        dto.setLayout(b.getLayout());
        dto.setColorScheme(b.getColorScheme());
        dto.setOwnerDisplayName(b.getOwner() != null ? (b.getOwner().getDisplayName() != null ? b.getOwner().getDisplayName() : b.getOwner().getUsername()) : "");
        dto.setPublicVisible(b.isPublicVisible());
        return dto;
    }

    public static class CommunityBoardDTO {
        private Long id;
        private String name;
        private String layout;
        private String colorScheme;
        private String ownerDisplayName;
        private boolean publicVisible;
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getLayout() { return layout; }
        public void setLayout(String layout) { this.layout = layout; }
        public String getColorScheme() { return colorScheme; }
        public void setColorScheme(String colorScheme) { this.colorScheme = colorScheme; }
        public String getOwnerDisplayName() { return ownerDisplayName; }
        public void setOwnerDisplayName(String ownerDisplayName) { this.ownerDisplayName = ownerDisplayName; }
        public boolean isPublicVisible() { return publicVisible; }
        public void setPublicVisible(boolean publicVisible) { this.publicVisible = publicVisible; }
    }
}
