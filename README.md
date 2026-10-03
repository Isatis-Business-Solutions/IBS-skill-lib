# IBS skills

Skills voor AI-assistenten (Claude en andere agents) die we bij **IBS – Isatis Business Solutions** gebruiken.
*Skills for AI assistants used at IBS – Isatis Business Solutions. English below.*

| Skill | Wat het doet |
|---|---|
| [`ibs-huisstijl`](skills/ibs-huisstijl/SKILL.md) | De IBS-huisstijl voor software, websites, HTML-pagina's en -presentaties, HTML-e-mail, Word, PowerPoint, PDF en Excel. Met logo's, Poppins en kleurtokens (CSS/JSON/Tailwind). |
| `ibs-schrijfstijl` | *Gepland:* toon en schrijfstijl van IBS. `ibs-huisstijl` verwijst ernaar zodra die er is. |

Voorbeeld van de huisstijl: open [`preview/index.html`](preview/index.html) in je browser.

## Installeren

**1. In een project (aanpasbare kopie), voor Claude Code, Cursor en andere agents:**

```bash
npx skills@latest add Isatis-Business-Solutions/IBS-skill-lib
```

**2. Als plugin in Claude Code (alleen-lezen, altijd de nieuwste versie):**

```text
/plugin marketplace add Isatis-Business-Solutions/IBS-skill-lib
/plugin install ibs-skills@ibs
```

**3. In de Claude-app (chat, Cowork, desktop):** download `ibs-huisstijl.zip` bij de nieuwste
[release](../../releases), en upload die via **Instellingen → Capabilities → Skills**. Bij een Team- of
Enterprise-account kan een beheerder de skill voor de hele organisatie aanzetten.

## Gebruiken

Vraag gewoon om iets "in IBS-stijl", bijvoorbeeld:
- "Maak een Word-offerte in IBS-huisstijl."
- "Zet deze cijfers in een Excel met de IBS-look."
- "Bouw een HTML-presentatie voor de klantdag, IBS-stijl."
- "Geef deze React-app de IBS-huisstijl."

## Bijdragen

Zie [`CLAUDE.md`](CLAUDE.md): hoe een skill is opgebouwd, conventies, en hoe je een nieuwe versie uitbrengt.

---

## English

Skills for AI assistants used at **IBS – Isatis Business Solutions**.

- **Install in a project:** `npx skills@latest add Isatis-Business-Solutions/IBS-skill-lib`
- **Claude Code plugin:** `/plugin marketplace add Isatis-Business-Solutions/IBS-skill-lib`, then `/plugin install ibs-skills@ibs`
- **Claude app:** upload `ibs-huisstijl.zip` from the latest release under Settings → Capabilities → Skills.

Then ask for anything "in IBS style": software, web pages, HTML slides, e-mails, Word, PowerPoint, PDF or
Excel.

License: MIT for text and code. The IBS name and logo: see [`BRAND.md`](BRAND.md). Poppins: SIL OFL 1.1.
