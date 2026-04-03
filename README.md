# VolleyPlanner

Eine App zur Koordination von Volleyball-Spielterminen.

## Supabase Setup

Um die App mit Supabase zu nutzen, erstelle eine neue Tabelle `appointments` mit folgendem SQL. Jedes Team (H1, D1, etc.) verwaltet dabei seine eigenen Termine über die `team`-Spalte:

```sql
-- Tabelle erstellen
create table appointments (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  time time not null,
  location text not null,
  team text not null, -- Spalte für die Team-Zugehörigkeit (z.B. H1, D1)
  reserved boolean default false,
  reservedby jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) aktivieren
alter table appointments enable row level security;

-- Alle dürfen Termine für ihr jeweiliges Team lesen
create policy "Allow public read" on appointments for select using (true);

-- Alle dürfen reservieren (Update der reserved-Spalte)
create policy "Allow public update for reservations" on appointments for update using (true);

-- Einfügen und Löschen (Admin-Aktionen)
-- Da wir einen 4-stelligen Code in der App nutzen, erlauben wir anonyme Inserts/Deletes.
-- In einer Produktivumgebung sollte dies durch Auth-Rollen eingeschränkt werden.
create policy "Allow public insert" on appointments for insert with check (true);
create policy "Allow public delete" on appointments for delete using (true);
```

### Umgebungsvariablen

Erstelle eine `.env` Datei basierend auf `.env.example`:

```
VITE_SUPABASE_URL=deine-projekt-url
VITE_SUPABASE_ANON_KEY=dein-anon-key
```

## Entwicklung
