# Hair Studio Milano — pacchetto produzione

Questo pacchetto aggiorna il backend del sito senza toccare il tuo `page.tsx` attuale.

## 1. Copia i file

Copia le cartelle/file del pacchetto nella root del progetto Next.js. I file `app/layout.tsx` e `next.config.ts` sostituiscono quelli omonimi.

## 2. Installa Supabase JS

```bash
npm install @supabase/supabase-js
```

## 3. Configura `.env.local`

Non incollare chiavi reali nel codice.

Servono:

- `GROQ_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` oppure, solo come compatibilità, `SUPABASE_SERVICE_ROLE_KEY`
- `RATE_LIMIT_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- i tre campi privacy pubblici

Puoi continuare a lasciare la tua attuale `NEXT_PUBLIC_SUPABASE_ANON_KEY` senza usarla nel backend. Per nuovi progetti Supabase raccomanda le publishable/secret keys; le vecchie `anon`/`service_role` sono ancora compatibili durante la migrazione.

Genera il rate-limit secret con:

```bash
openssl rand -hex 32
```

## 4. Database

Apri Supabase → SQL Editor e incolla tutto `supabase-schema.sql`.

Il sistema usa una nuova tabella `booking_requests`, così non distrugge un'eventuale vecchia tabella `appointments`.

Il database impedisce anche sovrapposizioni di appuntamenti attivi tramite un vincolo PostgreSQL, quindi un semplice doppio click o due richieste simultanee non possono occupare lo stesso intervallo.

## 5. Pagina booking: due piccole modifiche consigliate

La tua `page.tsx` resta quella già costruita. Per rendere il selettore orari coerente con la durata del servizio, cambia la chiamata availability da:

```ts
/api/appointments?date=YYYY-MM-DD
```

a:

```ts
/api/appointments?date=YYYY-MM-DD&service=${encodeURIComponent(service)}
```

Poi, quando calcoli la lista degli slot, continua a usare `unavailableTimes` dal server.

Per i servizi con prezzo `da €`, nel riepilogo mostra `A partire da €X` invece di `€X`.

## 6. Test locale

```bash
npm run dev
```

Poi verifica:

```text
http://localhost:3000/api/health
```

Deve restituire `{"ok":true,...}`.

Test chat:
- "che giorno è il 18 ottobre?"
- "e il 19?"
- "siete aperti domenica?"
- "quanto costa il balayage?"
- "vorrei prenotare un balayage sabato alle 10"

Test booking:
- domenica/lunedì → rifiutati
- data passata → rifiutata
- orario a metà → rifiutato
- servizio troppo lungo a fine giornata → rifiutato
- due richieste sovrapposte → la seconda riceve 409

## 7. Prima del deploy

Controlla che `.env.local` sia ignorato da Git e non sia mai presente su GitHub.

Su Vercel configura le stesse variabili in Project Settings → Environment Variables.

Imposta `NEXT_PUBLIC_SITE_URL` sul dominio vero.

Completa la Privacy Policy con i dati reali del Titolare e fai verificare base giuridica, retention, destinatari e trasferimenti prima del lancio pubblico.
