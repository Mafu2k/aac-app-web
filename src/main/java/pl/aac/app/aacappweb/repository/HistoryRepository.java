package pl.aac.app.aacappweb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.aac.app.aacappweb.model.ConversationHistory;
import pl.aac.app.aacappweb.model.User;

import java.util.List;

public interface HistoryRepository extends JpaRepository<ConversationHistory, Long> {
    List<ConversationHistory> findByUserOrderByCreatedAtDesc(User user);
}
