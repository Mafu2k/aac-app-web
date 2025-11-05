package pl.aac.app.aacappweb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.aac.app.aacappweb.model.Board;
import pl.aac.app.aacappweb.model.Symbol;

import java.util.List;
import java.util.Optional;

public interface SymbolRepository extends JpaRepository<Symbol, Long> {
    List<Symbol> findByBoard(Board board);
    List<Symbol> findByBoardOrderByPositionAsc(Board board);
    Optional<Symbol> findTopByBoardOrderByPositionDesc(Board board);
}
