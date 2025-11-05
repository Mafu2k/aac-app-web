package pl.aac.app.aacappweb.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"username"}),
        @UniqueConstraint(columnNames = {"email"})
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(min = 60, max = 100)
    private String passwordHash;

    @Email
    @NotBlank
    private String email;

    private String displayName;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // User type for AAC personalization (autism, aphasia, child, cerebral_palsy)
    @Enumerated(EnumType.STRING)
    private UserType userType;

    // Competition / Gamification fields
    private Integer xp = 0; // experience points
    private Integer level = 1; // user level

    @CreationTimestamp
    private Instant createdAt;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Board> boards = new HashSet<>();
}
