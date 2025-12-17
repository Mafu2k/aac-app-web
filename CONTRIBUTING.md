# Jak pracujemy nad projektem

1. Zadanie zaczyna się od Issue, w którym opisujemy, co i po co.
2. Nową gałąź robimy od `develop`: `git checkout -b feature/krotki-opis develop`
   (dla poprawek `bugfix/...`).
3. Commity mają być małe, z opisem w trybie rozkazującym, np. „Dodaj walidację formularza SOS”.
4. Przed PR uruchamiamy `./mvnw test` i sprawdzamy zmianę w przeglądarce.
5. PR idzie do `develop` i wypełniamy w nim szablon. Merge następuje po akceptacji w code review.

Błędy zgłaszamy jako Issue z krokami do odtworzenia, tym, co powinno się stać, tym, co się
stało, oraz przeglądarką i systemem.
