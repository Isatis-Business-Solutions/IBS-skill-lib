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
| v1.2.0 | F3 `image-generator` | klaar, PR open |
| v1.3.0 | F1 `ibs-stockbeeld` (inclusief verwijzing vanuit `ibs-huisstijl`) + F2 speelsheid in de huisstijl | klaar, PR open |
| v1.3.1 | F4 divider met het IBS-merkteken in het midden | klaar, op branch |
| v1.4.0 | F5 `ibs-videomontage` + F6 `ibs-storyboard` | in bouw (`drafts/`), testen |

Versienummers: nieuwe skill of nieuwe functie = minor (1.x.0), alleen reparaties = patch (1.1.x), iets dat
bestaand gebruik breekt (bijv. een skill hernoemen) = major (2.0.0).

## Features

### F1. Stockbeelden in IBS-stijl (`ibs-stockbeeld`)

**Status:** klaar (`skills/ibs-stockbeeld/`). **Release:** v1.3.0.

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

**Status:** klaar. **Release:** v1.3.0 (samen met F1, op akkoord van de eigenaar).

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

**Status:** klaar (`skills/image-generator/`). **Release:** v1.2.0.

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

### F4. Divider met het merkteken

**Status:** klaar (in `skills/ibs-huisstijl/`). **Release:** v1.3.1.

De signature-divider is een dunne dubbele lijn met het **IBS-merkteken** in het midden, niet langer een geel
vierkantje. Aangepast in `SKILL.md`, de referenties voor HTML/presentaties en PowerPoint, en `preview/index.html`.
Aanleiding: de video-signature van IBS (repo `nft_ai_bs_meme`), waar de divider ook de wipe-lijn is.

### F5. Video monteren in de IBS-signature (`ibs-videomontage`)

**Status:** testen (`drafts/ibs-videomontage/`). **Release:** v1.4.0 (gepland).

Een skill die van bestaande beelden een **hele clip** monteert in de IBS-video-signature: de juiste assets
kiezen, het verhaal vormen rond tension en release, de montage als `timeline.json` schrijven en renderen naar
MP4. Ontstaan in de leer-workspace `nft_ai_bs_meme` (lessen 1–5, signature en bibliotheek v0.3).

Besloten (eigenaar, 2026-10-19):
- **Alleen monteren.** Video genereren en storyboarden worden aparte skills, later (eerst verder leren). Deze
  skill houdt er rekening mee: een storyboard of shotlijst wordt gevolgd; zonder doet de skill een lichte
  verhaalstap (`references/story.md`).
- **Hele clip** als resultaat, geen losse assets.
- Assets als kant-en-klare code (`engine/`) met regels wanneer wat (`references/assets.md`), zodat de agent niet
  alles uit markdown hoeft op te bouwen.

Opbouw:
- `SKILL.md`: werkwijze (beelden bekijken → verhaal → assets → timeline → stills → render → opleveren).
- `references/`: `signature.md`, `assets.md`, `story.md`, `timeline.md`, `rendering.md`.
- `engine/`: de assets in code (fx, motion, double wipe, IBS-kit) + `timeline.js` + `render.html`.
- `scripts/render.mjs`: ffmpeg + headless Chromium (playwright-core) → MP4 met geluid (bronaudio, SFX, muziek).
- `assets/sfx/`: hit, whoosh, riser (zelf gesynthetiseerd). Poppins komt uit `ibs-huisstijl`.
- `catalog/ibs-edit-library.html`: alle assets live, voor de gebruiker.

Getest (2026-10-19), met eigen testbeelden van de eigenaar (die blijven buiten deze repo):
- Handmatige render: clip van 18 s, 1080×1920, ~60 s rendertijd.
- Headless skilltest, 3 runs, zelfde opdracht (teamdag, ~15 s, geen gesproken tekst): alle drie laden de skill
  en de referenties, schrijven een geldige timeline en leveren een MP4 van ~15 s op, in 3,5–5 min. De opbouw is
  stabiel: hook met korte B-roll-shots, wisselende looks en FX-flashes, riser en hook-caption; release met
  double wipe, glass card en captions; outro met logo-assemble. Een run gebruikte een detectie-callout met een
  speels label.
- Gevonden en verbeterd: één run sloeg de stills-controle over (nu verplicht in `SKILL.md`); captions over de
  double wipe (de gele kernwoorden vallen weg op het gele vlak; nu een controleregel); `role: "A"` op beeld
  zonder spreker (nu een controleregel).
