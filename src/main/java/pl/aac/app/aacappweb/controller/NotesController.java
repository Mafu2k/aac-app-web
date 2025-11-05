package pl.aac.app.aacappweb.controller;

import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.aac.app.aacappweb.model.TherapistNote;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.TherapistNoteRepository;
import pl.aac.app.aacappweb.repository.UserRepository;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NotesController {

    public record NoteDTO(Long id, String content, Instant createdAt) {}
    public record SaveRequest(@NotBlank String content) {}

    private final TherapistNoteRepository noteRepository;
    private final UserRepository userRepository;

    public NotesController(TherapistNoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication auth){
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<NoteDTO>> list(Authentication auth){
        User user = getCurrentUser(auth);
        var notes = noteRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(n -> new NoteDTO(n.getId(), n.getContent(), n.getCreatedAt())).toList();
        return ResponseEntity.ok(notes);
    }

    @PostMapping
    public ResponseEntity<NoteDTO> create(Authentication auth, @RequestBody SaveRequest req){
        User user = getCurrentUser(auth);
        TherapistNote note = TherapistNote.builder().user(user).content(req.content()).build();
        TherapistNote saved = noteRepository.save(note);
        return ResponseEntity.ok(new NoteDTO(saved.getId(), saved.getContent(), saved.getCreatedAt()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id){
        User user = getCurrentUser(auth);
        TherapistNote n = noteRepository.findById(id).orElse(null);
        if(n==null || n.getUser()==null || !n.getUser().getId().equals(user.getId())){
            return ResponseEntity.notFound().build();
        }
        noteRepository.delete(n);
        return ResponseEntity.noContent().build();
    }
}
