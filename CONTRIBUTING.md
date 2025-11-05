# Wkład w rozwój AAC APP

Dziękujemy za zainteresowanie projektem AAC APP! 🎉

## 🤝 Jak możesz pomóc

### Zgłaszanie błędów
1. Sprawdź, czy błąd nie został już zgłoszony w [Issues](../../issues)
2. Utwórz nowy Issue używając szablonu dla błędów
3. Dołącz:
   - Dokładny opis problemu
   - Kroki reprodukcji
   - Oczekiwane i rzeczywiste zachowanie
   - Screenshoty (jeśli dotyczy)
   - Informacje o środowisku (przeglądarka, system operacyjny)

### Propozycje nowych funkcjonalności
1. Sprawdź roadmapę projektu
2. Otwórz Issue z etykietą "enhancement"
3. Opisz:
   - Jaki problem rozwiązuje funkcjonalność
   - Kto z niej skorzysta
   - Propozycję implementacji (opcjonalnie)

### Pull Requesty

#### Przygotowanie
1. Forkuj repozytorium
2. Utwórz branch z opisową nazwą:
   - `feature/nazwa-funkcji` - nowe funkcjonalności
   - `fix/nazwa-bledu` - poprawki błędów
   - `docs/temat` - zmiany w dokumentacji

#### Kodowanie
```bash
git checkout -b feature/moja-funkcja
# Wprowadź zmiany
git add .
git commit -m "feat: dodaj nową funkcjonalność X"
git push origin feature/moja-funkcja
```

#### Konwencje commitów
Używamy [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - nowa funkcjonalność
- `fix:` - poprawka błędu
- `docs:` - zmiany w dokumentacji
- `style:` - formatowanie kodu
- `refactor:` - refaktoryzacja kodu
- `test:` - dodanie testów
- `chore:` - zmiany w konfiguracji

#### Standardy kodu

**Backend (Java)**
- Używaj Java 21+ features
- Przestrzegaj konwencji Spring Boot
- Dodawaj testy jednostkowe dla nowej logiki
- Dokumentuj publiczne API JavaDoc

**Frontend (JavaScript)**
- Używaj nowoczesnego ES6+
- Zachowaj accessibility (ARIA, semantic HTML)
- Testuj na różnych przeglądarkach
- Komentuj złożoną logikę

**Dostępność**
- Wszystkie interaktywne elementy muszą być dostępne z klawiatury
- Używaj odpowiednich etykiet ARIA
- Testuj z czytnikiem ekranu
- Zachowaj kontrast kolorów

#### Proces review
1. Wyślij Pull Request z opisem zmian
2. Poczekaj na review
3. Odpowiadaj na komentarze i wprowadzaj poprawki
4. Po zaakceptowaniu, zmiany zostaną zmergowane

## 🧪 Testowanie

Przed wysłaniem PR:
```bash
# Uruchom testy
mvn test

# Zbuduj projekt
mvn clean install

# Sprawdź aplikację lokalnie
mvn spring-boot:run
```

## 📋 Checklist przed PR

- [ ] Kod kompiluje się bez błędów
- [ ] Wszystkie testy przechodzą
- [ ] Dodano testy dla nowych funkcjonalności
- [ ] Zaktualizowano dokumentację
- [ ] Sprawdzono dostępność
- [ ] Commit messages zgodne z konwencją
- [ ] Branch jest aktualny z główną gałęzią

## 💬 Komunikacja

- **Issues** - do zgłaszania błędów i propozycji
- **Pull Requests** - do dyskusji nad kodem
- **Discussions** - do ogólnych pytań i pomysłów

## 🙏 Zasady społeczności

- Bądź uprzejmy i szanuj innych
- Konstruktywna krytyka jest mile widziana
- Pamiętaj, że projekt służy osobom z niepełnosprawnościami
- Priorytetyzuj dostępność i użyteczność

## 📚 Przydatne zasoby

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [AAC Resources](https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/)

---

**Każdy wkład się liczy! Dziękujemy za pomoc w czynieniu komunikacji dostępną dla wszystkich! 💙**
