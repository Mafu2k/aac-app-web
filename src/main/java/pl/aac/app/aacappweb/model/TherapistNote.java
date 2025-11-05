package pl.aac.app.aacappweb.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "therapist_notes")
public class TherapistNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // właściciel/pacjent (dla uproszczenia: notatki związane z kontem zalogowanego)

    @Column(length = 4000)
    private String content;

    @CreationTimestamp
    private Instant createdAt;
}
