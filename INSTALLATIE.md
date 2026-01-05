# LEGEND YOLO - Installatie Handleiding

## Wat is LEGEND YOLO?

LEGEND YOLO is een AI-gestuurde ontwikkel-assistent voor Cursor die volledig autonoom werkt. Je hoeft geen commando's goed te keuren - alles wordt automatisch uitgevoerd.

---

## Snelle Start (3 stappen)

### Stap 1: Open een nieuw of bestaand project in Cursor

Open Cursor en navigeer naar je project folder, of maak een nieuwe aan:

```bash
mkdir ~/mijn-nieuw-project
cd ~/mijn-nieuw-project
```

### Stap 2: Verbind je project met LEGEND YOLO

Open een terminal in Cursor (Ctrl+` of Cmd+`) en voer uit:

```bash
~/LEGEND/legend-core-yolo/scripts/connect-project.sh .
```

Dit maakt automatisch:
- Een `.cursor` symlink naar LEGEND YOLO
- Een `legend/` folder met configuratie
- Een `.gitignore` als die nog niet bestaat

### Stap 3: Herstart Cursor

Sluit Cursor volledig af en open het opnieuw. Dit zorgt ervoor dat de commands worden geladen.

---

## Gebruik

### Beschikbare Commands

Typ `/` in de Cursor chat om alle commands te zien:

| Command | Wat het doet |
|---------|--------------|
| `/legend` | Algemene orchestrator - begrijpt natuurlijke taal |
| `/legend-scope <naam>` | Maak een feature specificatie |
| `/legend-design <naam>` | Ontwerp de architectuur |
| `/legend-build <naam>` | Bouw de feature |
| `/legend-test <naam>` | Schrijf en voer tests uit |
| `/legend-status` | Toon voortgang van alle features |
| `/legend-setup-git` | Initialiseer Git repository |
| `/legend-setup-supabase` | Setup Supabase project |
| `/legend-setup-vercel` | Setup Vercel deployment |

### Voorbeeld Workflow

```
/legend-scope user-login
```
Maakt een specificatie voor een user login feature.

```
/legend-design user-login
```
Ontwerpt de architectuur, API's en database schema.

```
/legend-build user-login
```
Bouwt de feature - voert automatisch alle commando's uit.

```
/legend-test user-login
```
Schrijft en draait tests automatisch.

### Natuurlijke Taal

Je kunt ook gewoon typen wat je wilt:

```
/legend maak een contact formulier met email validatie
```

```
/legend wat is de status van mijn features?
```

```
/legend setup git voor dit project
```

---

## Project Configuratie

Na het verbinden vind je `legend/project.config.json` in je project. Pas dit aan voor jouw stack:

```json
{
  "name": "mijn-project",
  "stack": {
    "frontend": "nextjs-app-router",
    "backend": "supabase",
    "db": "postgres",
    "language": "typescript"
  },
  "testing": {
    "unit": "vitest",
    "e2e": "playwright"
  }
}
```

---

## YOLO Mode - Wat betekent dit?

In YOLO mode doet LEGEND alles automatisch zonder te vragen:

| Actie | Normaal | YOLO Mode |
|-------|---------|-----------|
| Shell commando's | Vraagt goedkeuring | Voert direct uit |
| Git push | Vraagt bevestiging | Push direct |
| Database migraties | Toont preview eerst | Past direct toe |
| Productie deploy | Vraagt bevestiging | Deployt direct |
| Tests draaien | Vraagt eerst | Draait direct |

---

## Tips

1. **Begin met `/legend-scope`** - Een goede specificatie leidt tot betere code

2. **Check `/legend-status`** - Zie waar je bent in het development proces

3. **Gebruik betekenisvolle namen** - `user-auth` is beter dan `feature1`

4. **Feature artifacts** - Alle documentatie komt in `legend/features/`

---

## Problemen Oplossen

### Commands verschijnen niet

1. Controleer of `.cursor` folder bestaat in je project
2. Herstart Cursor volledig
3. Typ `/` en wacht even tot de lijst laadt

### Symlink werkt niet

Voer handmatig uit:
```bash
ln -s ~/LEGEND/legend-core-yolo/.cursor .cursor
```

### Permission denied

Maak het script uitvoerbaar:
```bash
chmod +x ~/LEGEND/legend-core-yolo/scripts/connect-project.sh
```

---

## Hulp Nodig?

Typ in Cursor chat:
```
/legend help
```

Of bekijk de volledige documentatie in `legend/USAGE.md`
