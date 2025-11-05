package pl.aac.app.aacappweb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.aac.app.aacappweb.model.Board;
import pl.aac.app.aacappweb.model.User;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByOwner(User owner);
    List<Board> findByPublicVisibleTrue();
    java.util.Optional<Board> findByIdAndOwner(Long id, User owner);
}
