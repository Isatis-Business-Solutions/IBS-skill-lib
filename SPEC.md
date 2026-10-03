# Spec: IBS-skillbibliotheek

Hier houden we bij waar we aan werken: features, open vragen, besluiten en de releases waar we naartoe werken.
Elke nieuwe skill of grote wijziging begint hier. Wie (of welke AI) in deze repo werkt, laadt eerst de skill
`ibs-library-maintainer` (`.claude/skills/`); die beschrijft hoe dit document wordt gebruikt.

**Status per feature:** idee → brainstorm → besloten → in bouw (`drafts/`) → testen → klaar (`skills/`) → uitgebracht.

## Releases

| Versie | Inhoud | Status |
|---|---|---|
| v1.0.0 | `ibs-huisstijl` | op `main`, nog niet getagd |
| v1.1.0 | `ibs-schrijfstijl` | op `main`, nog niet getagd |
| v1.2.0 | F1 beheer-skill + dit spec-document | voorstel |
| v1.3.0 | F2 `ibs-stockbeeld` + F3 verwijzing vanuit `ibs-huisstijl` | voorstel |
| v1.4.0 | F4 speelsheid in de huisstijl | voorstel |

Versienummers: nieuwe skill of nieuwe functie = minor (1.x.0), reparatie = patch (1.1.x), iets dat bestaand
gebruik breekt (bijv. een skill hernoemen) = major (2.0.0).

## Features

### F1. Beheer-skill voor deze repo (`ibs-library-maintainer`)

**Status:** in bouw (concept staat in `.claude/skills/ibs-library-maintainer/`).

Een interne skill die altijd geladen wordt als iemand met een agent in deze repo werkt. Hij zorgt dat elke
collega op dezelfde manier werkt: eerst de spec, maximaal 5 vragen tegelijk aan de eigenaar, bouwen in
`drafts/`, testen zonder uploaden, pas na akkoord naar `skills/`, en uitbrengen als release.

- Staat in `.claude/skills/`, dus Claude Code laadt hem in deze repo; hij wordt niet gepubliceerd.

### F2. Stockbeelden in IBS-stijl (`ibs-stockbeeld`, werknaam)

**Status:** brainstorm.

Een skill voor het maken van beelden waar je normaal een stockfoto voor zou gebruiken: websites, LinkedIn,
presentaties, proposities, advertenties.

Wat we al weten:
- Onderwerp: **de sector** waar we onze data- of AI-oplossing op loslaten, niet de technologie zelf.
  Bijvoorbeeld energie: een schakelstation (hoog- naar laagspanning) of een hoogspanningsmast.
- Licht: **golden hour**. Dat sluit aan bij de huisstijl (warm geel accent op een donkere basis).
- Uitstraling: **duurzaam en net iets groener**. Niet door een groene kleurfilter, maar door elementen: meer
  bomen, een weiland, natuur rondom de installatie.
- Stijl: realistisch, foto-achtig, zoals een goede stockfoto.
- **Niet** voor infographics; daarvoor komt eventueel een aparte aanpak met iconen (zie F5).

Open vragen: zie hieronder.

### F3. `ibs-huisstijl` verwijst naar `ibs-stockbeeld`

**Status:** besloten (klein).

Als er een foto of sfeerbeeld nodig is, verwijst de huisstijl naar `ibs-stockbeeld`, met een terugvaloptie als
die skill er niet is.

### F4. Speelsheid in de huisstijl

**Status:** brainstorm.

De huidige huisstijl is mooi maar straalt weinig plezier uit. Fun is een kernwaarde, dus we zoeken een manier
om iets speels toe te voegen zonder de rust en kwaliteit te verliezen. Richtingen om te bespreken:

- **a. Golden hour als motief:** een warme verloop van IBS-geel naar amber als accent, bijv. achter een kop
  of op een titelslide. Sluit aan op de foto's van F2.
- **b. Het merkteken als speels element:** het merkteken terug laten komen als klein, terugkerend detail
  (bullet, hoekje, sticker), soms gedraaid of uitgesneden.
- **c. Beweging:** kleine animaties in digitale uitingen (hover, een kop die binnenkomt).
- **d. Een tweede accentkleur:** spaarzaam, bijv. een zacht groen dat ook bij duurzaamheid past.

### F5. Infographics met iconen

**Status:** geparkeerd. Liever met iconen dan met realistische beelden. Pas na F2 oppakken.

### F6. Verbeterpunten `ibs-schrijfstijl`

**Status:** geparkeerd. Zie `docs/ibs-schrijfstijl.md` (briefing herhalen, verzonnen details, clichés).

## Open vragen

| # | Feature | Vraag | Antwoord |
|---|---|---|---|
| 1 | F2 | Met welke tool maken collega's beelden? Claude maakt zelf geen foto's: schrijft de skill een prompt om te plakken, of roept hij een beeld-API direct aan? | |
| 2 | F2 | Wat mag in beeld: mensen (herkenbaar, van achteren, niet)? En een subtiel data- of AI-element, of puur de sector? | |
| 3 | F2 | Welke formaten zijn nodig (LinkedIn, website-header, slides, Meta-advertenties), en moet er ruimte zijn voor tekst over het beeld? | |
| 4 | F4 | Welke richting voor speelsheid spreekt je aan (a–d), of iets anders? | |
| 5 | Releases | Akkoord met de volgorde hierboven? En zullen we v1.0.0 en v1.1.0 alsnog taggen als release? | |

## Besluitenlog

| Datum | Besluit |
|---|---|
| 2026-10-03 | Repo `IBS-skill-lib`, `main` als basis; nieuwe skills beginnen in `drafts/`. |
| 2026-10-03 | `ibs-schrijfstijl` bestaat alleen uit regels en gedefinieerde gevoelswoorden, nooit uit voorbeeldteksten. |
| 2026-10-03 | Vakjargon uit data, AI en IT altijd in het Engels (Engelse spelling), de rest Nederlands. |
| 2026-10-03 | Nieuwe skill voor stockbeelden: sector, golden hour, duurzame uitstraling; niet voor infographics. |
| 2026-10-03 | Werken vanuit `SPEC.md`, met maximaal 5 vragen tegelijk aan de eigenaar en releases als doel. |
