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
| v1.2.0 | F1 `ibs-stockbeeld` (inclusief verwijzing vanuit `ibs-huisstijl`) | voorstel |
| v1.3.0 | F2 speelsheid in de huisstijl | voorstel |
| later | F3 skill voor beeldgeneratie | idee |

Versienummers: nieuwe skill of nieuwe functie = minor (1.x.0), alleen reparaties = patch (1.1.x), iets dat
bestaand gebruik breekt (bijv. een skill hernoemen) = major (2.0.0).

## Features

### F1. Stockbeelden in IBS-stijl (`ibs-stockbeeld`, werknaam)

**Status:** brainstorm. **Release:** v1.2.0.

Een skill die beschrijft hoe een beeld eruitziet dat je normaal als stockfoto zou gebruiken. De skill bepaalt
de beeldtaal; het maken van het beeld zelf gebeurt via een beeldmodel (zie F3).

Besloten:
- **Onderwerp: puur de sector** waar we onze data- of AI-oplossing op loslaten. Mensen uit die sector moeten
  hun eigen wereld herkennen. Bijvoorbeeld energie: een schakelstation (hoog- naar laagspanning) of een
  hoogspanningsmast.
- **Realistisch en eigentijds**, zoals een goede stockfoto.
- **Golden hour.** Het licht maakt alles geel en oranje; dat sluit aan op de huisstijl.
- **Natuurlijke uitstraling door elementen, niet door kleur:** meer bomen, een weiland, natuur rondom de
  installatie. **Geen groene kleurtoon of groen accent**; de kleur komt van het golden-hour-licht.
- **Speels element:** een minimale hint van **retro-futurisme**, de toekomst zoals men die in de jaren 70 en
  80 voor zich zag. Het beeld blijft vooral eigentijds; de hint is een sprankje, niet het onderwerp.
- **Formaten** horen niet in deze skill; die verschillen per gebruik.
- **Afbakening:** de skill zegt zelf dat hij niet bedoeld is voor infographics, schema's of iconen.
- **`ibs-huisstijl` verwijst** naar deze skill als er een foto of sfeerbeeld nodig is (met terugvaloptie).

### F2. Speelsheid in de huisstijl

**Status:** brainstorm. **Release:** v1.3.0.

De huidige huisstijl is mooi maar straalt weinig plezier uit. Fun is een kernwaarde.

Besloten:
- **Het merkteken als klein, terugkerend speels detail**, overal een beetje inzetbaar.
- **Het merkteken als patroon op de achtergrond**, herhaald, met een verloop eroverheen. Een accent, nooit
  druk.
- **Kleine animaties** in digitale uitingen.
- **Geen tweede accentkleur.** Geen groen.

### F3. Skill voor beeldgeneratie

**Status:** idee. **Release:** later.

Een aparte skill die alleen beschrijft hoe Claude een beeldmodel gebruikt: bijvoorbeeld via Codex onder het
eigen account (ChatGPT) of via de Gemini-API. Los van de beeldtaal (F1), zodat F1 met elk beeldmodel werkt.

## Ontwikkeling (onder de motorkap)

Geen eigen release; gaat mee in de eerstvolgende release.

- **Beheer-skill `ibs-library-maintainer`** (`.claude/skills/`, intern): werkwijze voor deze repo. Klaar.
- **Dit spec-document.** Klaar.

## Open vragen

| # | Feature | Vraag | Antwoord |
|---|---|---|---|
| 1 | F2 | Het patroon met verloop noemde je art deco; in `CLAUDE.md` staat nu "geen art deco in de IBS-huisstijl" (dat was van GYM-8020). Beschrijven we het als geometrisch herhaalpatroon en laten we die regel staan, of gaat de regel eruit? | |
| 2 | F2 | Het verloop over het patroon: van IBS-geel naar amber (golden hour), of van donker naar transparant? | |
| 3 | F1 | Voor welke sectoren werkt IBS? Dan beschrijft de skill per sector wat herkenbaar is. | |
| 4 | Releases | F1 eerst en F3 later: tot F3 er is, levert `ibs-stockbeeld` een prompt die je zelf in een beeldtool plakt. Akkoord, of F1 en F3 samen uitbrengen? | |
| 5 | Releases | Zullen we v1.0.0 en v1.1.0 alsnog taggen, zodat collega's een downloadbare release hebben? | |

## Besluitenlog

| Datum | Besluit |
|---|---|
| 2026-10-03 | Repo `IBS-skill-lib`, `main` als basis; nieuwe skills beginnen in `drafts/`. |
| 2026-10-03 | `ibs-schrijfstijl` bestaat alleen uit regels en gedefinieerde gevoelswoorden, nooit uit voorbeeldteksten. |
| 2026-10-03 | Vakjargon uit data, AI en IT altijd in het Engels (Engelse spelling), de rest Nederlands. |
| 2026-10-03 | Werken vanuit `SPEC.md`, met maximaal 5 vragen tegelijk aan de eigenaar en releases als doel. |
| 2026-10-03 | Releases gaan over wat gebruikers merken; fixes en repo-werkwijze gaan mee, zonder eigen release. |
| 2026-10-03 | `ibs-stockbeeld`: puur de sector, realistisch en eigentijds, golden hour, natuur door elementen (geen groen), minimale hint van retro-futurisme (jaren 70/80); geen formaten; niet voor infographics. |
| 2026-10-03 | Beeldgeneratie (Codex/ChatGPT, Gemini-API) wordt een aparte skill. |
| 2026-10-03 | Speelsheid in de huisstijl: merkteken als terugkerend detail en als subtiel achtergrondpatroon met verloop, kleine animaties; geen tweede accentkleur. |
