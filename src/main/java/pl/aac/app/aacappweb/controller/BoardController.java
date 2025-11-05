package pl.aac.app.aacappweb.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.aac.app.aacappweb.dto.BoardDTO;
import pl.aac.app.aacappweb.dto.SymbolDTO;
import pl.aac.app.aacappweb.model.Board;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.UserRepository;
import pl.aac.app.aacappweb.service.BoardService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;
    private final UserRepository userRepository;

    public BoardController(BoardService boardService, UserRepository userRepository) {
        this.boardService = boardService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication auth) {
        String username = auth.getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<BoardDTO>> list(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(boardService.getBoards(user));
    }

    @PostMapping
    public ResponseEntity<BoardDTO> create(Authentication auth, @Valid @RequestBody BoardDTO dto) {
        User user = getCurrentUser(auth);
        BoardDTO created = boardService.createBoard(user, dto);
        return ResponseEntity.created(URI.create("/api/boards/" + created.getId())).body(created);
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<BoardDTO> update(Authentication auth, @PathVariable Long boardId, @RequestBody BoardDTO dto) {
        User user = getCurrentUser(auth);
        BoardDTO updated = boardService.updateBoard(user, boardId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long boardId) {
        User user = getCurrentUser(auth);
        boardService.deleteBoard(user, boardId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{boardId}/symbols")
    public ResponseEntity<List<SymbolDTO>> symbols(Authentication auth, @PathVariable Long boardId) {
        User user = getCurrentUser(auth);
        Board board = boardService.getBoardEntityForUser(boardId, user);
        return ResponseEntity.ok(boardService.getSymbols(board));
    }

    @PostMapping("/{boardId}/symbols")
    public ResponseEntity<SymbolDTO> addSymbol(Authentication auth, @PathVariable Long boardId, @Valid @RequestBody SymbolDTO dto) {
        User user = getCurrentUser(auth);
        Board board = boardService.getBoardEntityForUser(boardId, user);
        SymbolDTO created = boardService.addSymbol(board, dto);
        return ResponseEntity.created(URI.create("/api/boards/" + boardId + "/symbols/" + created.getId())).body(created);
    }

    @PutMapping("/{boardId}/symbols/reorder")
    public ResponseEntity<Void> reorder(Authentication auth, @PathVariable Long boardId, @RequestBody List<Long> orderedIds) {
        User user = getCurrentUser(auth);
        Board board = boardService.getBoardEntityForUser(boardId, user);
        boardService.reorderSymbols(board, orderedIds);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{boardId}/symbols/{symbolId}")
    public ResponseEntity<Void> removeSymbol(Authentication auth, @PathVariable Long boardId, @PathVariable Long symbolId) {
        User user = getCurrentUser(auth);
        Board board = boardService.getBoardEntityForUser(boardId, user);
        boardService.removeSymbol(board, symbolId);
        return ResponseEntity.noContent().build();
    }
}
