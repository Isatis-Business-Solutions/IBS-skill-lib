# Spec: IBS-skillbibliotheek

Hier houden we bij waar we aan werken: features, open vragen, besluiten en de releases waar we naartoe werken.
Elke nieuwe skill of grote wijziging begint hier. Wie (of welke AI) in deze repo werkt, laadt eerst de skill
`ibs-library-maintainer` (`.claude/skills/`); die beschrijft hoe dit document wordt gebruikt.

**Status per feature:** idee → brainstorm → besloten → in bouw (`drafts/`) → testen → klaar (`skills/`) → uitgebracht.

## Releases

Een release gaat over wat **gebruikers van de skills** merken: een nieuwe skill of een zichtbare verbetering.
Bugfixes en wijzigingen aan de werkwijze in de repo gaan mee in de eerstvolgende release; ze krijgen geen eigen
release.

| Versie | Inhoud | Status |
|---|---|---|
| v1.0.0 | `ibs-huisstijl` | op `main`, nog niet getagd |
| v1.1.0 | `ibs-schrijfstijl` | op `main`, nog niet getagd |
| v1.2.0 | F3 `image-generator` | testen |
| v1.3.0 | F1 `ibs-stockbeeld` (inclusief verwijzing vanuit `ibs-huisstijl`) | testen |
| v1.4.0 | F2 speelsheid in de huisstijl | testen |

Versienummers: nieuwe skill of nieuwe functie = minor (1.x.0), alleen reparaties = patch (1.1.x), iets dat
bestaand gebruik breekt (bijv. een skill hernoemen) = major (2.0.0).

## Features

### F1. Stockbeelden in IBS-stijl (`ibs-stockbeeld`)

**Status:** testen (concept in `drafts/ibs-stockbeeld/`; verwijzing staat in `ibs-huisstijl`). **Release:** v1.3.0.

Een skill die beschrijft hoe een beeld eruitziet dat je normaal als stockfoto zou gebruiken. De skill bepaalt
de beeldtaal; het maken van het beeld zelf gebeurt via een beeldmodel (zie F3).

Besloten:
- **Onderwerp: puur de sector** waar we onze data- of AI-oplossing op loslaten. Mensen uit die sector moeten
  hun eigen wereld herkennen. De sector komt uit de opdracht van de gebruiker; de skill noemt geen
  voorbeeldsectoren.
- **Realistisch en eigentijds**, zoals een goede stockfoto.
- **Golden hour.** Het licht maakt alles geel en oranje; dat sluit aan op de huisstijl.
- **Natuurlijke uitstraling door elementen, niet door kleur:** meer bomen, een weiland, natuur rondom de
  installatie. **Geen groene kleurtoon of groen accent**; de kleur komt van het golden-hour-licht.
- **Speels element:** een minimale hint van **retro-futurisme**, de toekomst zoals men die in de jaren 70 en
  80 voor zich zag. Het beeld blijft vooral eigentijds; de hint is een sprankje, niet het onderwerp.
- **Formaten** horen niet in deze skill; die verschillen per gebruik.
- **Afbakening:** de skill zegt zelf dat hij niet bedoeld is voor infographics, schema's of iconen.
- **`ibs-huisstijl` verwijst** naar deze skill als er een foto of sfeerbeeld nodig is (met terugvaloptie).

Getest (3 opdrachten in verschillende sectoren, met `image-generator` en `ibs-huisstijl` erbij, zonder
Codex-login): de skill werd elke keer geladen en riep zelf `image-generator` aan. Elke prompt bevatte alle
elementen: een herkenbare scène uit de sector, geen mensen, golden hour, natuur zonder groene tint, één
retro-futuristisch detail, rust, geen tekst of logo's. Zonder beeldmodel kwam er telkens een prompt plus
placeholder, en de vraag of de scène klopt. Nog niet getest: echte beelden.

### F2. Speelsheid in de huisstijl

**Status:** testen (in `skills/ibs-huisstijl`, op de branch). **Release:** v1.4.0.

De huidige huisstijl is mooi maar straalt weinig plezier uit. Fun is een kernwaarde.

Besloten:
- **Het merkteken als klein, terugkerend speels detail**, overal een beetje inzetbaar.
- **Het merkteken als geometrisch herhaalpatroon** op de achtergrond, met een verloop van IBS-geel naar
  amber eroverheen. Een accent, nooit druk.
- **Kleine animaties** in digitale uitingen.
- **Geen tweede accentkleur.** Geen groen.

Gebouwd:
- Nieuwe sectie "Playful touches" in `SKILL.md`, met verwijzingen in de referenties voor web, HTML en
  PowerPoint.
- `.ibs-pattern` in `tokens.css`: het merkteken als herhaalpatroon, verloop van IBS-geel naar amber, dat
  vanuit de rechterbovenhoek uitvloeit. Werkt samen met `.ibs-glow`.
- `assets/pattern/`: het patroon als SVG-tegel en als donkere PNG-achtergrond (1920×1080) voor
  PowerPoint en Word.
- Een regel die animaties uitzet voor wie in zijn systeem minder beweging heeft ingesteld.

### F3. Beelden genereren (`image-generator`)

**Status:** testen (concept in `drafts/image-generator/`). **Release:** v1.2.0.

