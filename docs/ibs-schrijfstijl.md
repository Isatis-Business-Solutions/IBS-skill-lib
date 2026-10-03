# ibs-schrijfstijl: achtergrond voor beheerders

Waarom de skill zo is opgebouwd, en hoe je hem test. Dit bestand hoort niet bij de skill zelf.

## Opzet

De skill noemt de kernwaarden niet. Hij vertaalt elke waarde naar een **beweging**: zichtbaar schrijfgedrag.
Elke beweging is beschreven met **gevoelswoorden met een duidelijke definitie, regels en een grens. Bewust
geen voorbeeldteksten**: voorbeelden sturen te veel één kant op, de skill moet voor elk onderwerp werken.
Eén vaste taalregel: vakjargon uit data, AI en IT in het Engels, de rest Nederlands.

| Kernwaarde (intern) | Beweging in de skill |
|---|---|
| Responsibility | ownership (eigenaarschap) |
| Transparantie | openness (openheid) |
| Creativiteit | inventiveness (vindingrijkheid) |
| Nieuwsgierigheid | curiosity (nieuwsgierigheid) |
| Fun | lightness (luchtigheid) |

Elke beweging heeft drie niveaus: **leading** (leidend), **present** (aanwezig) en **undertone** (ondertoon).
Alle vijf zitten altijd in de tekst; alleen het volume verschilt.

Zo wordt de skill gelezen, zodat er alleen relevante tekst in de context komt:

1. `SKILL.md` (altijd): de stem, de vijf bewegingen in één regel, de werkwijze.
2. Eén doelgroepbestand in `audiences/`: het standaardmengsel en hoe dat per doel verschuift.
3. Vijf bewegingsbestanden: per beweging alleen het gekozen niveau (`movements/<beweging>/<niveau>.md`).
4. Eventueel één kanaalbestand (`channels/`) en één taalbestand (`language/`).

De skill vraagt alleen naar lezer en doel als dat niet al duidelijk is, en kiest het mengsel zelf. Na de
tekst noemt hij in één regel het gekozen mengsel, zodat je kunt bijsturen ("meer fun", "zakelijker").

## Huidige schrijfstijl (bron: i-b-s.nl, via zoeksamenvattingen)

De site kon niet direct gelezen worden; deze analyse is gebaseerd op samenvattingen uit zoekresultaten.
- Er lijken twee lagen te zijn: een oudere, generieke set waarden ("klantgericht, respect, servicegericht,
  kwaliteit, betrokkenheid") en een nieuwere, persoonlijkere toon ("menselijk, eerlijk en betekenisvol",
  "eigenaarschap en transparantie", "zeggen wat we doen en doen wat we zeggen", "nieuwsgierige leerlingen",
  "data-solutions for a humane society").
- De nieuwere toon zegt vooral *wat* IBS is. De skill wil dat de tekst het *laat zien*: concrete toezeggingen,
  feiten en getallen, echte vragen, één verrassende invalshoek, en warmte in ritme en woordkeus.

## Open vragen

- U of je naar klanten: nu "volg de relatie, bij twijfel u". Klopt dat?
- Doelgroepen: klanten, kandidaten, collega's, netwerk. Missen er (bijv. partners apart, investeerders)?
- Standaardmengsels per doelgroep: eerste voorstel, te kalibreren met de testrondes.

## Testplan

1. **Stabiliteit:** elke versie van de skill draait minstens 3 keer op dezelfde opdracht; het gevoel moet
   in alle runs gelijk zijn. Het oordeel van de eigenaar wordt een regel of een scherpere definitie, nooit
   een voorbeeld.
2. **Overdrijftest:** één beweging op het hoogste niveau, om de grens te vinden.
3. **Vaste testset:** ±6 opdrachten over de doelgroepen (propositie, klantmail, vacature, LinkedIn-werving,
   interne update, uitnodiging), met en zonder skill (`skill-creator`).
4. **Lezerstest bij collega's:** wat is de boodschap in één zin, en welke drie woorden passen bij het gevoel?
   Als ze de kernwaarden letterlijk kunnen opnoemen, is de tekst te expliciet.

## Zo test je zonder uploaden

Zet de skill in een lege map onder `.claude/skills/` en draai Claude Code zonder interactie, bijvoorbeeld
`claude -p "<opdracht>" --output-format stream-json --verbose`. In de uitvoer zie je welke bestanden de skill
laadt en welke tekst eruit komt. Draai elke opdracht minstens 3 keer.

## Bekende punten (stand bij v1.1.0)

- Herhaalt soms de formulering van de briefing, vooral als die de kernboodschap letterlijk noemt.
- Verzint soms levendige details als de opdracht weinig echte details geeft (bijv. een post over een event).
- Clichés in de vorm van drie bijvoeglijke naamwoorden glippen er soms door.
