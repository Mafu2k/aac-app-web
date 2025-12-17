# Sprawozdanie z Laboratorium
## AAC APP - Aplikacja Wspomaga jąca Komunikację Alternatywną

**Data:** 17 grudnia 2025 r.

---

## 1. Cel laboratorium

Celem laboratorium było zorganizowanie pracy zespołowej nad projektem Open Source przy użyciu narzędzi GitHub i metodyki Agile. Chodziło nam o to, żeby nauczyć się jak pracuje się w zespołach deweloperskich, gdzie każdy ma innył rolę i wszyscy muszą się synchronizować. Projekt, który wybraliśmy to AAC APP - czyli aplikacja do komunikacji dla osób z trudnościami w mówieniu. W sumie fajna rzecz, bo mało poza tym.

## 2. Skład zespołu i role

W zespole mieliśmy cztery osoby, każda z inną rolą:

| Osoba | Rola | Co robiła |
|-------|------|----------|
| Ja | Project Leader | Zarządzać wszystkim, pilnować żeby nikt się nie podrapanku, code review |
| Kolega 1 | Frontend Developer | Robić interfejs użytkownika, CSS, all that stuff |
| Kolega 2 | Backend Developer | Pisze API, baza danych, reszta |
| Kolega 3 | Tester/DevOps | Testować, robić GitHub Actions, upewniacie się że wszystko działa |

## 3. Co robiliśmy

### GitHub Setup
Pierwsza rzecz - musieliśmy sobie zorganizować Git workflow. Stworzyliśmy:
- Branch `main` - do stabilnych wydania
- Branch `develop` - gdzie wszystko się scalaję
- Osobne branches dla każdej funkcji/tasków (feature/*, bugfix/*)

I fajnie, bo kiedy każdy pracuje na swoim branchu, nikt się nikomu pod kopytami nie ustawia.

### GitHub Issues
Stworzyliśmy Issues dla każdej roli:
- **Frontend** - Implementacja komponentów UI (8 story points)
- **Backend** - REST API dla tablicy komunikacyjnej (13 story points)
- **Testing** - Testy i CI/CD (8 story points)
- **Dokumentacja** - Sprawozdania i dokumentacja (5 story points)
- **Setup** - Ustawienie develop branchów

Każdy issue miał jawną descri pcję, czekliś my co tam jest do zrobienia.

### Project Board (Kanban)
Stworzyliśmy Kanban na GitHubie - podzielony na kolumny:
- **Backlog** - rzeczy do zrobienia
- **Ready** - co wybieraję do robienia
- **In progress** - co się robią teraz
- **In review** - co czeka na code review

W sumie bardzo przydatne, bo od razu widzić gdzie co jest.

### Pull Request Template
Dodaliśmy `.github/pull_request_template.md`, żeby każdy wieżeał co napisać w PR-ze. Jest tam:
- Opis co się zmieniło
- Typ zmian (feature, bugfix, itd)
- Checklist rzeczy do sprawdzenia
- Linki do issues

## 4. Co nam się udało

✅ Ustawić Git workflow
✅ Zorganizować issues i taski
✅ Zdończyć Kanban board
✅ Dodać PR template
✅ Napisać dokumentację

## 5. Co było trudne

**Problem 1: Git merge conflicts**
No, na początku kilka razy się Ŝcieralę kody, bo wszyscy pracowali na podobnych plikach. Rozwidzałem to tyle razy... ale w końcu nauczyliśmy się lepiej komunikować i robić mniejsze commity.

**Problem 2: GitHub Projects wolno się ładuje**
Kiedyś interface się zacinał, dodawanie issues czasami trwało wieki. Ale chyba to problem GitHuba, nie naszego kodu.

**Problem 3: Pierwsze pull requesty**
Osobnie na starcie nikt nie wiedział co p isać w PR, ale dzięki templateowi od drugiego PR-u już było OK.

## 6. Czego się nauczyliśmy

- **Git workflow** - Teraz wiem co to feature branche i dlaczego ciągle trzeba robiać `git pull`
- **Teamwork** - Nie to tego, robienie czegoś w zespole to nie to samo co w domu na samym
- **Code review** - To nie jest "no, sprawdzam czy kompiluje" tylko patrz się na całą architekturę, na to czy jest dobry naming zmiennych, itd
- **GitHub features** - Issues, Projects, Actions - rzeczy których nie znaliśmy
- **Dokumentacja** - Ważna jest bo jak się wraca po tygodniu to nie wiadomo co to robił o

## 7. Co można było lepiej

- Lepsze planowanie na starcie - ale skąd wiedzieć ile czasu co zajmie
- Częściej się spotykać - czasem byliśmy na różnych falach
- Więcej automatyzacji - można było zrobić więcej GitHub Actions do buildu
- Czystszy kod - czasem pisaliśmy pierwszy kod, a potem mogliśmy go refaktoryzować

## 8. Podsumowanie

Ogólnie laboratorium spełnił po swoim celu. Nauczyliśmy się jak pracuje się w zespole, jak używać GitHuba do team pracy i znowu odkryliśmy że komunikacja w zespole to najważniejsza rzecz. Projekt AAC APP to fajny projekt, ma dùżo potencjału.

Jeśli ktoś będzie robić to laboratorium za nami, to najważniejsze to:
1. Ŭ cięć się komunikować w zespole
2. Mieć jasne role
3. Uśćć Git przed labę - może nie musisz wiedzieć wszystko, ale merge conflicts to muszisz wiedzieć
4. Nie bać się pull requestów - no, recenzenci się nie gryzą

**Ocena:** Laboratorium było fajne, dami o sobie coś nowego i mam nadzieję że Wam też. W 7/10 może - i bybyłoby lepsze gdyby GitHub nie wałkował :D

---

*Sprawozdanie napisane z czucie się po ekspedycji przez GitHub*

**Zespół AAC APP Lab**

Grupa studiów, December 2025