- Nog niet getest: echte A-roll met spreker en captions op gesproken tekst, 16:9, muziek.

## Ontwikkeling (onder de motorkap)

Geen eigen release; gaat mee in de eerstvolgende release.

- **Beheer-skill `ibs-library-maintainer`** (`.claude/skills/`, intern): werkwijze voor deze repo. Klaar.
- **Dit spec-document.** Klaar.

### F6. Storyboard en shotlijst (`ibs-storyboard`)

**Status:** in bouw (`drafts/ibs-storyboard/`). **Release:** v1.4.0 (gepland, samen met F5).

Van idee naar een goedgekeurd videoplan: het verhaal uitvragen (grilling), het skelet kiezen vanuit het doel, per
beat het beeld plannen (echt, gegenereerd, motion graphic), de prompts voor videogeneratie schrijven, en alles
tonen als één storyboard-pagina (HTML) met per shot een beeld, die de gebruiker per shot goedkeurt.

Besloten (eigenaar, 2026-10-20, na de retro op de kennisborging-test):
- **Storyboard en shotlijst samen in één HTML-pagina**, met per shot een beeld: keyframe (image-generator) voor
  gegenereerde shots, still uit de engine voor animaties, frame uit een take als die er is, anders een schets.
  Doel: met meer zekerheid goedkeuren voordat er gegenereerd wordt.
- **Eerst grillen:** zonder ingevulde brief (product, koper, gebruiker, doel, kern) geen shotlijst; `check.mjs` toetst.
- **Pipeline:** storyboard → goedkeuring → videogeneratie → intake → montage. De videogeneratie-skill komt later en
  wordt dan direct na goedkeuring aangeroepen; tot dan genereert de gebruiker zelf met de prompts uit het storyboard.
- **`production.json` is de enige bron van waarheid** (schema 2, `references/production.md`); de montage-skill
  verwijst ernaar.

Opbouw: `SKILL.md` (8 stappen met eindcriteria), `references/` (brief, skeleton, image-plan, prompts, production),
`scripts/check.mjs` (poort), `scripts/storyboard.mjs` (HTML). Gebruikt `ibs-videomontage/scripts/frames.mjs` voor
stills.

Getest (2026-10-20): `check.mjs` en `storyboard.mjs` op het kennisborging-project (17 shots, 1,3 MB, mobiel en
desktop zonder horizontaal scrollen).
- Headless skilltest (2026-10-20), 3 runs, zelfde opdracht (AI-beleidbrekers "Zelflerend", 45 s, geen eigen beeld,
  niemand om vragen te beantwoorden): alle drie laden de skill, vullen de brief met aannames en zetten die bij de
  open vragen (8–11), leveren een `production.json` zonder check-fouten en een `storyboard.html`; 2–5 min,
  $0,30–0,57. Stabiele opbouw: 2 gegenereerde openingsshots (handen, geen gezichten) → één woord splitst in vier
  → vier release-graphics, één per betekenis → de beleidsvraag → CTA. Skeletkeuze wisselt (piramide, PAS, ABT).
- Bevindingen en aanpassingen: run 3 maakte geen stills en bekeek de pagina niet → `storyboard.mjs` maakt de stills
  nu zelf, stap 7 heeft een eindcriterium (screenshot, elke kaart klopt). Lege first/last-frame-regels weg.
  Open: elke run vroeg 3–5 nieuwe graphics (`type: new`) voor uitleg-clips → generieke uitleg-graphics nodig
  (begrippenkaart, lagen, vergelijking). Geen image-model in de testomgeving, dus keyframes zijn schetsen.

## Open vragen

| # | Feature | Vraag | Antwoord |
|---|---|---|---|
| 1 | Releases | Zullen we v1.0.0 en v1.1.0 alsnog taggen, zodat collega's een downloadbare release hebben? | |
| 2 | F3 | Echte test: sta je `chatgpt.com` en `auth.openai.com` toe in de netwerkinstellingen van deze omgeving en log je één keer in? | Ja: domeinen toegestaan, ingelogd via browser en terugplakken. Werkt. |

Uitbreiding (2026-10-19, eigenaar: "goed om in deze video skills dit soort informatie altijd op te slaan"):
- **Productielogboek** per project: `production.json` (brief, skelet, elke shot met prompt, takes en keuze) en
  `LOG.md`, zodat een andere agent later één shot opnieuw kan genereren of één edit kan aanpassen
  (`references/production.md`). Ook bedoeld als gedeeld formaat voor de latere storyboard- en videogeneratie-skills.
