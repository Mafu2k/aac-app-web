# AAC APP - Aplikacja Wspomagająca Komunikację Alternatywną

## 📋 Opis projektu

AAC APP to nowoczesna aplikacja webowa wspierająca komunikację alternatywną i wspomagającą (Augmentative and Alternative Communication). Projekt został stworzony z myślą o osobach z trudnościami w komunikacji werbalnej, oferując intuicyjny interfejs do budowania zdań za pomocą symboli wizualnych.

## ✨ Główne funkcjonalności

### 🔊 Syntezator mowy (TTS)
- Konwersja tekstu na mowę
- Budowanie zdań za pomocą symboli
- Personalizowane tablice komunikacyjne

### 💬 Tablica komunikacyjna
- Tworzenie własnych tablic z symbolami
- Dodawanie własnych symboli (emoji, obrazy, zdjęcia)
- Kategoryzacja i organizacja symboli
- System ulubionych zwrotów

### 🎨 Personalizacja
- **Wygląd**: tryb ciemny, wysoki kontrast
- **Dostępność**: regulacja rozmiaru czcionki i ikon
- **Sterowanie**: obsługa głosowa, eye-tracking
- **Uproszczony interfejs** dla osób z ograniczeniami poznawczymi

### 😊 Moduł emocji
- Szybkie wyrażanie emocji i potrzeb
- Gotowe zestawy komunikatów
- Wizualne reprezentacje stanów emocjonalnych

### 📚 Edukacja
- Nauka nowych słów i wyrażeń
- Ćwiczenia komunikacyjne
- Gry edukacyjne (Memory)

### 🆘 System SOS
- Przycisk awaryjny na wszystkich stronach
- Powiadomienia SMS/Email dla opiekunów
- Szybki dostęp do pomocy

### 👥 Funkcje społecznościowe
- **Community**: forum dla użytkowników i opiekunów
- **Competition**: system rywalizacji i osiągnięć
- **Moduł terapeuty**: narzędzia dla specjalistów

## 🛠️ Technologie

### Backend
- **Java 21**
- **Spring Boot 3.5.6**
  - Spring Web
  - Spring Data JPA
  - Spring Security (JWT)
  - Spring WebSocket
- **Maven**
- **Bazy danych**:
  - H2 (development)
  - MySQL (production)

### Frontend
- **HTML5, CSS3, JavaScript (Vanilla)**
- **Thymeleaf** (szablony)
- **Web Speech API** (TTS, rozpoznawanie głosu)
- **Progressive Web App** (PWA ready)

### API
- **RESTful API**
- **Swagger/OpenAPI** dokumentacja

## 🚀 Uruchomienie projektu

### Wymagania
- Java 21+
- Maven 3.8+
- (Opcjonalnie) MySQL 8.0+

### Instalacja

1. **Klonowanie repozytorium**
```bash
git clone https://github.com/twoje-repo/aac-app-web.git
cd aac-app-web
```

2. **Konfiguracja**

Edytuj `src/main/resources/application.properties`:
```properties
# Zmień sekret JWT
app.security.jwt.secret=twoj-bezpieczny-sekret

# Opcjonalnie skonfiguruj MySQL
# spring.datasource.url=jdbc:mysql://localhost:3306/aac_app
# spring.datasource.username=user
# spring.datasource.password=password
```

3. **Budowanie i uruchomienie**
```bash
# Budowanie
mvn clean install

# Uruchomienie
mvn spring-boot:run
```

4. **Dostęp do aplikacji**
- Aplikacja: http://localhost:8080
- H2 Console: http://localhost:8080/h2-console
- Swagger UI: http://localhost:8080/swagger-ui

### Pierwsze logowanie

Domyślne konto administratora:
- **Login**: `admin`
- **Hasło**: `admin123`

⚠️ **Zmień hasło po pierwszym zalogowaniu!**

## 📁 Struktura projektu

```
aac-app-web/
├── src/
│   ├── main/
│   │   ├── java/pl/aac/app/aacappweb/
│   │   │   ├── config/          # Konfiguracja (Security, JWT)
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── model/           # Encje JPA
│   │   │   ├── repository/      # Repozytoria danych
│   │   │   └── service/         # Logika biznesowa
│   │   └── resources/
│   │       ├── static/          # CSS, JS, obrazy
│   │       ├── templates/       # Szablony Thymeleaf
│   │       └── application.properties
│   └── test/                    # Testy
├── data/                        # Baza danych H2 (local)
├── uploads/                     # Przesłane pliki użytkowników
└── pom.xml
```

## 🔐 Bezpieczeństwo

- Uwierzytelnianie JWT
- Hashowanie haseł (BCrypt)
- Zabezpieczenie API przed CSRF
- Walidacja danych wejściowych
- Role użytkowników (USER, THERAPIST, ADMIN)

## 📱 Dostępność

Aplikacja spełnia standardy dostępności WCAG 2.1:
- Obsługa klawiatury
- Etykiety ARIA
- Wysoki kontrast
- Skalowalne czcionki
- Kompatybilność z czytnikami ekranu

## 🤝 Wkład w rozwój

Zachęcamy do zgłaszania błędów, propozycji funkcjonalności i pull requestów!

### Jak zgłosić błąd
1. Sprawdź czy błąd nie został już zgłoszony w Issues
2. Utwórz nowy Issue z dokładnym opisem problemu
3. Dołącz kroki reprodukcji i screenshoty

### Jak dodać nową funkcjonalność
1. Forkuj repozytorium
2. Utwórz branch z opisową nazwą (`feature/nowa-funkcja`)
3. Commituj zmiany z jasnymi komunikatami
4. Wyślij Pull Request z opisem zmian

## 📄 Licencja

Ten projekt jest udostępniony na licencji MIT. Zobacz plik [LICENSE](LICENSE) po szczegóły.

## 📞 Kontakt

W razie pytań lub uwag, otwórz Issue na GitHubie.

