package pl.aac.app.aacappweb.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.aac.app.aacappweb.dto.HistoryDTO;
import pl.aac.app.aacappweb.model.ConversationHistory;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.HistoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private final HistoryRepository historyRepository;

    public HistoryService(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @Transactional
    public HistoryDTO save(User user, String content) {
        ConversationHistory h = ConversationHistory.builder()
                .user(user)
                .content(content)
                .build();
        ConversationHistory saved = historyRepository.save(h);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<HistoryDTO> list(User user) {
        return historyRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void delete(User user, Long id) {
        ConversationHistory history = historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historia nie znaleziona"));

        // Check if the history belongs to the user
        if (!history.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Brak uprawnień do usunięcia tej historii");
        }

        historyRepository.delete(history);
    }

    private HistoryDTO toDto(ConversationHistory h) {
        HistoryDTO dto = new HistoryDTO();
        dto.setId(h.getId());
        dto.setContent(h.getContent());
        dto.setCreatedAt(h.getCreatedAt());
        return dto;
    }
}
