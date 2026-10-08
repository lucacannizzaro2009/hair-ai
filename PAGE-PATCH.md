# Due micro-modifiche a `app/page.tsx`

Il `page.tsx` che hai già è la parte grafica principale e non va riscritto.
Fai soltanto questi due aggiornamenti per allinearlo al nuovo backend.

## 1) Invia anche il servizio alla disponibilità

Dentro `loadAvailability(...)`, trova il fetch verso:

```ts
/api/appointments?date=...
```

E fai in modo che l'URL diventi:

```ts
`/api/appointments?date=${encodeURIComponent(value)}&service=${encodeURIComponent(service)}`
```

Dove `value` è la data e `service` è il nome del servizio selezionato.

Se la tua funzione riceve già solo la data, portala a questo schema:

```ts
const loadAvailability = async (value: string, selectedService = service) => {
  if (!value) {
    setUnavailableTimes([]);
    return;
  }

  setAvailabilityLoading(true);
  try {
    const response = await fetch(
      `/api/appointments?date=${encodeURIComponent(value)}&service=${encodeURIComponent(selectedService)}`,
      { cache: "no-store" },
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || "AVAILABILITY");

    setUnavailableTimes(
      Array.isArray(data?.unavailableTimes)
        ? data.unavailableTimes
        : Array.isArray(data?.appointments)
          ? data.appointments.map((item: { time: string }) => item.time)
          : [],
    );
  } catch {
    setUnavailableTimes([]);
  } finally {
    setAvailabilityLoading(false);
  }
};
```

Quando cambia il servizio, richiama poi `loadAvailability(date, nuovoServizio)`.

## 2) Non mostrare come prezzo definitivo i servizi "da €"

Nel riepilogo dell'appuntamento, dove mostri il totale, usa una label condizionale.
Il concetto deve essere:

```tsx
<span>
  {selectedService?.priceFrom ? "A partire da " : ""}€{bookingTotal}
</span>
```

Per i servizi a prezzo fisso resterà `€35`, `€25`, ecc.
Per Balayage, Colore, HSM Signature ecc. comparirà `A partire da €...`.

Il backend non accetta mai il prezzo o la durata ricevuti dal browser come fonte di verità: li ricalcola dal catalogo server.