Een algemene skill, los van IBS: hij verwijst naar geen andere skill en heeft daarom geen `ibs-`-voorvoegsel.
Hij regelt alleen **hoe** een beeld gemaakt wordt; **wat** erop staat komt uit de opdracht en uit andere skills
die tegelijk geladen zijn (zoals de huisstijl).

Opbouw (één skill met routes, in plaats van een orchestrator met losse skills: één installatie, en alleen de
benodigde route wordt geladen):
- `SKILL.md`: kijkt eerst welke route klaarstaat, schrijft de prompt, genereert, controleert en levert op.
- `routes/codex-cli.md`: via de Codex CLI en het eigen ChatGPT-account (aanbevolen).
- `routes/openai-api.md`: via de OpenAI API met een API-sleutel.
- `setup.md`: alleen geladen zolang er nog geen route klaarstaat. Legt de keuze uit, met de kosten: Codex CLI
  valt onder het bestaande abonnement (geen extra kosten), de API kost altijd extra (per beeld). Installeert
  of logt niets in zonder toestemming.
- `fallback.md`: geen enkele route mogelijk → kant-en-klare prompt plus placeholder.
- Later kan er een route bij (bijv. Gemini) door één bestand toe te voegen.

Uitgezocht (Codex CLI 0.160):
- Codex heeft ingebouwde beeldgeneratie (`$imagegen`) op het ChatGPT-account; geen API-sleutel nodig. De
  originelen staan in `~/.codex/generated_images/`.
- Inloggen zonder browser: `codex login --device-auth` (code invoeren op een ander apparaat).
- In de Claude-app (chat) is geen CLI; daar valt de skill terug op prompt plus placeholder.

Getest met echte login (2026-10-03): inloggen via de browser vanaf de telefoon, met het adres terugplakken
(de apparaatcode werkte niet: de schakelaar in ChatGPT ging niet om). Daarna maakte de skill, samen met
`ibs-stockbeeld`, zelf een beeld via Codex en sloeg het op in de werkmap. Deze loginroute staat nu in
`setup.md`.

Eerder getest (3 runs, zonder login): de skill herkent dat er geen route is, legt de drie routes uit met kosten,
noemt de benodigde netwerkdomeinen, installeert niets zonder akkoord en geeft een prompt (één run ook een
placeholder). Nog niet getest: echt een beeld maken via Codex of de API.

## Ontwikkeling (onder de motorkap)

Geen eigen release; gaat mee in de eerstvolgende release.

- **Beheer-skill `ibs-library-maintainer`** (`.claude/skills/`, intern): werkwijze voor deze repo. Klaar.
- **Dit spec-document.** Klaar.

## Open vragen

| # | Feature | Vraag | Antwoord |
|---|---|---|---|
| 1 | Releases | Zullen we v1.0.0 en v1.1.0 alsnog taggen, zodat collega's een downloadbare release hebben? | |
| 2 | F3 | Echte test: sta je `chatgpt.com` en `auth.openai.com` toe in de netwerkinstellingen van deze omgeving en log je één keer in? | Ja: domeinen toegestaan, ingelogd via browser en terugplakken. Werkt. |

## Besluitenlog

| Datum | Besluit |
|---|---|
| 2026-10-03 | Repo `IBS-skill-lib`, `main` als basis; nieuwe skills beginnen in `drafts/`. |
| 2026-10-03 | `ibs-schrijfstijl` bestaat alleen uit regels en gedefinieerde gevoelswoorden, nooit uit voorbeeldteksten. |
| 2026-10-03 | Vakjargon uit data, AI en IT altijd in het Engels (Engelse spelling), de rest Nederlands. |
| 2026-10-03 | Werken vanuit `SPEC.md`, met maximaal 5 vragen tegelijk aan de eigenaar en releases als doel. |
| 2026-10-03 | Releases gaan over wat gebruikers merken; fixes en repo-werkwijze gaan mee, zonder eigen release. |
| 2026-10-03 | `ibs-stockbeeld`: puur de sector, realistisch en eigentijds, golden hour, natuur door elementen (geen groen), minimale hint van retro-futurisme (jaren 70/80); geen formaten; niet voor infographics. |
| 2026-10-03 | Beeldgeneratie wordt een losstaande skill met de Codex CLI (eigen OpenAI-account), met als laatste terugval een prompt plus placeholder. Komt in de volgende release. |
| 2026-10-03 | De regel "geen art deco" is uit `CLAUDE.md`; het was een eenmalige instructie. |
| 2026-10-03 | `image-generator`: algemene skill zonder `ibs-`, één skill met routes (Codex CLI aanbevolen, API, terugval). Setup alleen bij eerste gebruik, met uitleg over kosten. Beelden in de werkmap. |
| 2026-10-03 | Inloggen op Codex zonder computer: browserlogin met het terugplakken van het callback-adres. |
| 2026-10-03 | Skills zonder IBS-binding krijgen geen `ibs-`-voorvoegsel. |
| 2026-10-03 | Instructies: woorden goed definiëren, geen voorbeeldlijsten (bijv. geen lijst van sectoren). |
| 2026-10-03 | Speelsheid in de huisstijl: merkteken als terugkerend detail en als geometrisch herhaalpatroon met verloop van IBS-geel naar amber, kleine animaties; geen tweede accentkleur. |