- **Graphic shots** (`engine/ibs-graphics.js`): mail, puzzel → merkteken, badges, kenniskaart, flow, dark.
  Voor uitleg-beats zonder beeld van het product. Optie `onTwos`.
- **Feedback testmontage (kennisborging):** looks over elk shot maakten het beeld onleesbaar. Regel aangepast in
  `story.md`, `assets.md` en `signature.md`. Bug opgelost: bij een double wipe naar een graphic shot werd het
  vorige shot niet geladen (render.html).
- **Graphic shots uitgebreid (2026-10-20):** `minigames`, `city` (stad als voortgang, gebouwen = kennis), `chat`
  (kennisbank beantwoordt een vraag), naar aanleiding van de eigenaar: product moet duidelijk in beeld.
- **Retro (2026-10-20):** `scripts/check.mjs` (regels van de signature, draait vóór elke render; stopt bij fouten),
  `phase` per shot in de timeline, `grade: "golden"` (golden-hour-kleurcorrectie op footage), `scripts/intake.mjs`
  (verhouding, lengte en warmte per take), `render.mjs --review` (groot frame per shot en per caption), atomaire
  output (geen half geschreven MP4 bij twee renders), `scripts/frames.mjs` (stills voor het storyboard). Regel over
  looks op één plek (`assets.md`).
- **AI-orb (2026-10-21):** thinking-orbs 0.3.2 gebundeld als los script (`engine/vendor/thinking-orbs.js`, licentie
  erbij). Graphic `orb` (AI als personage met states), overlay `orb` (glazen schijf, leesbaar op elk beeld), chat met
  `thinking`. Getest in een render (stills + review).
- **Animatic:** `scripts/placeholders.mjs` maakt placeholders voor shots die nog niet bestaan; `fallback` in de
  timeline. Getest op een clip van 47 s (19 shots, 9 placeholders, 6 graphics): stills en MP4 renderen zonder fouten.

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
| 2026-10-03 | Fix: zonder ingestelde beeldservice vragen `image-generator` en `ibs-stockbeeld` eerst of de gebruiker er een wil instellen; pas na akkoord een prompt plus placeholder. Gaat mee in v1.3.0. Getest: 3 runs, alle drie vragen eerst. |
| 2026-10-03 | Integratietest (one-pager met alle vier de skills) goedgekeurd; `ibs-stockbeeld` en de speelsheid samen uitgebracht als v1.3.0. |
| 2026-10-03 | Skills zonder IBS-binding krijgen geen `ibs-`-voorvoegsel. |
| 2026-10-03 | Instructies: woorden goed definiëren, geen voorbeeldlijsten (bijv. geen lijst van sectoren). |
| 2026-10-19 | Nieuwe skill `ibs-videomontage` (F5): alleen monteren, hele clip; genereren en storyboard later als aparte skills. |
| 2026-10-21 | AI (gen-AI tool, assistent, agent) wordt in beeld altijd de thinking-orbs-orb in IBS-geel (MIT, gebundeld in `ibs-videomontage/engine/vendor/`): graphic `orb`, overlay `orb` in een glazen schijf, `thinking` in de chat; ook in `ibs-huisstijl` (software-web) voor AI-states. p5.brush niet als stijl (eigenaar). |
| 2026-10-20 | Nieuwe skill `ibs-storyboard` (F6): storyboard + shotlijst in één HTML met beelden, goedkeuring per shot; daarna (later) videogeneratie. Retro-verbeteringen in F5. |
| 2026-10-20 | Eerst een grilling-sessie als het verhaal nog niet helder is (product, kijker, gebruiker, doel), pas dan monteren. Tension en release moeten voelbaar verschillen; leestijd voor captions en graphics (eigenaar na testmontage v3). |
| 2026-10-19 | Footage blijft leesbaar: looks zijn accenten (FX-flash, detect-kader), standaard `look: none`, shots met verhaal 1,5–3 s (eigenaar na testmontage: "ik zie vrijwel nooit het daadwerkelijke video element"). |
| 2026-10-19 | `ibs-videomontage` houdt per project een productielogboek bij (`production.json` + `LOG.md`); graphic shots en animatic erbij. |
| 2026-10-19 | Divider: dubbele lijn met het IBS-merkteken in het midden, nooit een los vierkantje (eigenaar). Patch v1.3.1. |
| 2026-10-03 | Speelsheid in de huisstijl: merkteken als terugkerend detail en als geometrisch herhaalpatroon met verloop van IBS-geel naar amber, kleine animaties; geen tweede accentkleur. |
