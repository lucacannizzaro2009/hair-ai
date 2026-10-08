export const dynamic = "force-static";

const controller = process.env.NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME || "[INSERIRE TITOLARE / RAGIONE SOCIALE]";
const email = process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "[INSERIRE EMAIL PRIVACY]";
const address = process.env.NEXT_PUBLIC_PRIVACY_ADDRESS || "[INSERIRE SEDE / INDIRIZZO]";
const version = process.env.NEXT_PUBLIC_PRIVACY_POLICY_VERSION || "1.0";

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px", fontFamily: "Arial, sans-serif", lineHeight: 1.7 }}>
      <p style={{ opacity: 0.65 }}>Hair Studio Milano</p>
      <h1 style={{ fontSize: 48, lineHeight: 1.05, margin: "16px 0 24px" }}>Privacy Policy</h1>
      <p>Versione {version}</p>

      <section>
        <h2>1. Titolare del trattamento</h2>
        <p>
          Titolare: <strong>{controller}</strong><br />
          Sede: {address}<br />
          Email privacy: {email}
        </p>
      </section>

      <section>
        <h2>2. Dati trattati</h2>
        <p>
          Per le richieste di appuntamento il sito può trattare il nome inserito dall&apos;utente,
          servizio scelto, data, orario, eventuali extra, stima del prezzo e dati tecnici necessari
          a proteggere il servizio da abusi. Le conversazioni con il concierge AI vengono inviate al
          provider AI configurato dal sito per generare la risposta e non vengono archiviate dal sito
          nella tabella degli appuntamenti.
        </p>
      </section>

      <section>
        <h2>3. Finalità</h2>
        <p>
          I dati vengono trattati per rispondere alle richieste dell&apos;utente, gestire le richieste di
          appuntamento, verificare la disponibilità e proteggere le API da uso automatizzato illecito.
        </p>
      </section>

      <section>
        <h2>4. Conservazione</h2>
        <p>
          La durata di conservazione deve essere definita dal Titolare in base alle effettive esigenze
          del servizio e agli obblighi applicabili. Prima della pubblicazione sostituisci questo testo
          con il periodo di conservazione effettivamente adottato.
        </p>
      </section>

      <section>
        <h2>5. Diritti dell&apos;interessato</h2>
        <p>
          L&apos;interessato può esercitare i diritti previsti dalla normativa applicabile contattando il
          Titolare all&apos;indirizzo indicato sopra. Le informazioni su base giuridica, destinatari,
          trasferimenti e procedure di gestione delle richieste devono essere completate dal Titolare
          prima del lancio pubblico.
        </p>
      </section>

      <section>
        <h2>6. Servizi di terze parti</h2>
        <p>
          Il sito utilizza Groq per la generazione delle risposte del concierge AI e Supabase per la
          gestione tecnica delle richieste di appuntamento. Configura e verifica le relative informative,
          condizioni e trasferimenti di dati prima della messa online.
        </p>
      </section>

      <section>
        <h2>7. Contatti</h2>
        <p>Per informazioni privacy: {email}</p>
      </section>

      <p style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ddd", opacity: 0.7 }}>
        Questa pagina è un modello tecnico predisposto per il sito e non sostituisce la verifica legale
        dei dati del Titolare, delle basi giuridiche e dei tempi di conservazione effettivamente adottati.
      </p>
    </main>
  );
}
