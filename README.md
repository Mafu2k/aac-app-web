# AAC APP

Aplikacja webowa do komunikacji wspomagającej i alternatywnej (AAC) dla osób, którym trudno
mówić. Użytkownik układa zdania z symboli na tablicach komunikacyjnych, a aplikacja je odczytuje.
Projekt powstał zespołowo w ramach laboratorium na studiach.

## Co jest w środku

- **Tablice komunikacyjne** z własnymi symbolami (emoji albo wgrane zdjęcia), kategoriami
  i ulubionymi zwrotami. Zbudowane zdanie czyta syntezator mowy przeglądarki.
- **Emocje**: gotowe komunikaty do szybkiego pokazania, jak się czuję i czego potrzebuję.
- **Edukacja**: ćwiczenia ze słownictwem i gra memory.
- **SOS**: przycisk alarmowy na każdej stronie, który wysyła maila do opiekuna. SMS jest
  na razie tylko zaślepką.
- **Panel terapeuty** z notatkami o podopiecznych, historia rozmów i proste statystyki.
- **Społeczność i wyzwania** dla użytkowników i opiekunów.
- **Dostępność**: tryb ciemny i wysoki kontrast, regulacja wielkości czcionek i ikon, uproszczony
  interfejs, sterowanie głosem oraz wybór przez przytrzymanie kursora (dwell click), który
  ma być punktem wyjścia pod prawdziwy eye-tracking.

## Technologie

Spring Boot 3.5 (Java 21) z Thymeleafem i zwykłym JavaScriptem. Spring Security działa z JWT
i hasłami w BCrypt, są role `USER`, `THERAPIST` i `ADMIN`. Dane trzyma JPA: lokalnie w plikowej
bazie H2, docelowo w MySQL. Dokumentacja API jest w Swagger UI (springdoc).

## Uruchomienie

```bash
./mvnw spring-boot:run
```

Ważne adresy:

- aplikacja: http://localhost:8080,
- Swagger: http://localhost:8080/swagger-ui,
- konsola H2: http://localhost:8080/h2-console.

Przy starcie tworzą się konta `admin` / `admin` i `user` / `user`.

Konfigurację podaje się w zmiennych środowiskowych:

| Zmienna | Do czego |
|---------|----------|
| `AAC_APP_JWT_SECRET` | sekret do podpisywania tokenów, na produkcji obowiązkowy |
| `AAC_APP_CORS_ORIGINS` | dozwolone originy (domyślnie `http://localhost:8080`) |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | konto SMTP do wysyłania alarmów SOS |

Przejście na MySQL to odkomentowanie sekcji w `application.properties`.

## Praca w zespole

Gałęzie `feature/*` i `bugfix/*` odchodziły od `develop`, a do `main` trafiały tylko stabilne
wersje. Każdy PR przechodził code review. Szczegóły są w [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencja

MIT
