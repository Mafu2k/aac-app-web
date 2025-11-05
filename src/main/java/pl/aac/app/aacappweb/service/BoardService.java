package pl.aac.app.aacappweb.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.aac.app.aacappweb.dto.BoardDTO;
import pl.aac.app.aacappweb.dto.SymbolDTO;
import pl.aac.app.aacappweb.model.Board;
import pl.aac.app.aacappweb.model.Symbol;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.BoardRepository;
import pl.aac.app.aacappweb.repository.SymbolRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final SymbolRepository symbolRepository;

    public BoardService(BoardRepository boardRepository, SymbolRepository symbolRepository) {
        this.boardRepository = boardRepository;
        this.symbolRepository = symbolRepository;
    }

    @Transactional(readOnly = true)
    public List<BoardDTO> getBoards(User user) {
        return boardRepository.findByOwner(user).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public BoardDTO createBoard(User owner, BoardDTO dto) {
        Board b = new Board();
        b.setOwner(owner);
        b.setName(dto.getName());
        b.setLayout(dto.getLayout());
        b.setColorScheme(dto.getColorScheme());
        Board saved = boardRepository.save(b);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public Board getBoardEntityForUser(Long id, User user) {
        Board b = boardRepository.findById(id).orElseThrow();
        if (b.getOwner() == null || !b.getOwner().getId().equals(user.getId())) {
            throw new SecurityException("No access to board");
        }
        return b;
    }

    @Transactional
    public BoardDTO updateBoard(User owner, Long boardId, BoardDTO dto) {
        Board b = getBoardEntityForUser(boardId, owner);
        if (dto.getName() != null) b.setName(dto.getName());
        if (dto.getLayout() != null) b.setLayout(dto.getLayout());
        if (dto.getColorScheme() != null) b.setColorScheme(dto.getColorScheme());
        return toDto(b);
    }

    @Transactional
    public void deleteBoard(User owner, Long boardId) {
        Board b = getBoardEntityForUser(boardId, owner);
        boardRepository.delete(b);
    }

    @Transactional(readOnly = true)
    public List<SymbolDTO> getSymbols(Board board) {
        return symbolRepository.findByBoardOrderByPositionAsc(board).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public SymbolDTO addSymbol(Board board, SymbolDTO dto) {
        // determine next position
        int nextPos = symbolRepository.findTopByBoardOrderByPositionDesc(board)
                .map(sym -> sym.getPosition() == null ? 0 : sym.getPosition())
                .orElse(0) + 1;
        Symbol s = new Symbol();
        s.setBoard(board);
        s.setLabel(dto.getLabel());
        s.setTtsText(dto.getTtsText());
        s.setImageUrl(dto.getImageUrl());
        s.setGlyph(dto.getGlyph());
        s.setColor(dto.getColor());
        s.setPosition(nextPos);
        Symbol saved = symbolRepository.save(s);
        return toDto(saved);
    }

    @Transactional
    public void reorderSymbols(Board board, List<Long> orderedIds) {
        // Load all symbols for board
        List<Symbol> all = symbolRepository.findByBoard(board);
        Map<Long, Symbol> byId = all.stream().collect(Collectors.toMap(Symbol::getId, s -> s));
        int pos = 1;
        for (Long id : orderedIds) {
            Symbol s = byId.get(id);
            if (s != null && Objects.equals(s.getBoard().getId(), board.getId())) {
                s.setPosition(pos++);
            }
        }
        // Any symbols not included keep their relative order but move after
        List<Symbol> remaining = all.stream()
                .filter(s -> !orderedIds.contains(s.getId()))
                .sorted(Comparator.comparing(s -> Optional.ofNullable(s.getPosition()).orElse(Integer.MAX_VALUE)))
                .toList();
        for (Symbol s : remaining) { s.setPosition(pos++); }
        symbolRepository.saveAll(all);
    }

    @Transactional
    public void removeSymbol(Board board, Long symbolId) {
        Symbol s = symbolRepository.findById(symbolId).orElseThrow();
        if (!s.getBoard().getId().equals(board.getId())) throw new SecurityException("No access to symbol");
        symbolRepository.delete(s);
    }

    private BoardDTO toDto(Board b) {
        BoardDTO dto = new BoardDTO();
        dto.setId(b.getId());
        dto.setName(b.getName());
        dto.setLayout(b.getLayout());
        dto.setColorScheme(b.getColorScheme());
        return dto;
    }

    private SymbolDTO toDto(Symbol s) {
        SymbolDTO dto = new SymbolDTO();
        dto.setId(s.getId());
        dto.setLabel(s.getLabel());
        dto.setTtsText(s.getTtsText());
        dto.setImageUrl(s.getImageUrl());
        dto.setGlyph(s.getGlyph());
        dto.setColor(s.getColor());
        return dto;
    }
}
