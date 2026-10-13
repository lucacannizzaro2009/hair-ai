"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

type View =
  | "home"
  | "services"
  | "assistant"
  | "booking";

type ServiceCategory =
  | "TUTTI"
  | "CUT"
  | "STYLE"
  | "COLOR"
  | "CARE"
  | "SIGNATURE";

type Service = {
  name: string;
  price: string;
  amount: number;
  category: Exclude<ServiceCategory, "TUTTI">;
  description: string;
  duration: string;
  tag?: string;
};

type AddOn = {
  name: string;
  price: number;
  description: string;
};

const BUSINESS = {
  name: "Hair Studio Milano",
  address: "Via Torino 15",
  city: "Milano",
  region: "Lombardia",
  country: "Italia",
  openingDays: [
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ],
  openingTime: "09:00",
  closingTime: "19:30",
};

const services: Service[] = [
  {
    name: "Taglio Donna",
    price: "€35",
    amount: 35,
    category: "CUT",
    description:
      "Forma, movimento e proporzioni costruite intorno a te.",
    duration: "45 min",
    tag: "ICON",
  },
  {
    name: "Taglio Uomo",
    price: "€25",
    amount: 25,
    category: "CUT",
    description:
      "Precisione, struttura e carattere in ogni dettaglio.",
    duration: "30 min",
    tag: "BESTSELLER",
  },
  {
    name: "Taglio Junior",
    price: "€20",
    amount: 20,
    category: "CUT",
    description:
      "Un taglio pensato per i più giovani, semplice e curato.",
    duration: "25 min",
  },
  {
    name: "Frangia / Refresh",
    price: "€12",
    amount: 12,
    category: "CUT",
    description:
      "Un piccolo intervento per rinfrescare subito il look.",
    duration: "15 min",
  },
  {
    name: "Piega",
    price: "€20",
    amount: 20,
    category: "STYLE",
    description:
      "Volume, lucentezza e un finish impeccabile.",
    duration: "35 min",
    tag: "EVERYDAY",
  },
  {
    name: "Piega Luxury",
    price: "€30",
    amount: 30,
    category: "STYLE",
    description:
      "Styling più strutturato con finish editoriale.",
    duration: "50 min",
  },
  {
    name: "Onde / Wavy",
    price: "€25",
    amount: 25,
    category: "STYLE",
    description:
      "Onde morbide e texture naturali con effetto effortless.",
    duration: "45 min",
  },
  {
    name: "Acconciatura",
    price: "da €40",
    amount: 40,
    category: "STYLE",
    description:
      "Look speciali per eventi, cerimonie e occasioni importanti.",
    duration: "60 min",
    tag: "EVENT",
  },
  {
    name: "Colore",
    price: "da €45",
    amount: 45,
    category: "COLOR",
    description:
      "Tonalità personalizzate pensate per valorizzarti.",
    duration: "90 min",
    tag: "CUSTOM",
  },
  {
    name: "Root Touch-Up",
    price: "da €35",
    amount: 35,
    category: "COLOR",
    description:
      "Copertura e armonizzazione della ricrescita.",
    duration: "70 min",
  },
  {
    name: "Gloss / Toner",
    price: "da €30",
    amount: 30,
    category: "COLOR",
    description:
      "Più brillantezza, riflessi e profondità.",
    duration: "45 min",
  },
  {
    name: "Balayage",
    price: "da €70",
    amount: 70,
    category: "COLOR",
    description:
      "Sfumature morbide, luce naturale e profondità.",
    duration: "150 min",
    tag: "ICON",
  },
  {
    name: "Highlights",
    price: "da €65",
    amount: 65,
    category: "COLOR",
    description:
      "Schiariture personalizzate per creare movimento e luce.",
    duration: "140 min",
  },
  {
    name: "Face Framing",
    price: "da €45",
    amount: 45,
    category: "COLOR",
    description:
      "Luce mirata intorno al viso per un risultato più fresco.",
    duration: "75 min",
    tag: "TREND",
  },
  {
    name: "Keratina",
    price: "€50",
    amount: 50,
    category: "CARE",
    description:
      "Morbidezza, disciplina e capelli più facili da gestire.",
    duration: "90 min",
    tag: "CARE",
  },
  {
    name: "Hair Repair",
    price: "€25",
    amount: 25,
    category: "CARE",
    description:
      "Trattamento intensivo per capelli stressati o danneggiati.",
    duration: "30 min",
  },
  {
    name: "Scalp Ritual",
    price: "€22",
    amount: 22,
    category: "CARE",
    description:
      "Detersione, massaggio e trattamento dedicato al cuoio capelluto.",
    duration: "25 min",
  },
  {
    name: "Deep Hydration",
    price: "€20",
    amount: 20,
    category: "CARE",
    description:
      "Idratazione profonda per restituire morbidezza e luminosità.",
    duration: "25 min",
  },
  {
    name: "HSM Signature",
    price: "da €95",
    amount: 95,
    category: "SIGNATURE",
    description:
      "Consulenza, taglio, styling e trattamento in un'unica esperienza.",
    duration: "120 min",
    tag: "SIGNATURE",
  },
  {
    name: "Total Blonde",
    price: "da €120",
    amount: 120,
    category: "SIGNATURE",
    description:
      "Percorso completo per trasformazioni bionde personalizzate.",
    duration: "210 min",
    tag: "TRANSFORMATION",
  },
  {
    name: "Color Transformation",
    price: "da €110",
    amount: 110,
    category: "SIGNATURE",
    description:
      "Un cambio colore completo progettato passo dopo passo.",
    duration: "210 min",
    tag: "TRANSFORMATION",
  },
  {
    name: "Event Ready",
    price: "da €80",
    amount: 80,
    category: "SIGNATURE",
    description:
      "Preparazione completa per una serata speciale.",
    duration: "90 min",
    tag: "EVENT",
  },
];

const addOns: AddOn[] = [
  {
    name: "Massaggio cute",
    price: 10,
    description: "10 minuti di relax",
  },
  {
    name: "Gloss express",
    price: 15,
    description: "Extra luminosità",
  },
  {
    name: "Treatment boost",
    price: 18,
    description: "Trattamento intensivo",
  },
  {
    name: "Blow-dry finish",
    price: 12,
    description: "Finish premium",
  },
];

const packages = [
  {
    number: "01",
    name: "HSM RESET",
    description:
      "Un percorso essenziale per ripartire con un look pulito e curato.",
  },
  {
    number: "02",
    name: "GLOW SESSION",
    description:
      "Un'esperienza dedicata a luminosità, colore e styling.",
  },
  {
    number: "03",
    name: "SIGNATURE DAY",
    description:
      "Il percorso più completo per costruire un look su misura.",
  },
];

const categoryLabels: ServiceCategory[] = [
  "TUTTI",
  "CUT",
  "STYLE",
  "COLOR",
  "CARE",
  "SIGNATURE",
];

const faqItems = [
  {
    question:
      "Quali sono i giorni di apertura?",
    answer:
      "Il salone è aperto dal martedì al sabato, dalle 09:00 alle 19:30.",
  },
  {
    question:
      "Posso prenotare una trasformazione colore?",
    answer:
      "Sì. Per i cambi importanti è consigliabile usare l'AI Concierge per descrivere il risultato desiderato e capire quale servizio può essere più adatto.",
  },
  {
    question:
      "Posso aggiungere extra alla prenotazione?",
    answer:
      "Sì. Puoi aggiungere uno o più extra nella schermata di prenotazione.",
  },
  {
    question:
      "Cosa succede dopo aver inviato la richiesta?",
    answer:
      "La richiesta viene inviata al sistema di prenotazione. La conferma effettiva dipende dalla gestione del salone e dalla disponibilità.",
  },
];

const serviceNames = services.map(
  (item) => item.name
);

function getLocalDateItaly() {
  return new Date().toLocaleDateString(
    "sv-SE",
    {
      timeZone: "Europe/Rome",
    }
  );
}

function getWeekDay(
  isoDate: string
) {
  const date = new Date(
    `${isoDate}T12:00:00`
  );

  return date.getDay();
}

function isClosedDate(
  isoDate: string
) {
  const day = getWeekDay(isoDate);

  return day === 0 || day === 1;
}

function isTimeInsideBusinessHours(
  value: string
) {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const [hours, minutes] =
    value
      .split(":")
      .map(Number);

  const total =
    hours * 60 + minutes;

  const opening =
    9 * 60;

  const closing =
    19 * 60 + 30;

  return (
    total >= opening &&
    total <= closing
  );
}

function isPastTimeToday(
  selectedDate: string,
  selectedTime: string
) {
  if (
    selectedDate !==
    getLocalDateItaly()
  ) {
    return false;
  }

  const now = new Date();

  const [hours, minutes] =
    selectedTime
      .split(":")
      .map(Number);

  const selected =
    new Date();

  selected.setHours(
    hours,
    minutes,
    0,
    0
  );

  return selected <= now;
}

function createTimeSlots() {
  const slots: string[] = [];

  for (
    let total = 9 * 60;
    total <= 19 * 60 + 30;
    total += 30
  ) {
    const hours =
      String(
        Math.floor(total / 60)
      ).padStart(2, "0");

    const minutes =
      String(
        total % 60
      ).padStart(2, "0");

    slots.push(
      `${hours}:${minutes}`
    );
  }

  return slots;
}

const allTimeSlots =
  createTimeSlots();

export default function Home() {
  const [view, setView] =
    useState<View>("home");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([
      {
        id: 1,
        sender: "ai",
        text:
          "Ciao! Benvenuto da Hair Studio Milano. Come posso aiutarti oggi?",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    service,
    setService,
  ] = useState("Taglio Uomo");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [
    bookingLoading,
    setBookingLoading,
  ] = useState(false);

  const [
    bookingMessage,
    setBookingMessage,
  ] = useState("");

  const [bookingError, setBookingError] =
    useState("");

  const [cursorX, setCursorX] =
    useState(0);

  const [cursorY, setCursorY] =
    useState(0);

  const [
    serviceCategory,
    setServiceCategory,
  ] =
    useState<ServiceCategory>(
      "TUTTI"
    );

  const [
    selectedAddOns,
    setSelectedAddOns,
  ] = useState<string[]>([]);

  const [openFaq, setOpenFaq] =
    useState<number | null>(0);

  const [
    privacyOpen,
    setPrivacyOpen,
  ] = useState(false);

  const [
    consentGiven,
    setConsentGiven,
  ] = useState(false);

  const [
    availabilityLoading,
    setAvailabilityLoading,
  ] = useState(false);

  const [
    unavailableTimes,
    setUnavailableTimes,
  ] = useState<string[]>([]);

  const messagesRef =
    useRef<HTMLDivElement>(null);

  const viewRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow =
      "hidden";

    const previousTitle =
      document.title;

    document.title =
      "Hair Studio Milano — Hair with attitude.";

    const description =
      "Hair Studio Milano in Via Torino 15. Taglio, colore, styling, trattamenti e prenotazioni online.";

    let meta =
      document.querySelector(
        'meta[name="description"]'
      ) as HTMLMetaElement | null;

    if (!meta) {
      meta =
        document.createElement(
          "meta"
        );

      meta.name =
        "description";

      document.head.appendChild(
        meta
      );
    }

    meta.content =
      description;

    const ogTitle =
      document.querySelector(
        'meta[property="og:title"]'
      ) as HTMLMetaElement | null;

    if (ogTitle) {
      ogTitle.content =
        "Hair Studio Milano — Hair with attitude.";
    } else {
      const tag =
        document.createElement(
          "meta"
        );

      tag.setAttribute(
        "property",
        "og:title"
      );

      tag.content =
        "Hair Studio Milano — Hair with attitude.";

      document.head.appendChild(
        tag
      );
    }

    const ogDescription =
      document.querySelector(
        'meta[property="og:description"]'
      ) as HTMLMetaElement | null;

    if (ogDescription) {
      ogDescription.content =
        description;
    } else {
      const tag =
        document.createElement(
          "meta"
        );

      tag.setAttribute(
        "property",
        "og:description"
      );

      tag.content =
        description;

      document.head.appendChild(
        tag
      );
    }

    return () => {
      document.body.style.overflow =
        "";

      document.title =
        previousTitle;
    };
  }, []);

  useEffect(() => {
    if (!viewRef.current) {
      return;
    }

    viewRef.current.scrollTop =
      0;
  }, [view]);

  useEffect(() => {
    const onMove = (
      event: MouseEvent
    ) => {
      setCursorX(
        event.clientX
      );

      setCursorY(
        event.clientY
      );
    };

    window.addEventListener(
      "mousemove",
      onMove,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "mousemove",
        onMove
      );
  }, []);

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTo({
      top:
        messagesRef.current
          .scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (!privacyOpen) {
      return;
    }

    const onKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape"
      ) {
        setPrivacyOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
  }, [privacyOpen]);

  const filteredServices =
    useMemo(
      () =>
        services.filter(
          (item) =>
            serviceCategory ===
              "TUTTI" ||
            item.category ===
              serviceCategory
        ),
      [serviceCategory]
    );

  const selectedService =
    services.find(
      (item) =>
        item.name === service
    ) ??
    services.find(
      (item) =>
        item.name ===
        "Taglio Uomo"
    )!;

  const selectedAddOnsTotal =
    selectedAddOns.reduce(
      (total, itemName) => {
        const item =
          addOns.find(
            (addOn) =>
              addOn.name ===
              itemName
          );

        return (
          total +
          (item?.price ?? 0)
        );
      },
      0
    );

  const bookingTotal =
    selectedService.amount +
    selectedAddOnsTotal;

  const validDate =
    Boolean(date) &&
    !isClosedDate(date) &&
    date >=
      getLocalDateItaly();

  const validTime =
    Boolean(time) &&
    isTimeInsideBusinessHours(
      time
    ) &&
    !isPastTimeToday(
      date,
      time
    );

  const bookingReady =
    Boolean(
      customerName.trim()
    ) &&
    validDate &&
    validTime &&
    consentGiven &&
    !bookingLoading;

  function navigate(
    nextView: View
  ) {
    setView(nextView);
    setMenuOpen(false);
    setBookingError("");
  }

  function chooseService(
    serviceName: string
  ) {
    setService(serviceName);
    setBookingError("");
    setBookingMessage("");
  }

  function toggleAddOn(
    addOnName: string
  ) {
    setSelectedAddOns(
      (current) =>
        current.includes(
          addOnName
        )
          ? current.filter(
              (item) =>
                item !==
                addOnName
            )
          : [
              ...current,
              addOnName,
            ]
    );

    setBookingError("");
  }

  function handleDateChange(
    value: string
  ) {
    setBookingMessage("");
    setBookingError("");
    setUnavailableTimes([]);

    if (!value) {
      setDate("");
      setTime("");
      return;
    }

    if (
      value <
      getLocalDateItaly()
    ) {
      setDate(value);
      setTime("");

      setBookingError(
        "La data selezionata è nel passato."
      );
      return;
    }

    if (isClosedDate(value)) {
      setDate(value);
      setTime("");

      setBookingError(
        "Il salone è chiuso la domenica e il lunedì. Scegli un giorno tra martedì e sabato."
      );
      return;
    }

    setDate(value);
  }

  async function loadAvailability(
    selectedDate: string
  ) {
    if (
      !selectedDate ||
      isClosedDate(selectedDate)
    ) {
      setUnavailableTimes([]);
      return;
    }

    setAvailabilityLoading(true);

    try {
      const response =
        await fetch(
          `/api/appointments?date=${encodeURIComponent(selectedDate)}&service=${encodeURIComponent(service)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      if (!response.ok) {
        setUnavailableTimes([]);
        return;
      }

      const data =
        await response.json();

      const appointments =
        Array.isArray(
          data?.appointments
        )
          ? data.appointments
          : [];

      const blocked =
        appointments
          .map(
            (item: {
              time?: string;
            }) =>
              typeof item.time ===
              "string"
                ? item.time
                : ""
          )
          .filter(Boolean);

      setUnavailableTimes(
        blocked
      );

      if (
        blocked.includes(time)
      ) {
        setTime("");
      }
    } catch {
      setUnavailableTimes([]);
    } finally {
      setAvailabilityLoading(
        false
      );
    }
  }

  useEffect(() => {
    if (
      !date ||
      isClosedDate(date)
    ) {
      return;
    }

    loadAvailability(date);
  }, [date]);

  function getSelectableTimeSlots() {
    return allTimeSlots.filter(
      (slot) => {
        const blocked =
          unavailableTimes.includes(
            slot
          );

        const past =
          isPastTimeToday(
            date,
            slot
          );

        return (
          !blocked &&
          !past
        );
      }
    );
  }

  async function sendMessage(
    messageOverride?: string
  ) {
    const messageText =
      messageOverride ?? input;

    if (
      !messageText.trim() ||
      loading
    ) {
      return;
    }

    const userMessage: Message =
      {
        id: Date.now(),
        sender: "user",
        text:
          messageText.trim(),
      };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(
      updatedMessages
    );

    setInput("");
    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              messages:
                updatedMessages.map(
                  (message) => ({
                    role:
                      message.sender ===
                      "user"
                        ? "user"
                        : "assistant",
                    content:
                      message.text,
                  })
                ),
              business_context: {
                name:
                  BUSINESS.name,
                address:
                  BUSINESS.address,
                city:
                  BUSINESS.city,
                opening_days:
                  BUSINESS.openingDays,
                opening_time:
                  BUSINESS.openingTime,
                closing_time:
                  BUSINESS.closingTime,
                services:
                  services.map(
                    (item) => ({
                      name:
                        item.name,
                      price:
                        item.price,
                      duration:
                        item.duration,
                      category:
                        item.category,
                      description:
                        item.description,
                    })
                  ),
                booking_rules: {
                  closed_days: [
                    "Sunday",
                    "Monday",
                  ],
                  booking_window:
                    "Future dates only",
                },
              },
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Errore chatbot"
        );
      }

      const aiText =
        data.message ||
        "Mi dispiace, si è verificato un errore.";

      const bookingMatch =
        aiText.match(
          /\[\[BOOKING\|([^|]+)\|([^|]+)\|(\d{4}-\d{2}-\d{2})\|(\d{2}:\d{2})\]\]/
        );

      if (bookingMatch) {
        const [
          ,
          name,
          bookedService,
          bookedDate,
          bookedTime,
        ] = bookingMatch;

        const normalizedService =
          serviceNames.includes(
            bookedService.trim()
          )
            ? bookedService.trim()
            : service;

        setCustomerName(
          name.trim()
        );

        setService(
          normalizedService
        );

        setDate(
          bookedDate.trim()
        );

        setTime(
          bookedTime.trim()
        );
      }

      const cleanAiText =
        aiText
          .replace(
            /\[\[BOOKING\|[^|]+\|[^|]+\|\d{4}-\d{2}-\d{2}\|\d{2}:\d{2}\]/,
            ""
          )
          .trim();

      setMessages(
        (current) => [
          ...current,
          {
            id:
              Date.now() + 1,
            sender: "ai",
            text:
              cleanAiText ||
              "Ho raccolto i dati della prenotazione.",
          },
        ]
      );

      if (bookingMatch) {
        setTimeout(() => {
          setView(
            "booking"
          );
        }, 450);
      }
    } catch {
      setMessages(
        (current) => [
          ...current,
          {
            id:
              Date.now() + 1,
            sender: "ai",
            text:
              "Mi dispiace, al momento non riesco a rispondere. Riprova tra poco.",
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  async function createAppointment() {
    setBookingMessage("");
    setBookingError("");

    if (!customerName.trim()) {
      setBookingError(
        "Inserisci il tuo nome."
      );
      return;
    }

    if (!date) {
      setBookingError(
        "Scegli una data."
      );
      return;
    }

    if (date <
      getLocalDateItaly()) {
      setBookingError(
        "La data selezionata è nel passato."
      );
      return;
    }

    if (isClosedDate(date)) {
      setBookingError(
        "Il salone è chiuso la domenica e il lunedì."
      );
      return;
    }

    if (!time) {
      setBookingError(
        "Scegli un orario."
      );
      return;
    }

    if (
      !isTimeInsideBusinessHours(
        time
      )
    ) {
      setBookingError(
        "Scegli un orario compreso tra le 09:00 e le 19:30."
      );
      return;
    }

    if (
      isPastTimeToday(
        date,
        time
      )
    ) {
      setBookingError(
        "L'orario selezionato è già passato."
      );
      return;
    }

    if (
      unavailableTimes.includes(
        time
      )
    ) {
      setBookingError(
        "Questo orario risulta già occupato. Scegline un altro."
      );
      return;
    }

    if (!consentGiven) {
      setBookingError(
        "Per inviare la richiesta devi accettare l'informativa sul trattamento dei dati."
      );
      return;
    }

    setBookingLoading(true);

    try {
      const response =
        await fetch(
          "/api/appointments",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              customer_name:
                customerName.trim(),
              service,
              date,
              time,
              add_ons:
                selectedAddOns,
              estimated_total:
                bookingTotal,
              requested_duration:
                selectedService.duration,
              privacy_consent:
                true,
              status:
                "requested",
            }),
          }
        );

      const data =
        await response.json();

      if (
        response.status ===
        409
      ) {
        setBookingError(
          "Questo orario non è più disponibile. Scegline un altro."
        );

        await loadAvailability(
          date
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Errore prenotazione"
        );
      }

      setBookingMessage(
        "Richiesta inviata correttamente. Ti aspettiamo in salone."
      );

      setCustomerName("");
      setService(
        "Taglio Uomo"
      );
      setDate("");
      setTime("");
      setSelectedAddOns([]);
      setConsentGiven(false);
      setUnavailableTimes([]);
    } catch {
      setBookingError(
        "Non è stato possibile inviare la richiesta. Controlla la connessione e riprova."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  const schema = {
    "@context":
      "https://schema.org",
    "@type":
      "BeautySalon",
    name:
      BUSINESS.name,
    address: {
      "@type":
        "PostalAddress",
      streetAddress:
        BUSINESS.address,
      addressLocality:
        BUSINESS.city,
      addressRegion:
        BUSINESS.region,
      addressCountry:
        "IT",
    },
    openingHoursSpecification:
      [
        {
          "@type":
            "OpeningHoursSpecification",
          dayOfWeek: [
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens:
            BUSINESS.openingTime,
          closes:
            BUSINESS.closingTime,
        },
      ],
    priceRange:
      "€€",
  };

  return (
    <main
      className="hsm-app"
      id="top"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              schema
            ),
        }}
      />

      <div
        className="hsm-cursor"
        style={{
          transform:
            `translate3d(${cursorX - 180}px, ${cursorY - 180}px, 0)`,
        }}
        aria-hidden="true"
      />

      <div
        className="hsm-noise"
        aria-hidden="true"
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="hsm-header">
        <div className="hsm-header-inner">

          <button
            type="button"
            className="hsm-brand"
            onClick={() =>
              navigate("home")
            }
            aria-label="Torna alla home"
          >
            <span className="hsm-brand-mark">
              H
            </span>

            <span className="hsm-brand-copy">
              <strong>
                HAIR STUDIO
              </strong>

              <small>
                MILANO
              </small>
            </span>
          </button>

          <nav
            className="hsm-desktop-nav"
            aria-label="Navigazione principale"
          >
            {(
              [
                ["home", "Home"],
                [
                  "services",
                  "Servizi",
                ],
                [
                  "assistant",
                  "Assistente",
                ],
              ] as const
            ).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={
                    view === key
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    navigate(
                      key
                    )
                  }
                  aria-current={
                    view === key
                      ? "page"
                      : undefined
                  }
                >
                  {label}
                </button>
              )
            )}
          </nav>

          <button
            type="button"
            className="hsm-header-book"
            onClick={() =>
              navigate(
                "booking"
              )
            }
          >
            <span>
              Prenota
            </span>

            <span className="hsm-round-arrow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;
            </span>
          </button>

          <button
            type="button"
            className={`hsm-menu ${
              menuOpen
                ? "open"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current
              )
            }
            aria-label={
              menuOpen
                ? "Chiudi menu"
                : "Apri menu"
            }
            aria-expanded={
              menuOpen
            }
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
          </button>

        </div>

        <div
          id="mobile-navigation"
          className={`hsm-mobile-menu ${
            menuOpen
              ? "open"
              : ""
          }`}
        >
          <button
            type="button"
            onClick={() =>
              navigate(
                "home"
              )
            }
          >
            <span>
              01
            </span>
            Home
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "services"
              )
            }
          >
            <span>
              02
            </span>
            Servizi
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "assistant"
              )
            }
          >
            <span>
              03
            </span>
            Assistente AI
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "booking"
              )
            }
          >
            <span>
              04
            </span>
            Prenota
          </button>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        ref={viewRef}
        className={`hsm-content hsm-view-${view}`}
      >

        {/* =====================================================
            HOME
        ====================================================== */}

        {view === "home" && (
          <section
            className="hsm-home"
            aria-labelledby="home-title"
          >

            <div className="hsm-home-grid">

              <div className="hsm-home-copy">

                <div className="hsm-eyebrow">
                  <span />
                  MILANO · VIA TORINO 15
                </div>

                <h1 id="home-title">
                  Hair
                  <br />
                  <em>
                    with
                  </em>
                  <br />
                  attitude.
                </h1>

                <p>
                  Un hair studio contemporaneo
                  nel cuore di Milano.
                  Taglio, colore, styling
                  e trattamenti costruiti
                  intorno a te.
                </p>

                <div className="hsm-home-actions">

                  <button
                    type="button"
                    className="hsm-primary"
                    onClick={() =>
                      navigate(
                        "booking"
                      )
                    }
                  >
                    <span>
                      Prenota il tuo
                      appuntamento
                    </span>

                    <span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;
                    </span>
                  </button>

                  <button
                    type="button"
                    className="hsm-secondary"
                    onClick={() =>
                      navigate(
                        "assistant"
                      )
                    }
                  >
                    Parla con AI Concierge

                    <span>
                      →
                    </span>
                  </button>

                </div>

                <div className="hsm-home-meta">

                  <div>
                    <small>
                      OPENING
                    </small>

                    <strong>
                      MAR — SAB
                    </strong>
                  </div>

                  <div>
                    <small>
                      HOURS
                    </small>

                    <strong>
                      09:00 — 19:30
                    </strong>
                  </div>

                  <div>
                    <small>
                      SERVICES
                    </small>

                    <strong>
                      {services.length}+
                    </strong>
                  </div>

                </div>

              </div>

              <div className="hsm-home-image-area">

                <div className="hsm-image-border" />

                <div
                  className="hsm-home-image"
                  role="img"
                  aria-label="Hair styling"
                />

                <div className="hsm-image-overlay" />

                <div className="hsm-image-label top">
                  <span>
                    HSM / 001
                  </span>

                  <span>
                    MILANO / ITALIA
                  </span>
                </div>

                <div className="hsm-image-label bottom">
                  <span>
                    HAIR · STYLE · IDENTITY
                  </span>

                  <span>
                    2026
                  </span>
                </div>

                <div className="hsm-floating-card">

                  <small>
                    YOUR
                  </small>

                  <strong>
                    BEST
                    <br />
                    <em>
                      HAIR.
                    </em>
                  </strong>

                  <div />

                  <span>
                    PERSONAL
                    <br />
                    STYLE
                  </span>

                </div>

                <div className="hsm-stamp">

                  <span>
                    HAIR STUDIO
                  </span>

                  <strong>
                    H
                  </strong>

                  <span>
                    MILANO
                  </span>

                  <i>
                    ✦
                  </i>

                </div>

              </div>

            </div>

            <div className="hsm-home-bottom">

              <div>

                <span>
                  01
                </span>

                <strong>
                  Non seguiamo
                  <br />
                  <em>
                    tendenze.
                  </em>
                </strong>

              </div>

              <div>

                <p>
                  Ogni appuntamento parte
                  dall&apos;ascolto: dal tuo stile,
                  dai tuoi capelli e dal risultato
                  che vuoi vedere allo specchio.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "services"
                  )
                }
              >
                Esplora i servizi

                <span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                </span>
              </button>

            </div>

            <div className="hsm-home-experience">

              <div className="hsm-home-experience-head">

                <div>

                  <span className="hsm-section-label">
                    THE HSM EXPERIENCE
                  </span>

                  <h2>
                    Un appuntamento
                    <br />
                    <em>
                      fatto bene.
                    </em>
                  </h2>

                </div>

                <p>
                  Non solo capelli.
                  Un servizio costruito per
                  farti stare bene prima,
                  durante e dopo.
                </p>

              </div>

              <div className="hsm-experience-grid">

                <div className="hsm-experience-card">
                  <span>
                    01
                  </span>

                  <strong>
                    CONSULT
                  </strong>

                  <p>
                    Partiamo da te, non da
                    una foto trovata online.
                  </p>

                  <i>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                  </i>
                </div>

                <div className="hsm-experience-card">
                  <span>
                    02
                  </span>

                  <strong>
                    CREATE
                  </strong>

                  <p>
                    Costruiamo forma,
                    colore e texture con
                    precisione.
                  </p>

                  <i>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                  </i>
                </div>

                <div className="hsm-experience-card">
                  <span>
                    03
                  </span>

                  <strong>
                    FINISH
                  </strong>

                  <p>
                    Il risultato finale
                    viene rifinito in ogni
                    dettaglio.
                  </p>

                  <i>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                  </i>
                </div>

                <div className="hsm-experience-card">
                  <span>
                    04
                  </span>

                  <strong>
                    REPEAT
                  </strong>

                  <p>
                    Ti aiutiamo a mantenere
                    il look nel tempo.
                  </p>

                  <i>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                  </i>
                </div>

              </div>

            </div>

            <div className="hsm-editorial-home">

              <div className="hsm-editorial-home-image" />

              <div className="hsm-editorial-home-overlay" />

              <div className="hsm-editorial-home-copy">

                <span>
                  HSM / EDITORIAL
                </span>

                <h3>
                  Your hair.
                  <br />
                  Your rules.
                </h3>

                <p>
                  Tagli puliti. Colori personali.
                  Styling con carattere.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "booking"
                    )
                  }
                >
                  INIZIA IL TUO PERCORSO

                  <span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                  </span>
                </button>

              </div>

            </div>

            <div className="hsm-stat-strip">

              <div>
                <strong>
                  {services.length}+
                </strong>

                <span>
                  SERVIZI
                </span>
              </div>

              <div>
                <strong>
                  5
                </strong>

                <span>
                  GIORNI DI APERTURA
                </span>
              </div>

              <div>
                <strong>
                  1:1
                </strong>

                <span>
                  APPROCCIO PERSONALE
                </span>
              </div>

              <div>
                <strong>
                  MILANO
                </strong>

                <span>
                  VIA TORINO 15
                </span>
              </div>

            </div>

            <div className="hsm-practical">

              <div>
                <span className="hsm-section-label">
                  BEFORE YOU COME
                </span>

                <h2>
                  Tutto quello
                  <br />
                  che serve
                  <br />
                  <em>
                    sapere.
                  </em>
                </h2>
              </div>

              <div className="hsm-practical-grid">

                <article>
                  <span>
                    01
                  </span>

                  <strong>
                    ORARI
                  </strong>

                  <p>
                    Martedì — Sabato
                    <br />
                    09:00 — 19:30
                  </p>
                </article>

                <article>
                  <span>
                    02
                  </span>

                  <strong>
                    LOCATION
                  </strong>

                  <p>
                    Via Torino 15
                    <br />
                    Milano
                  </p>
                </article>

                <article>
                  <span>
                    03
                  </span>

                  <strong>
                    PRENOTA
                  </strong>

                  <p>
                    Scegli servizio,
                    data e orario
                    direttamente online.
                  </p>
                </article>

                <article>
                  <span>
                    04
                  </span>

                  <strong>
                    ASK AI
                  </strong>

                  <p>
                    Per consigli, servizi,
                    prezzi e prenotazioni.
                  </p>
                </article>

              </div>

            </div>

            <div className="hsm-home-final">

              <div>

                <span className="hsm-section-label">
                  READY?
                </span>

                <h2>
                  È il momento
                  <br />
                  di cambiare
                  <br />
                  <em>
                    prospettiva.
                  </em>
                </h2>

              </div>

              <div>

                <p>
                  Raccontaci cosa hai in mente.
                  Il tuo prossimo look parte
                  da una conversazione.
                </p>

                <div className="hsm-home-final-actions">

                  <button
                    type="button"
                    className="hsm-primary"
                    onClick={() =>
                      navigate(
                        "booking"
                      )
                    }
                  >
                    <span>
                      Prenota ora
                    </span>

                    <span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                    </span>
                  </button>

                  <button
                    type="button"
                    className="hsm-secondary"
                    onClick={() =>
                      navigate(
                        "assistant"
                      )
                    }
                  >
                    Parla con il concierge
                    <span>
                      →
                    </span>
                  </button>

                </div>

              </div>

            </div>

            <footer className="hsm-footer">

              <div>
                <strong>
                  HAIR STUDIO MILANO
                </strong>

                <span>
                  Via Torino 15 · Milano
                </span>
              </div>

              <div>
                <span>
                  MARTEDÌ — SABATO
                </span>

                <span>
                  09:00 — 19:30
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPrivacyOpen(true)
                }
              >
                PRIVACY
              </button>

            </footer>

          </section>
        )}

        {/* =====================================================
            SERVICES
        ====================================================== */}

        {view === "services" && (
          <section
            className="hsm-services-view"
            aria-labelledby="services-title"
          >

            <div className="hsm-page-heading">

              <div>

                <span className="hsm-section-label">
                  01 / SERVICES
                </span>

                <h2 id="services-title">
                  Il tuo
                  <br />
                  <em>
                    signature look.
                  </em>
                </h2>

              </div>

              <p>
                Oltre {services.length}
                {" "}
                esperienze tra taglio,
                colore, styling, care
                e trasformazioni.
              </p>

            </div>

            <div
              className="hsm-category-filters"
              role="tablist"
              aria-label="Categorie servizi"
            >

              {categoryLabels.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      serviceCategory ===
                      category
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setServiceCategory(
                        category
                      )
                    }
                    aria-selected={
                      serviceCategory ===
                      category
                    }
                    role="tab"
                  >
                    {category}
                  </button>
                )
              )}

            </div>

            <div className="hsm-services-grid">

              {filteredServices.map(
                (item, index) => (
                  <button
                    key={
                      item.name
                    }
                    type="button"
                    className="hsm-service-card"
                    onClick={() => {
                      chooseService(
                        item.name
                      );

                      navigate(
                        "booking"
                      );
                    }}
                  >

                    <div className="service-top">

                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span>
                        {item.category}
                      </span>

                    </div>

                    <div className="service-main">

                      <div>

                        <div className="service-title-row">

                          <h3>
                            {item.name}
                          </h3>

                          {item.tag && (
                            <span className="service-tag">
                              {item.tag}
                            </span>
                          )}

                        </div>

                        <p>
                          {
                            item.description
                          }
                        </p>

                      </div>

                      <strong>
                        {item.price}
                      </strong>

                    </div>

                    <div className="service-bottom">

                      <span>
                        {item.duration}
                      </span>

                      <span>
                        SCEGLI
                      </span>

                      <span className="service-arrow">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                      </span>

                    </div>

                  </button>
                )
              )}

            </div>

            <div className="hsm-packages">

              <div className="hsm-subheading">

                <div>

                  <span className="hsm-section-label">
                    CURATED EXPERIENCES
                  </span>

                  <h2>
                    I nostri
                    <br />
                    <em>
                      percorsi.
                    </em>
                  </h2>

                </div>

                <p>
                  Abbiamo raccolto alcune
                  combinazioni per aiutarti
                  a orientarti più velocemente.
                </p>

              </div>

              <div className="hsm-packages-grid">

                {packages.map(
                  (item) => (
                    <article
                      key={
                        item.number
                      }
                      className="hsm-package-card"
                    >

                      <div className="hsm-package-number">
                        {item.number}
                      </div>

                      <div className="hsm-package-copy">

                        <span>
                          HSM EXPERIENCE
                        </span>

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          {
                            item.description
                          }
                        </p>

                      </div>

                      <div className="hsm-package-footer">

                        <strong>
                          SU MISURA
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              "booking"
                            )
                          }
                        >
                          INIZIA
                          <span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                          </span>
                        </button>

                      </div>

                    </article>
                  )
                )}

              </div>

            </div>

            <div className="hsm-addon-showcase">

              <div>

                <span className="hsm-section-label">
                  LITTLE EXTRAS
                </span>

                <h2>
                  I dettagli
                  <br />
                  fanno la
                  <br />
                  <em>
                    differenza.
                  </em>
                </h2>

              </div>

              <div className="hsm-addon-list">

                {addOns.map(
                  (item) => (
                    <button
                      type="button"
                      key={
                        item.name
                      }
                      className={
                        selectedAddOns.includes(
                          item.name
                        )
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        toggleAddOn(
                          item.name
                        )
                      }
                      aria-pressed={
                        selectedAddOns.includes(
                          item.name
                        )
                      }
                    >

                      <span>
                        {selectedAddOns.includes(
                          item.name
                        )
                          ? "✓"
                          : "+"}
                      </span>

                      <div>

                        <strong>
                          {item.name}
                        </strong>

                        <small>
                          {
                            item.description
                          }
                        </small>

                      </div>

                      <b>
                        +€{item.price}
                      </b>

                    </button>
                  )
                )}

              </div>

            </div>

            <div className="hsm-faq">

              <div className="hsm-subheading">

                <div>

                  <span className="hsm-section-label">
                    FAQ
                  </span>

                  <h2>
                    Prima di
                    <br />
                    <em>
                      venire.
                    </em>
                  </h2>

                </div>

                <p>
                  Tutte le risposte essenziali,
                  senza complicazioni.
                </p>

              </div>

              <div className="hsm-faq-list">

                {faqItems.map(
                  (item, index) => {
                    const isOpen =
                      openFaq ===
                      index;

                    return (
                      <div
                        key={
                          item.question
                        }
                        className={`hsm-faq-item ${
                          isOpen
                            ? "open"
                            : ""
                        }`}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            setOpenFaq(
                              isOpen
                                ? null
                                : index
                            )
                          }
                          aria-expanded={
                            isOpen
                          }
                        >
                          <span>
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <strong>
                            {
                              item.question
                            }
                          </strong>

                          <i>
                            +
                          </i>

                        </button>

                        <div className="hsm-faq-answer">
                          <p>
                            {
                              item.answer
                            }
                          </p>
                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            <div className="hsm-services-cta">

              <div>

                <span>
                  NOT SURE YET?
                </span>

                <strong>
                  Chiedi al nostro{" "}
                  <em>
                    AI Concierge.
                  </em>
                </strong>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "assistant"
                  )
                }
              >
                PARLA CON AI
                <span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                </span>
              </button>

            </div>

          </section>
        )}

        {/* =====================================================
            ASSISTANT
        ====================================================== */}

        {view === "assistant" && (
          <section
            className="hsm-assistant-view"
            aria-labelledby="assistant-title"
          >

            <div
              className="hsm-assistant-glow glow-one"
              aria-hidden="true"
            />

            <div
              className="hsm-assistant-glow glow-two"
              aria-hidden="true"
            />

            <div className="hsm-assistant-intro">

              <div className="hsm-assistant-intro-top">

                <span className="hsm-section-label">
                  AI CONCIERGE
                </span>

                <span className="hsm-assistant-status">
                  <i />
                  ONLINE
                </span>

              </div>

              <h2 id="assistant-title">
                Hai una
                <br />
                domanda?
                <br />
                <em>
                  Chiedi.
                </em>
              </h2>

              <p>
                Il tuo concierge personale
                per servizi, prezzi, orari,
                consigli e prenotazioni.
              </p>

              <div className="hsm-assistant-categories">

                <span>
                  01 · SERVIZI
                </span>

                <span>
                  02 · PREZZI
                </span>

                <span>
                  03 · ORARI
                </span>

                <span>
                  04 · PRENOTAZIONI
                </span>

              </div>

              <div className="hsm-assistant-editorial-card">

                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85"
                  alt="Hair styling"
                  loading="lazy"
                  decoding="async"
                />

                <div className="hsm-assistant-editorial-overlay" />

                <div className="hsm-assistant-editorial-content">

                  <div>

                    <small>
                      HAIR STUDIO MILANO
                    </small>

                    <strong>
                      Style is
                      <br />
                      personal.
                    </strong>

                  </div>

                  <span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;&#xFE0E;
                  </span>

                </div>

              </div>

              <div className="hsm-assistant-location">

                <span>
                  VIA TORINO 15
                </span>

                <span>
                  MILANO / ITALIA
                </span>

              </div>

            </div>

            <div className="hsm-chat-shell">

              <div className="hsm-chat-header">

                <div className="hsm-chat-profile">

                  <div
                    className="hsm-chat-avatar"
                    aria-hidden="true"
                  >
                    H
                    <span />
                  </div>

                  <div>

                    <strong>
                      Hair Studio AI
                    </strong>

                    <small>
                      <i />
                      Assistente virtuale
                    </small>

                  </div>

                </div>

                <div className="hsm-chat-header-right">

                  <span>
                    CONCIERGE
                  </span>

                  <div className="hsm-chat-live">
                    LIVE
                  </div>

                </div>

              </div>

              <div
                ref={messagesRef}
                className="hsm-chat-messages"
                aria-live="polite"
              >

                <div className="hsm-chat-messages-inner">

                  <div className="hsm-chat-welcome">

                    <div className="hsm-chat-welcome-number">
                      01
                    </div>

                    <div>

                      <span>
                        WELCOME TO HSM
                      </span>

                      <strong>
                        Come posso
                        <br />
                        aiutarti?
                      </strong>

                      <p>
                        Posso consigliarti un
                        servizio, dirti i prezzi,
                        verificare gli orari oppure
                        aiutarti con una prenotazione.
                      </p>

                    </div>

                  </div>

                  <div className="hsm-ai-topic-grid">

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        sendMessage(
                          "Quale servizio mi consigli per cambiare look?"
                        )
                      }
                    >
                      <span>
                        STYLE
                      </span>

                      Cambio look
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        sendMessage(
                          "Quanto costa un balayage?"
                        )
                      }
                    >
                      <span>
                        COLOR
                      </span>

                      Balayage
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        sendMessage(
                          "Quale trattamento mi consigli per capelli secchi?"
                        )
                      }
                    >
                      <span>
                        CARE
                      </span>

                      Capelli secchi
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        sendMessage(
                          "Vorrei prenotare un appuntamento"
                        )
                      }
                    >
                      <span>
                        BOOK
                      </span>

                      Prenotazione
                    </button>

                  </div>

                  {messages.map(
                    (message) => (
                      <div
                        key={
                          message.id
                        }
                        className={`hsm-message ${
                          message.sender ===
                          "user"
                            ? "user"
                            : "ai"
                        }`}
                      >

                        {message.sender ===
                          "ai" && (
                          <div className="hsm-message-label">
                            HSM AI
                          </div>
                        )}

                        <div>
                          {message.text}
                        </div>

                      </div>
                    )
                  )}

                  {loading && (
                    <div className="hsm-message ai typing">

                      <div className="hsm-message-label">
                        HSM AI
                      </div>

                      <div className="hsm-typing-dots">
                        <span />
                        <span />
                        <span />
                      </div>

                    </div>
                  )}

                </div>

              </div>

              <div className="hsm-chat-bottom">

                <div className="hsm-quick-title">

                  <span>
                    ASK SOMETHING
                  </span>

                  <div />

                </div>

                <div className="hsm-quick-actions">

                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={() =>
                      sendMessage(
                        "Quali sono tutti i servizi disponibili?"
                      )
                    }
                  >
                    <span>
                      01
                    </span>
                    Servizi
                  </button>

                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={() =>
                      sendMessage(
                        "Quanto costa un balayage?"
                      )
                    }
                  >
                    <span>
                      02
                    </span>
                    Prezzo balayage
                  </button>

                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={() =>
                      sendMessage(
                        "Quali sono i vostri orari?"
                      )
                    }
                  >
                    <span>
                      03
                    </span>
                    Orari
                  </button>

                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={() =>
                      sendMessage(
                        "Vorrei prenotare un appuntamento"
                      )
                    }
                  >
                    <span>
                      04
                    </span>
                    Prenota
                  </button>

                </div>

                <form
                  className="hsm-chat-input"
                  onSubmit={(
                    event
                  ) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                >

                  <div className="hsm-input-prefix">
                    →
                  </div>

                  <input
                  className="text-base"
                    value={
                      input
                    }
                    onChange={(
                      event
                    ) =>
                      setInput(
                        event.target
                          .value
                      )
                    }
                    placeholder="Scrivi la tua domanda..."
                    disabled={
                      loading
                    }
                    aria-label="Scrivi una domanda"
                    maxLength={1000}
                  />

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !input.trim()
                    }
                    aria-label="Invia messaggio"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;
                  </button>

                </form>

                <div className="hsm-chat-footer-note">
                  AI CONCIERGE · HAIR STUDIO MILANO
                </div>

              </div>

            </div>

          </section>
        )}

        {/* =====================================================
            BOOKING
        ====================================================== */}

        {view === "booking" && (
          <section
            className="hsm-booking-view"
            aria-labelledby="booking-title"
          >

            <div
              className="hsm-booking-glow booking-glow-one"
              aria-hidden="true"
            />

            <div
              className="hsm-booking-glow booking-glow-two"
              aria-hidden="true"
            />

            <div className="hsm-booking-intro">

              <div className="hsm-booking-topline">

                <span className="hsm-section-label">
                  BOOK YOUR VISIT
                </span>

                <span>
                  HAIR STUDIO MILANO
                </span>

              </div>

              <h2 id="booking-title">
                Il prossimo
                <br />
                <em>
                  capitolo è tuo.
                </em>
              </h2>

              <p>
                Scegli il servizio,
                indicaci quando vuoi venire,
                aggiungi gli extra che preferisci
                e lasciaci i tuoi dati.
              </p>

              <div className="hsm-booking-location">

                <div>

                  <small>
                    FIND US
                  </small>

                  <strong>
                    Via Torino 15
                    <br />
                    Milano
                  </strong>

                </div>

                <div>

                  <small>
                    OPENING
                  </small>

                  <span>
                    Martedì — Sabato
                    <br />
                    09:00 — 19:30
                  </span>

                </div>

              </div>

              <div className="hsm-booking-benefits">

                <div>
                  <span>
                    ✓
                  </span>
                  Consulenza personalizzata
                </div>

                <div>
                  <span>
                    ✓
                  </span>
                  Richiesta online
                </div>

                <div>
                  <span>
                    ✓
                  </span>
                  Controllo data e orario
                </div>

              </div>

            </div>

            <div className="hsm-booking-card">

              <div className="hsm-booking-card-header">

                <div>

                  <span>
                    01 / CHOOSE YOUR SERVICE
                  </span>

                  <strong>
                    Cosa vuoi fare?
                  </strong>

                </div>

                <div className="hsm-booking-step">
                  01
                  <span />
                  04
                </div>

              </div>

              <div className="hsm-booking-services">

                {services.slice(0, 12).map(
                  (item, index) => {
                    const selected =
                      service ===
                      item.name;

                    return (
                      <button
                        key={
                          item.name
                        }
                        type="button"
                        className={
                          selected
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          chooseService(
                            item.name
                          )
                        }
                        aria-pressed={
                          selected
                        }
                      >

                        <div>

                          <span>
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <strong>
                            {item.name}
                          </strong>

                        </div>

                        <span className="booking-service-price">
                          {item.price}
                        </span>

                        <span className="booking-service-check">
                          {selected
                            ? "✓"
                            : "<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;"}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

              <button
                type="button"
                className="hsm-booking-see-more"
                onClick={() =>
                  navigate(
                    "services"
                  )
                }
              >
                VEDI TUTTI I SERVIZI
                <span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;
                </span>
              </button>

              {/* DATE */}

              <div className="hsm-booking-input-section">

                <div className="hsm-booking-card-header compact">

                  <div>

                    <span>
                      02 / WHEN
                    </span>

                    <strong>
                      Quando vuoi venire?
                    </strong>

                  </div>

                  <div className="hsm-booking-step">
                    02
                    <span />
                    04
                  </div>

                </div>

                <div className="hsm-booking-datetime">

                  <label>

                    <span>
                      DATA
                    </span>

                    <input
                      type="date"
                      value={
                        date
                      }
                      min={
                        getLocalDateItaly()
                      }
                      onChange={(
                        event
                      ) =>
                        handleDateChange(
                          event.target
                            .value
                        )
                      }
                      aria-invalid={
                        Boolean(
                          bookingError &&
                          date &&
                          (!validDate)
                        )
                      }
                    />

                  </label>

                  <label>

                    <span>
                      ORARIO
                    </span>

                    <select
                      value={
                        time
                      }
                      onChange={(
                        event
                      ) =>
                        setTime(
                          event.target
                            .value
                        )
                      }
                      disabled={
                        !validDate ||
                        availabilityLoading
                      }
                      aria-label="Scegli orario"
                    >

                      <option value="">
                        {availabilityLoading
                          ? "Controllo..."
                          : validDate
                            ? "Scegli orario"
                            : "Prima scegli la data"}
                      </option>

                      {getSelectableTimeSlots().map(
                        (slot) => (
                          <option
                            key={
                              slot
                            }
                            value={
                              slot
                            }
                          >
                            {slot}
                          </option>
                        )
                      )}

                    </select>

                  </label>

                </div>

                <div className="hsm-booking-hint">

                  <span>
                    ✓
                  </span>

                  <p>
                    Aperto martedì–sabato,
                    09:00–19:30.
                    {unavailableTimes.length >
                      0
                      ? " Gli orari già occupati vengono esclusi."
                      : ""}
                  </p>

                </div>

              </div>

              {/* PERSONAL DATA */}

              <div className="hsm-booking-input-section">

                <div className="hsm-booking-card-header compact">

                  <div>

                    <span>
                      03 / YOUR DETAILS
                    </span>

                    <strong>
                      Come possiamo chiamarti?
                    </strong>

                  </div>

                  <div className="hsm-booking-step">
                    03
                    <span />
                    04
                  </div>

                </div>

                <label className="hsm-booking-name">

                  <span>
                    NOME
                  </span>

                  <input
                    value={
                      customerName
                    }
                    onChange={(
                      event
                    ) =>
                      setCustomerName(
                        event.target
                          .value
                      )
                    }
                    placeholder="Il tuo nome"
                    autoComplete="name"
                    maxLength={80}
                    aria-label="Il tuo nome"
                  />

                </label>

              </div>

              {/* EXTRAS */}

              <div className="hsm-booking-input-section">

                <div className="hsm-booking-card-header compact">

                  <div>

                    <span>
                      04 / LITTLE EXTRAS
                    </span>

                    <strong>
                      Vuoi aggiungere qualcosa?
                    </strong>

                  </div>

                  <div className="hsm-booking-step">
                    04
                    <span />
                    04
                  </div>

                </div>

                <div className="hsm-booking-addons">

                  {addOns.map(
                    (item) => {
                      const selected =
                        selectedAddOns.includes(
                          item.name
                        );

                      return (
                        <button
                          type="button"
                          key={
                            item.name
                          }
                          className={
                            selected
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            toggleAddOn(
                              item.name
                            )
                          }
                          aria-pressed={
                            selected
                          }
                        >

                          <span>
                            {selected
                              ? "✓"
                              : "+"}
                          </span>

                          <div>

                            <strong>
                              {
                                item.name
                              }
                            </strong>

                            <small>
                              {
                                item.description
                              }
                            </small>

                          </div>

                          <b>
                            +€{item.price}
                          </b>

                        </button>
                      );
                    }
                  )}

                </div>

              </div>

              {/* PRIVACY */}

              <div className="hsm-consent">

                <button
                  type="button"
                  className={`hsm-consent-check ${
                    consentGiven
                      ? "checked"
                      : ""
                  }`}
                  onClick={() =>
                    setConsentGiven(
                      (current) =>
                        !current
                    )
                  }
                  aria-pressed={
                    consentGiven
                  }
                  aria-label="Accetta informativa privacy"
                >
                  {consentGiven
                    ? "✓"
                    : ""}
                </button>

                <p>
                  Dichiaro di aver letto
                  l&apos;
                  <button
                    type="button"
                    onClick={() =>
                      setPrivacyOpen(
                        true
                      )
                    }
                  >
                    informativa privacy
                  </button>
                  {" "}
                  e acconsento al trattamento
                  dei dati necessari per
                  gestire la mia richiesta.
                </p>

              </div>

              {/* SUMMARY */}

              <div className="hsm-booking-summary">

                <div>

                  <span>
                    YOUR APPOINTMENT
                  </span>

                  <strong>
                    {service}
                  </strong>

                  {selectedAddOns.length >
                    0 && (
                    <small>
                      +
                      {" "}
                      {
                        selectedAddOns.length
                      }
                      {" "}
                      extra
                      {
                        selectedAddOns.length >
                        1
                          ? "s"
                          : ""
                      }
                    </small>
                  )}

                </div>

                <div className="hsm-booking-summary-meta">

                  <span>
                    {date ||
                      "Data da scegliere"}
                  </span>

                  <span>
                    {time ||
                      "Ora da scegliere"}
                  </span>

                </div>

                <strong className="hsm-booking-summary-price">
                  €{bookingTotal}
                </strong>

              </div>

              {(bookingError ||
                bookingMessage) && (
                <div
                  className={`hsm-booking-message ${
                    bookingError
                      ? "error"
                      : ""
                  }`}
                  role="alert"
                  aria-live="assertive"
                >

                  <span>
                    {bookingError
                      ? "!"
                      : "✓"}
                  </span>

                  {bookingError ||
                    bookingMessage}

                </div>
              )}

              <button
                type="button"
                className="hsm-submit"
                onClick={
                  createAppointment
                }
                disabled={
                  !bookingReady
                }
              >

                <span>
                  {bookingLoading
                    ? "Invio in corso..."
                    : "Richiedi appuntamento"}
                </span>

                <span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17"/></svg>&#xFE0E;
                </span>

              </button>

              {!bookingReady &&
                !bookingLoading && (
                <p className="hsm-booking-required">
                  Completa servizio,
                  data, orario, nome
                  e consenso privacy
                  per inviare la richiesta.
                </p>
              )}

              <div className="hsm-booking-secure">

                <span>
                  HSM
                </span>

                <p>
                  Richiesta inviata tramite
                  il sistema del salone.
                </p>

              </div>

            </div>

          </section>
        )}

      </div>

      {/* =====================================================
          PRIVACY MODAL
      ====================================================== */}

      {privacyOpen && (
        <div
          className="hsm-modal-backdrop"
          onClick={() =>
            setPrivacyOpen(false)
          }
          role="presentation"
        >
          <div
            className="hsm-privacy-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="hsm-modal-close"
              onClick={() =>
                setPrivacyOpen(false)
              }
              aria-label="Chiudi informativa privacy"
            >
              ×
            </button>

            <span className="hsm-section-label">
              PRIVACY
            </span>

            <h2 id="privacy-title">
              Informativa
              <br />
              <em>
                essenziale.
              </em>
            </h2>

            <div className="hsm-privacy-copy">

              <p>
                I dati inseriti nel modulo
                di prenotazione vengono
                utilizzati per gestire la
                richiesta di appuntamento.
              </p>

              <p>
                I dati trattati possono
                includere il nome e le
                informazioni necessarie
                alla gestione della richiesta.
              </p>

              <p>
                La versione definitiva
                dell&apos;informativa dovrà
                indicare in modo completo
                titolare del trattamento,
                finalità, base giuridica,
                tempi di conservazione,
                diritti dell&apos;interessato
                e modalità di contatto.
              </p>

            </div>

            <button
              type="button"
              className="hsm-primary hsm-modal-action"
              onClick={() =>
                setPrivacyOpen(
                  false
                )
              }
            >
              <span>
                Ho letto
              </span>

              <span>
                ✓
              </span>
            </button>

          </div>
        </div>
      )}

      {/* =====================================================
          GLOBAL STYLE
      ====================================================== */}

      <style jsx global>{`

        :root {
          --paper: #f5f1ea;
          --paper-light: #faf8f4;
          --cream: #e7ddd0;
          --ink: #171512;
          --brown: #765e4c;
          --brown-light: #b69b84;
          --muted: #857b70;
          --line: rgba(23,21,18,.10);
          --green: #68745e;
          --error: #9a514b;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          width: 100%;
          height: 100%;
        }

        body {
          background: var(--paper);
          color: var(--ink);
          overflow: hidden;
        }

        body,
        button,
        input,
        select {
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        button,
        input,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline:
            2px solid
            var(--brown);
          outline-offset: 3px;
        }

        ::selection {
          background:
            var(--ink);
          color: white;
        }

        /* =====================================================
           APP
        ====================================================== */

        .hsm-app {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(255,255,255,.92),
              transparent 32%
            ),
            var(--paper);
        }

        .hsm-noise {
          position: fixed;
          inset: 0;
          z-index: 200;
          pointer-events: none;
          opacity: .017;
          background-image:
            radial-gradient(
              rgba(0,0,0,.8) .4px,
              transparent .4px
            );
          background-size:
            4px 4px;
        }

        .hsm-cursor {
          position: fixed;
          left: 0;
          top: 0;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(
              circle,
              rgba(118,94,76,.08),
              rgba(118,94,76,.025) 40%,
              transparent 70%
            );
          filter: blur(2px);
          transition:
            transform .15s
            cubic-bezier(.22,1,.36,1);
        }

        /* =====================================================
           HEADER
        ====================================================== */

        .hsm-header {
          position: absolute;
          inset:
            0
            0
            auto
            0;
          z-index: 150;
          padding:
            13px
            18px;
        }

        .hsm-header-inner {
          width: min(
            1420px,
            calc(100% - 4px)
          );
          height: 66px;
          margin: 0 auto;
          padding:
            0
            10px
            0
            16px;
          border:
            1px solid
            rgba(23,21,18,.09);
          background:
            rgba(247,244,239,.76);
          backdrop-filter:
            blur(24px);
          -webkit-backdrop-filter:
            blur(24px);
          display: flex;
          align-items:
            center;
          box-shadow:
            0 16px 42px
            rgba(23,21,18,.045);
        }

        .hsm-brand {
          border: 0;
          background:
            transparent;
          padding: 0;
          display: flex;
          align-items:
            center;
          gap: 10px;
          color:
            var(--ink);
        }

        .hsm-brand-mark {
          width: 39px;
          height: 39px;
          border-radius: 50%;
          display: flex;
          align-items:
            center;
          justify-content:
            center;
          background:
            var(--ink);
          color: white;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-style:
            italic;
          font-size: 19px;
          transition:
            transform .35s ease;
        }

        .hsm-brand:hover
        .hsm-brand-mark {
          transform:
            rotate(-9deg)
            scale(1.06);
        }

        .hsm-brand-copy {
          display: flex;
          flex-direction:
            column;
          align-items:
            flex-start;
          gap: 2px;
        }

        .hsm-brand-copy strong {
          font-size: 9px;
          letter-spacing: .2em;
        }

        .hsm-brand-copy small {
          color:
            var(--muted);
          font-size: 7px;
          letter-spacing: .35em;
        }

        .hsm-desktop-nav {
          margin-left:
            auto;
          margin-right: 28px;
          display: flex;
          align-items:
            center;
          gap: 28px;
        }

        .hsm-desktop-nav button {
          position: relative;
          border: 0;
          background:
            transparent;
          padding:
            8px
            0;
          color:
            rgba(23,21,18,.47);
          font-size: 11px;
        }

        .hsm-desktop-nav button::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 1px;
          height: 1px;
          background:
            var(--ink);
          transform:
            scaleX(0);
          transition:
            transform .3s ease;
        }

        .hsm-desktop-nav button:hover,
        .hsm-desktop-nav button.active {
          color:
            var(--ink);
        }

        .hsm-desktop-nav
        button.active::after {
          transform:
            scaleX(1);
        }

        .hsm-header-book {
          height: 46px;
          border: 0;
          border-radius: 999px;
          padding:
            0
            8px
            0
            18px;
          background:
            var(--ink);
          color: white;
          display: flex;
          align-items:
            center;
          gap: 12px;
          font-size: 11px;
          font-weight: 600;
          transition:
            transform .3s ease,
            box-shadow .3s ease;
        }

        .hsm-header-book:hover {
          transform:
            translateY(-2px);
          box-shadow:
            0 15px 30px
            rgba(23,21,18,.15);
        }

        .hsm-round-arrow {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background:
            rgba(255,255,255,.12);
          display: flex;
          align-items:
            center;
          justify-content:
            center;
          transition:
            transform .3s ease;
        }

        .hsm-header-book:hover
        .hsm-round-arrow {
          transform:
            rotate(45deg);
        }

        .hsm-menu,
        .hsm-mobile-menu {
          display: none;
        }

        /* =====================================================
           CONTENT
        ====================================================== */

        .hsm-content {
          position: absolute;
          inset: 0;
          z-index: 10;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width:
            thin;
          scrollbar-color:
            rgba(23,21,18,.20)
            transparent;
        }

        .hsm-content::-webkit-scrollbar {
          width: 7px;
        }

        .hsm-content::-webkit-scrollbar-thumb {
          background:
            rgba(23,21,18,.17);
        }

        .hsm-content::-webkit-scrollbar-track {
          background:
            transparent;
        }

        .hsm-section-label {
          display: inline-block;
          color:
            var(--brown);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .28em;
        }

        /* =====================================================
           HOME
        ====================================================== */

        .hsm-home {
          min-height: 100%;
          padding:
            96px
            clamp(20px,4vw,55px)
            70px;
        }

        .hsm-home-grid {
          min-height:
            calc(100dvh - 150px);
          width: min(
            1400px,
            100%
          );
          margin: 0 auto;
          display: grid;
          grid-template-columns:
            .86fr
            1.14fr;
          gap:
            clamp(
              35px,
              6vw,
              85px
            );
          align-items:
            center;
        }

        .hsm-home-copy {
          position: relative;
          z-index: 4;
          padding-left:
            clamp(
              0px,
              2vw,
              30px
            );
          animation:
            hsmFadeUp .8s
            cubic-bezier(.22,1,.36,1)
            both;
        }

        .hsm-eyebrow {
          display: flex;
          align-items:
            center;
          gap: 8px;
          color:
            var(--brown);
          font-size: 8px;
          font-weight: 700;
          letter-spacing:
            .26em;
        }

        .hsm-eyebrow > span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background:
            var(--brown);
          box-shadow:
            0 0 0 5px
            rgba(118,94,76,.08);
        }

        .hsm-home h1 {
          margin:
            23px
            0
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              65px,
              7.2vw,
              117px
            );
          line-height: .82;
          font-weight: 400;
          letter-spacing:
            -.07em;
        }

        .hsm-home h1 em {
          color:
            var(--brown);
          font-style:
            italic;
        }

        .hsm-home-copy > p {
          max-width:
            480px;
          margin:
            28px
            0
            0;
          color:
            rgba(23,21,18,.56);
          font-size: 13px;
          line-height:
            1.85;
        }

        .hsm-home-actions {
          margin-top:
            32px;
          display:
            flex;
          align-items:
            center;
          gap:
            22px;
          flex-wrap:
            wrap;
        }

        .hsm-primary {
          min-height:
            53px;
          padding:
            0
            7px
            0
            20px;
          border: 0;
          border-radius:
            999px;
          background:
            var(--ink);
          color:
            white;
          display:
            flex;
          align-items:
            center;
          justify-content:
            space-between;
          gap:
            24px;
          font-size: 10px;
          font-weight: 600;
          transition:
            transform .3s ease,
            box-shadow .3s ease;
        }

        .hsm-primary > span:last-child {
          width:
            39px;
          height:
            39px;
          border-radius:
            50%;
          background:
            rgba(255,255,255,.11);
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          font-size:
            15px;
          transition:
            transform .3s ease;
        }

        .hsm-primary:hover {
          transform:
            translateY(-3px);
          box-shadow:
            0 17px 35px
            rgba(23,21,18,.15);
        }

        .hsm-primary:hover
        > span:last-child {
          transform:
            rotate(45deg);
        }

        .hsm-secondary {
          padding:
            0
            0
            6px;
          border: 0;
          border-bottom:
            1px solid
            rgba(23,21,18,.22);
          background:
            transparent;
          color:
            rgba(23,21,18,.62);
          display:
            inline-flex;
          align-items:
            center;
          gap:
            10px;
          font-size:
            10px;
        }

        .hsm-secondary span {
          transition:
            transform .25s ease;
        }

        .hsm-secondary:hover span {
          transform:
            translateX(4px);
        }

        .hsm-home-meta {
          margin-top:
            45px;
          display:
            flex;
          gap:
            32px;
          flex-wrap:
            wrap;
        }

        .hsm-home-meta div {
          display:
            flex;
          flex-direction:
            column;
          gap:
            5px;
        }

        .hsm-home-meta small {
          color:
            var(--muted);
          font-size:
            7px;
          letter-spacing:
            .18em;
        }

        .hsm-home-meta strong {
          font-size:
            9px;
          letter-spacing:
            .04em;
        }

        .hsm-home-image-area {
          position:
            relative;
          height:
            min(
              74vh,
              690px
            );
          min-height:
            510px;
          isolation:
            isolate;
          animation:
            hsmFadeUp .95s .12s
            cubic-bezier(.22,1,.36,1)
            both;
        }

        .hsm-image-border {
          position:
            absolute;
          inset:
            -11px
            0
            11px
            28px;
          border:
            1px solid
            rgba(23,21,18,.10);
        }

        .hsm-home-image {
          position:
            absolute;
          inset:
            0
            16px
            0
            42px;
          background:
            url("https://images.unsplash.com/photo-1781450090585-1a511b7066d9?auto=format&fit=crop&w=1800&q=90")
            center /
            cover;
          box-shadow:
            0 35px 85px
            rgba(23,21,18,.14);
          transition:
            transform .9s
            cubic-bezier(.22,1,.36,1),
            filter .5s ease;
        }

        .hsm-home-image-area:hover
        .hsm-home-image {
          transform:
            scale(1.018);
          filter:
            saturate(1.05)
            contrast(1.01);
        }

        .hsm-image-overlay {
          position:
            absolute;
          inset:
            0
            16px
            0
            42px;
          background:
            linear-gradient(
              180deg,
              rgba(0,0,0,.03),
              transparent 50%,
              rgba(0,0,0,.28)
            );
        }

        .hsm-image-label {
          position:
            absolute;
          left:
            61px;
          right:
            34px;
          z-index:
            4;
          display:
            flex;
          justify-content:
            space-between;
          color:
            rgba(255,255,255,.76);
          font-size:
            7px;
          letter-spacing:
            .21em;
        }

        .hsm-image-label.top {
          top:
            21px;
        }

        .hsm-image-label.bottom {
          bottom:
            21px;
        }

        .hsm-floating-card {
          position:
            absolute;
          z-index:
            8;
          left:
            -3px;
          top:
            76px;
          width:
            176px;
          padding:
            21px;
          background:
            var(--cream);
          box-shadow:
            0 20px 45px
            rgba(23,21,18,.14);
          transition:
            transform .5s
            cubic-bezier(.22,1,.36,1);
        }

        .hsm-home-image-area:hover
        .hsm-floating-card {
          transform:
            translateY(-6px);
        }

        .hsm-floating-card small {
          display:
            block;
          margin-bottom:
            12px;
          color:
            var(--brown);
          font-size:
            7px;
          font-weight:
            700;
          letter-spacing:
            .21em;
        }

        .hsm-floating-card strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            27px;
          line-height:
            .9;
          font-weight:
            400;
        }

        .hsm-floating-card em {
          color:
            var(--brown);
          font-style:
            italic;
        }

        .hsm-floating-card div {
          width:
            40px;
          height:
            1px;
          margin-top:
            16px;
          background:
            rgba(23,21,18,.26);
        }

        .hsm-floating-card > span {
          display:
            block;
          margin-top:
            12px;
          color:
            rgba(23,21,18,.34);
          font-size:
            7px;
          line-height:
            1.5;
          letter-spacing:
            .18em;
        }

        .hsm-stamp {
          position:
            absolute;
          right:
            -2px;
          bottom:
            58px;
          z-index:
            8;
          width:
            108px;
          height:
            108px;
          border-radius:
            50%;
          border:
            1px solid
            rgba(23,21,18,.22);
          background:
            rgba(247,244,239,.86);
          backdrop-filter:
            blur(12px);
          display:
            flex;
          flex-direction:
            column;
          align-items:
            center;
          justify-content:
            center;
          gap:
            4px;
          box-shadow:
            0 18px 35px
            rgba(23,21,18,.10);
          transition:
            transform .5s ease;
        }

        .hsm-home-image-area:hover
        .hsm-stamp {
          transform:
            rotate(7deg);
        }

        .hsm-stamp span {
          font-size:
            6px;
          letter-spacing:
            .20em;
        }

        .hsm-stamp strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            28px;
          font-style:
            italic;
          font-weight:
            400;
        }

        .hsm-stamp i {
          color:
            var(--brown);
          font-size:
            7px;
          font-style:
            normal;
        }

        .hsm-home-bottom {
          width:
            min(
              1400px,
              100%
            );
          margin:
            30px
            auto
            0;
          padding-top:
            25px;
          border-top:
            1px solid
            var(--line);
          display:
            grid;
          grid-template-columns:
            .25fr
            1fr
            auto;
          gap:
            35px;
          align-items:
            end;
        }

        .hsm-home-bottom > div:first-child {
          display:
            flex;
          gap:
            16px;
        }

        .hsm-home-bottom
        > div:first-child
        > span {
          color:
            var(--muted);
          font-size:
            8px;
        }

        .hsm-home-bottom
        > div:first-child
        > strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            25px;
          font-weight:
            400;
          line-height:
            1;
        }

        .hsm-home-bottom em {
          color:
            var(--brown);
          font-weight:
            400;
        }

        .hsm-home-bottom p {
          max-width:
            360px;
          margin:
            0;
          color:
            rgba(23,21,18,.47);
          font-size:
            11px;
          line-height:
            1.8;
        }

        .hsm-home-bottom button {
          border:
            0;
          border-bottom:
            1px solid
            rgba(23,21,18,.25);
          padding:
            0
            0
            7px;
          background:
            transparent;
          display:
            flex;
          align-items:
            center;
          gap:
            11px;
          font-size:
            9px;
          color:
            var(--ink);
        }

        .hsm-home-bottom button span {
          transition:
            transform .25s ease;
        }

        .hsm-home-bottom button:hover span {
          transform:
            translateX(4px);
        }

        /* =====================================================
           EXPERIENCE
        ====================================================== */

        .hsm-home-experience,
        .hsm-practical {
          width:
            min(
              1400px,
              100%
            );
          margin:
            120px
            auto
            0;
        }

        .hsm-home-experience-head,
        .hsm-practical,
        .hsm-subheading {
          display:
            grid;
          grid-template-columns:
            1fr
            .42fr;
          gap:
            50px;
          align-items:
            end;
        }

        .hsm-home-experience-head h2,
        .hsm-practical h2,
        .hsm-subheading h2 {
          margin:
            17px
            0
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              54px,
              5.7vw,
              88px
            );
          font-weight:
            400;
          line-height:
            .88;
          letter-spacing:
            -.06em;
        }

        .hsm-home-experience-head h2 em,
        .hsm-practical h2 em,
        .hsm-subheading h2 em {
          color:
            var(--brown);
          font-style:
            italic;
        }

        .hsm-home-experience-head p,
        .hsm-practical > div:last-child,
        .hsm-subheading > p {
          margin:
            0
            0
            4px;
          color:
            rgba(23,21,18,.48);
          font-size:
            11px;
          line-height:
            1.85;
        }

        .hsm-experience-grid {
          margin-top:
            50px;
          display:
            grid;
          grid-template-columns:
            repeat(4,1fr);
          border-top:
            1px solid
            var(--line);
          border-left:
            1px solid
            var(--line);
        }

        .hsm-experience-card {
          min-height:
            260px;
          padding:
            22px;
          border-right:
            1px solid
            var(--line);
          border-bottom:
            1px solid
            var(--line);
          position:
            relative;
          display:
            flex;
          flex-direction:
            column;
          justify-content:
            space-between;
          overflow:
            hidden;
          transition:
            background .4s ease,
            transform .4s ease;
        }

        .hsm-experience-card:hover {
          transform:
            translateY(-4px);
          background:
            rgba(255,255,255,.46);
        }

        .hsm-experience-card > span {
          color:
            var(--muted);
          font-size:
            8px;
        }

        .hsm-experience-card strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            26px;
          font-weight:
            400;
        }

        .hsm-experience-card p {
          max-width:
            190px;
          margin:
            0;
          color:
            rgba(23,21,18,.45);
          font-size:
            10px;
          line-height:
            1.7;
        }

        .hsm-experience-card i {
          position:
            absolute;
          right:
            20px;
          top:
            20px;
          width:
            35px;
          height:
            35px;
          border:
            1px solid
            rgba(23,21,18,.11);
          border-radius:
            50%;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          font-style:
            normal;
          transition:
            transform .35s ease;
        }

        .hsm-experience-card:hover i {
          transform:
            rotate(45deg);
        }

        /* =====================================================
           EDITORIAL
        ====================================================== */

        .hsm-editorial-home {
          position:
            relative;
          width:
            min(
              1400px,
              100%
            );
          height:
            610px;
          margin:
            120px
            auto
            0;
          overflow:
            hidden;
        }

        .hsm-editorial-home-image {
          position:
            absolute;
          inset:
            0;
          background:
            url("https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1800&q=90")
            center /
            cover;
          transition:
            transform 1s
            cubic-bezier(.22,1,.36,1);
        }

        .hsm-editorial-home:hover
        .hsm-editorial-home-image {
          transform:
            scale(1.03);
        }

        .hsm-editorial-home-overlay {
          position:
            absolute;
          inset:
            0;
          background:
            linear-gradient(
              90deg,
              rgba(0,0,0,.66),
              rgba(0,0,0,.08)
            );
        }

        .hsm-editorial-home-copy {
          position:
            absolute;
          left:
            7%;
          bottom:
            8%;
          max-width:
            500px;
          color:
            white;
        }

        .hsm-editorial-home-copy > span {
          font-size:
            7px;
          letter-spacing:
            .2em;
          color:
            rgba(255,255,255,.58);
        }

        .hsm-editorial-home-copy h3 {
          margin:
            18px
            0
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              58px,
              7vw,
              100px
            );
          line-height:
            .84;
          font-weight:
            400;
          letter-spacing:
            -.07em;
        }

        .hsm-editorial-home-copy p {
          max-width:
            360px;
          margin:
            22px
            0
            0;
          color:
            rgba(255,255,255,.60);
          font-size:
            11px;
          line-height:
            1.7;
        }

        .hsm-editorial-home-copy button {
          margin-top:
            28px;
          border:
            0;
          border-bottom:
            1px solid
            rgba(255,255,255,.45);
          padding:
            0
            0
            7px;
          background:
            transparent;
          color:
            white;
          display:
            flex;
          gap:
            12px;
          align-items:
            center;
          font-size:
            8px;
          letter-spacing:
            .13em;
        }

        /* =====================================================
           STATS
        ====================================================== */

        .hsm-stat-strip {
          width:
            min(
              1400px,
              100%
            );
          margin:
            35px
            auto
            0;
          border-top:
            1px solid
            var(--line);
          border-bottom:
            1px solid
            var(--line);
          display:
            grid;
          grid-template-columns:
            repeat(4,1fr);
        }

        .hsm-stat-strip div {
          padding:
            28px
            15px;
          border-right:
            1px solid
            var(--line);
          display:
            flex;
          flex-direction:
            column;
          gap:
            7px;
        }

        .hsm-stat-strip div:last-child {
          border-right:
            0;
        }

        .hsm-stat-strip strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            34px;
          font-weight:
            400;
        }

        .hsm-stat-strip span {
          color:
            var(--muted);
          font-size:
            7px;
          letter-spacing:
            .14em;
        }

        /* =====================================================
           PRACTICAL
        ====================================================== */

        .hsm-practical {
          align-items:
            start;
        }

        .hsm-practical-grid {
          display:
            grid;
          grid-template-columns:
            1fr
            1fr;
          border-top:
            1px solid
            var(--line);
          border-left:
            1px solid
            var(--line);
        }

        .hsm-practical-grid article {
          min-height:
            180px;
          padding:
            20px;
          border-right:
            1px solid
            var(--line);
          border-bottom:
            1px solid
            var(--line);
          display:
            flex;
          flex-direction:
            column;
          justify-content:
            space-between;
        }

        .hsm-practical-grid article > span {
          color:
            var(--muted);
          font-size:
            8px;
        }

        .hsm-practical-grid strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            22px;
          font-weight:
            400;
        }

        .hsm-practical-grid p {
          margin:
            0;
          color:
            rgba(23,21,18,.45);
          font-size:
            10px;
          line-height:
            1.7;
        }

        /* =====================================================
           FINAL
        ====================================================== */

        .hsm-home-final {
          width:
            min(
              1400px,
              100%
            );
          margin:
            120px
            auto
            0;
          padding:
            65px
            5vw;
          background:
            var(--ink);
          color:
            white;
          display:
            grid;
          grid-template-columns:
            1fr
            .55fr;
          gap:
            50px;
          align-items:
            end;
        }

        .hsm-home-final h2 {
          margin:
            17px
            0
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              58px,
              6vw,
              96px
            );
          line-height:
            .86;
          font-weight:
            400;
          letter-spacing:
            -.065em;
        }

        .hsm-home-final h2 em {
          color:
            #bfa58f;
          font-style:
            italic;
        }

        .hsm-home-final p {
          max-width:
            340px;
          color:
            rgba(255,255,255,.47);
          font-size:
            11px;
          line-height:
            1.8;
        }

        .hsm-home-final-actions {
          margin-top:
            26px;
          display:
            flex;
          align-items:
            center;
          gap:
            20px;
          flex-wrap:
            wrap;
        }

        .hsm-home-final .hsm-secondary {
          color:
            rgba(255,255,255,.66);
          border-bottom-color:
            rgba(255,255,255,.25);
        }

        .hsm-home-final .hsm-section-label {
          color:
            #bfa58f;
        }

        .hsm-footer {
          width:
            min(
              1400px,
              100%
            );
          margin:
            45px
            auto
            0;
          padding:
            22px
            0
            0;
          border-top:
            1px solid
            var(--line);
          display:
            flex;
          justify-content:
            space-between;
          gap:
            20px;
          flex-wrap:
            wrap;
          color:
            rgba(23,21,18,.42);
          font-size:
            7px;
          letter-spacing:
            .12em;
        }

        .hsm-footer div {
          display:
            flex;
          flex-direction:
            column;
          gap:
            5px;
        }

        .hsm-footer strong {
          color:
            var(--ink);
          font-size:
            8px;
        }

        .hsm-footer button {
          border:
            0;
          background:
            transparent;
          color:
            var(--ink);
          font-size:
            7px;
          letter-spacing:
            .12em;
          padding:
            0;
        }

        /* =====================================================
           SERVICES
        ====================================================== */

        .hsm-services-view {
          min-height:
            100%;
          padding:
            105px
            clamp(20px,4vw,55px)
            80px;
          background:
            var(--ink);
          color:
            white;
        }

        .hsm-services-view
        .hsm-section-label {
          color:
            #bfa58f;
        }

        .hsm-page-heading {
          width:
            min(
              1400px,
              100%
            );
          margin:
            0
            auto;
          display:
            grid;
          grid-template-columns:
            1fr
            .43fr;
          gap:
            60px;
          align-items:
            end;
        }

        .hsm-page-heading h2 {
          margin:
            18px
            0
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              58px,
              6.4vw,
              96px
            );
          font-weight:
            400;
          line-height:
            .88;
          letter-spacing:
            -.065em;
        }

        .hsm-page-heading h2 em {
          color:
            #bfa58f;
          font-style:
            italic;
        }

        .hsm-page-heading p {
          max-width:
            350px;
          margin:
            0
            0
            4px;
          color:
            rgba(255,255,255,.46);
          font-size:
            12px;
          line-height:
            1.85;
        }

        .hsm-category-filters {
          width:
            min(
              1400px,
              100%
            );
          margin:
            45px
            auto
            0;
          display:
            flex;
          gap:
            8px;
          flex-wrap:
            wrap;
        }

        .hsm-category-filters button {
          min-height:
            34px;
          padding:
            0
            13px;
          border:
            1px solid
            rgba(255,255,255,.12);
          border-radius:
            999px;
          background:
            transparent;
          color:
            rgba(255,255,255,.46);
          font-size:
            7px;
          letter-spacing:
            .16em;
          transition:
            background .25s ease,
            color .25s ease,
            border-color .25s ease;
        }

        .hsm-category-filters button:hover,
        .hsm-category-filters button.active {
          background:
            white;
          color:
            var(--ink);
          border-color:
            white;
        }

        .hsm-services-grid {
          width:
            min(
              1400px,
              100%
            );
          margin:
            25px
            auto
            0;
          display:
            grid;
          grid-template-columns:
            repeat(2,1fr);
          border-top:
            1px solid
            rgba(255,255,255,.13);
          border-left:
            1px solid
            rgba(255,255,255,.13);
        }

        .hsm-service-card {
          min-height:
            245px;
          padding:
            25px;
          border:
            0;
          border-right:
            1px solid
            rgba(255,255,255,.13);
          border-bottom:
            1px solid
            rgba(255,255,255,.13);
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.025),
              transparent
            );
          color:
            white;
          text-align:
            left;
          display:
            flex;
          flex-direction:
            column;
          justify-content:
            space-between;
          transition:
            background .45s ease,
            transform .4s
            cubic-bezier(.22,1,.36,1);
        }

        .hsm-service-card:hover {
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.08),
              rgba(255,255,255,.015)
            );
          transform:
            translateY(-3px);
        }

        .service-top,
        .service-bottom {
          display:
            flex;
          justify-content:
            space-between;
          align-items:
            center;
          gap:
            12px;
        }

        .service-top span {
          color:
            rgba(255,255,255,.28);
          font-size:
            7px;
          letter-spacing:
            .18em;
        }

        .service-main {
          margin:
            34px
            0
            25px;
          display:
            flex;
          justify-content:
            space-between;
          align-items:
            end;
          gap:
            25px;
        }

        .service-title-row {
          display:
            flex;
          gap:
            10px;
          align-items:
            center;
          flex-wrap:
            wrap;
        }

        .service-main h3 {
          margin:
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              25px,
              2.8vw,
              38px
            );
          font-weight:
            400;
          line-height:
            1;
        }

        .service-tag {
          padding:
            4px
            6px;
          border:
            1px solid
            rgba(255,255,255,.18);
          color:
            rgba(255,255,255,.45);
          font-size:
            5px;
          letter-spacing:
            .14em;
        }

        .service-main p {
          max-width:
            410px;
          margin:
            13px
            0
            0;
          color:
            rgba(255,255,255,.34);
          font-size:
            10px;
          line-height:
            1.7;
        }

        .service-main > strong {
          color:
            rgba(255,255,255,.72);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            18px;
          font-weight:
            400;
          white-space:
            nowrap;
        }

        .service-bottom {
          padding-top:
            15px;
          border-top:
            1px solid
            rgba(255,255,255,.10);
          color:
            rgba(255,255,255,.25);
          font-size:
            6px;
          letter-spacing:
            .16em;
        }

        .service-bottom span:nth-child(2) {
          margin-left:
            auto;
        }

        .service-arrow {
          width:
            35px;
          height:
            35px;
          border-radius:
            50%;
          border:
            1px solid
            rgba(255,255,255,.16);
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          color:
            rgba(255,255,255,.60);
          font-size:
            13px;
          transition:
            transform .35s ease,
            background .35s ease,
            color .35s ease;
        }

        .hsm-service-card:hover
        .service-arrow {
          transform:
            rotate(45deg);
          background:
            white;
          color:
            var(--ink);
        }

        /* =====================================================
           PACKAGES
        ====================================================== */

        .hsm-packages,
        .hsm-faq {
          width:
            min(
              1400px,
              100%
            );
          margin:
            120px
            auto
            0;
        }

        .hsm-packages-grid {
          margin-top:
            48px;
          display:
            grid;
          grid-template-columns:
            repeat(3,1fr);
          gap:
            10px;
        }

        .hsm-package-card {
          min-height:
            340px;
          padding:
            24px;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.07),
              rgba(255,255,255,.015)
            );
          border:
            1px solid
            rgba(255,255,255,.10);
          display:
            flex;
          flex-direction:
            column;
          justify-content:
            space-between;
          transition:
            transform .4s ease,
            background .4s ease;
        }

        .hsm-package-card:hover {
          transform:
            translateY(-5px);
          background:
            rgba(255,255,255,.09);
        }

        .hsm-package-number {
          color:
            rgba(255,255,255,.26);
          font-size:
            8px;
        }

        .hsm-package-copy > span {
          color:
            rgba(255,255,255,.32);
          font-size:
            6px;
          letter-spacing:
            .17em;
        }

        .hsm-package-copy h3 {
          margin:
            10px
            0
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            34px;
          font-weight:
            400;
        }

        .hsm-package-copy p {
          max-width:
            300px;
          margin:
            15px
            0
            0;
          color:
            rgba(255,255,255,.39);
          font-size:
            10px;
          line-height:
            1.7;
        }

        .hsm-package-footer {
          padding-top:
            16px;
          border-top:
            1px solid
            rgba(255,255,255,.10);
          display:
            flex;
          justify-content:
            space-between;
          align-items:
            center;
        }

        .hsm-package-footer strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            16px;
          font-weight:
            400;
        }

        .hsm-package-footer button {
          border:
            0;
          border-bottom:
            1px solid
            rgba(255,255,255,.24);
          padding:
            0
            0
            6px;
          background:
            transparent;
          color:
            white;
          display:
            flex;
          gap:
            8px;
          align-items:
            center;
          font-size:
            7px;
          letter-spacing:
            .12em;
        }

        /* =====================================================
           ADDONS
        ====================================================== */

        .hsm-addon-showcase {
          width:
            min(
              1400px,
              100%
            );
          margin:
            120px
            auto
            0;
          display:
            grid;
          grid-template-columns:
            .7fr
            1fr;
          gap:
            60px;
          align-items:
            start;
        }

        .hsm-addon-showcase h2 {
          margin:
            17px
            0
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              54px,
              5.6vw,
              86px
            );
          font-weight:
            400;
          line-height:
            .88;
          letter-spacing:
            -.06em;
        }

        .hsm-addon-showcase h2 em {
          color:
            #bfa58f;
          font-style:
            italic;
        }

        .hsm-addon-list {
          display:
            flex;
          flex-direction:
            column;
        }

        .hsm-addon-list button {
          min-height:
            76px;
          padding:
            12px
            0;
          border:
            0;
          border-top:
            1px solid
            rgba(255,255,255,.10);
          background:
            transparent;
          color:
            white;
          display:
            grid;
          grid-template-columns:
            36px
            1fr
            auto;
          gap:
            14px;
          align-items:
            center;
          text-align:
            left;
        }

        .hsm-addon-list button:last-child {
          border-bottom:
            1px solid
            rgba(255,255,255,.10);
        }

        .hsm-addon-list button > span {
          width:
            30px;
          height:
            30px;
          border:
            1px solid
            rgba(255,255,255,.14);
          border-radius:
            50%;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
        }

        .hsm-addon-list button div {
          display:
            flex;
          flex-direction:
            column;
          gap:
            4px;
        }

        .hsm-addon-list button strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            18px;
          font-weight:
            400;
        }

        .hsm-addon-list button small {
          color:
            rgba(255,255,255,.30);
          font-size:
            8px;
        }

        .hsm-addon-list button b {
          color:
            rgba(255,255,255,.52);
          font-size:
            10px;
          font-weight:
            400;
        }

        .hsm-addon-list button.active
        > span {
          background:
            white;
          color:
            var(--ink);
          border-color:
            white;
        }

        /* =====================================================
           FAQ
        ====================================================== */

        .hsm-faq-list {
          margin-top:
            45px;
          border-top:
            1px solid
            rgba(255,255,255,.10);
        }

        .hsm-faq-item {
          border-bottom:
            1px solid
            rgba(255,255,255,.10);
        }

        .hsm-faq-item > button {
          width:
            100%;
          min-height:
            76px;
          border:
            0;
          background:
            transparent;
          color:
            white;
          display:
            grid;
          grid-template-columns:
            55px
            1fr
            30px;
          gap:
            15px;
          align-items:
            center;
          text-align:
            left;
        }

        .hsm-faq-item > button > span {
          color:
            rgba(255,255,255,.25);
          font-size:
            7px;
        }

        .hsm-faq-item > button strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            20px;
          font-weight:
            400;
        }

        .hsm-faq-item > button i {
          width:
            28px;
          height:
            28px;
          border:
            1px solid
            rgba(255,255,255,.13);
          border-radius:
            50%;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          font-style:
            normal;
          transition:
            transform .3s ease;
        }

        .hsm-faq-item.open
        > button i {
          transform:
            rotate(45deg);
        }

        .hsm-faq-answer {
          display:
            grid;
          grid-template-rows:
            0fr;
          transition:
            grid-template-rows .35s ease;
        }

        .hsm-faq-answer p {
          overflow:
            hidden;
          margin:
            0;
          padding:
            0
            70px;
          color:
            rgba(255,255,255,.40);
          font-size:
            10px;
          line-height:
            1.8;
        }

        .hsm-faq-item.open
        .hsm-faq-answer {
          grid-template-rows:
            1fr;
        }

        .hsm-faq-item.open
        .hsm-faq-answer p {
          padding-bottom:
            22px;
        }

        .hsm-services-cta {
          width:
            min(
              1400px,
              100%
            );
          margin:
            70px
            auto
            0;
          padding:
            24px
            28px;
          background:
            #f0e9df;
          color:
            var(--ink);
          display:
            flex;
          justify-content:
            space-between;
          align-items:
            center;
          gap:
            25px;
        }

        .hsm-services-cta > div {
          display:
            flex;
          flex-direction:
            column;
          gap:
            7px;
        }

        .hsm-services-cta > div > span {
          color:
            rgba(23,21,18,.31);
          font-size:
            6px;
          letter-spacing:
            .15em;
        }

        .hsm-services-cta strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            22px;
          font-weight:
            400;
        }

        .hsm-services-cta strong em {
          color:
            var(--brown);
          font-style:
            italic;
        }

        .hsm-services-cta > button {
          border:
            0;
          border-bottom:
            1px solid
            rgba(23,21,18,.25);
          padding:
            0
            0
            7px;
          background:
            transparent;
          color:
            var(--ink);
          display:
            flex;
          gap:
            10px;
          align-items:
            center;
          font-size:
            8px;
          letter-spacing:
            .13em;
        }

        /* =====================================================
           ASSISTANT
        ====================================================== */

        .hsm-assistant-view {
          position:
            relative;
          height:
            100%;
          min-height:
            0;
          padding:
            96px
            clamp(15px,2.5vw,38px)
            18px;
          display:
            grid;
          grid-template-columns:
            minmax(280px,.64fr)
            minmax(0,1.36fr);
          gap:
            16px;
          overflow:
            hidden;
          background:
            radial-gradient(
              circle at 8% 8%,
              rgba(255,255,255,.92),
              transparent 32%
            ),
            radial-gradient(
              circle at 92% 88%,
              rgba(118,94,76,.11),
              transparent 31%
            ),
            #f4efe7;
        }

        .hsm-assistant-glow {
          position:
            absolute;
          pointer-events:
            none;
          border-radius:
            50%;
          filter:
            blur(70px);
        }

        .glow-one {
          width:
            300px;
          height:
            300px;
          left:
            -120px;
          top:
            25%;
          background:
            rgba(194,169,145,.16);
        }

        .glow-two {
          width:
            280px;
          height:
            280px;
          right:
            -80px;
          bottom:
            -100px;
          background:
            rgba(118,94,76,.10);
        }

        .hsm-assistant-intro {
          position:
            relative;
          z-index:
            2;
          min-height:
            0;
          padding:
            23px
            clamp(14px,2vw,31px)
            18px;
          border:
            1px solid
            rgba(23,21,18,.09);
          border-radius:
            28px;
          background:
            rgba(228,216,203,.60);
          backdrop-filter:
            blur(20px);
          display:
            flex;
          flex-direction:
            column;
          overflow:
            hidden;
        }

        .hsm-assistant-intro-top {
          display:
            flex;
          align-items:
            center;
          justify-content:
            space-between;
        }

        .hsm-assistant-status {
          display:
            flex;
          align-items:
            center;
          gap:
            6px;
          color:
            rgba(23,21,18,.34);
          font-size:
            7px;
          letter-spacing:
            .18em;
        }

        .hsm-assistant-status i {
          width:
            6px;
          height:
            6px;
          border-radius:
            50%;
          background:
            var(--green);
          box-shadow:
            0 0 0 4px
            rgba(104,116,94,.08);
        }

        .hsm-assistant-intro h2 {
          margin:
            19px
            0
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              46px,
              5.1vw,
              78px
            );
          line-height:
            .86;
          font-weight:
            400;
          letter-spacing:
            -.065em;
        }

        .hsm-assistant-intro h2 em {
          color:
            var(--brown);
          font-style:
            italic;
        }

        .hsm-assistant-intro > p {
          max-width:
            330px;
          margin:
            21px
            0
            0;
          color:
            rgba(23,21,18,.48);
          font-size:
            11px;
          line-height:
            1.8;
        }

        .hsm-assistant-categories {
          margin-top:
            19px;
          display:
            grid;
          grid-template-columns:
            1fr
            1fr;
          gap:
            6px;
        }

        .hsm-assistant-categories span {
          padding:
            8px
            9px;
          border:
            1px solid
            rgba(23,21,18,.08);
          background:
            rgba(255,255,255,.25);
          color:
            rgba(23,21,18,.38);
          font-size:
            6px;
          letter-spacing:
            .14em;
        }

        .hsm-assistant-editorial-card {
          position:
            relative;
          flex:
            1;
          min-height:
            150px;
          margin-top:
            15px;
          overflow:
            hidden;
          border-radius:
            21px;
        }

        .hsm-assistant-editorial-card img {
          width:
            100%;
          height:
            100%;
          display:
            block;
          object-fit:
            cover;
          transition:
            transform 1s
            cubic-bezier(.22,1,.36,1);
        }

        .hsm-assistant-editorial-card:hover img {
          transform:
            scale(1.045);
        }

        .hsm-assistant-editorial-overlay {
          position:
            absolute;
          inset:
            0;
          background:
            linear-gradient(
              180deg,
              transparent 28%,
              rgba(0,0,0,.50)
            );
        }

        .hsm-assistant-editorial-content {
          position:
            absolute;
          inset:
            auto
            15px
            15px
            15px;
          z-index:
            2;
          display:
            flex;
          justify-content:
            space-between;
          align-items:
            flex-end;
          color:
            white;
        }

        .hsm-assistant-editorial-content > div {
          display:
            flex;
          flex-direction:
            column;
        }

        .hsm-assistant-editorial-content small {
          color:
            rgba(255,255,255,.58);
          font-size:
            6px;
          letter-spacing:
            .20em;
        }

        .hsm-assistant-editorial-content strong {
          margin-top:
            5px;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            18px;
          line-height:
            .95;
          font-weight:
            400;
        }

        .hsm-assistant-editorial-content > span {
          width:
            34px;
          height:
            34px;
          border:
            1px solid
            rgba(255,255,255,.23);
          border-radius:
            50%;
          background:
            rgba(255,255,255,.10);
          backdrop-filter:
            blur(8px);
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
        }

        .hsm-assistant-location {
          flex-shrink:
            0;
          padding-top:
            10px;
          display:
            flex;
          justify-content:
            space-between;
          color:
            rgba(23,21,18,.25);
          font-size:
            6px;
          letter-spacing:
            .18em;
        }

        .hsm-chat-shell {
          position:
            relative;
          z-index:
            3;
          min-width:
            0;
          min-height:
            0;
          height:
            100%;
          border:
            1px solid
            rgba(23,21,18,.10);
          border-radius:
            28px;
          background:
            rgba(255,255,255,.88);
          backdrop-filter:
            blur(25px);
          box-shadow:
            0 30px 90px
            rgba(23,21,18,.10);
          overflow:
            hidden;
          display:
            flex;
          flex-direction:
            column;
        }

        .hsm-chat-header {
          flex-shrink:
            0;
          height:
            70px;
          padding:
            0
            19px;
          border-bottom:
            1px solid
            rgba(23,21,18,.08);
          display:
            flex;
          align-items:
            center;
          justify-content:
            space-between;
        }

        .hsm-chat-profile {
          display:
            flex;
          align-items:
            center;
          gap:
            10px;
        }

        .hsm-chat-avatar {
          position:
            relative;
          width:
            39px;
          height:
            39px;
          border-radius:
            50%;
          background:
            var(--ink);
          color:
            white;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-style:
            italic;
          font-size:
            17px;
        }

        .hsm-chat-avatar > span {
          position:
            absolute;
          width:
            9px;
          height:
            9px;
          bottom:
            0;
          right:
            0;
          border:
            2px solid
            white;
          border-radius:
            50%;
          background:
            var(--green);
        }

        .hsm-chat-profile div:last-child {
          display:
            flex;
          flex-direction:
            column;
          gap:
            4px;
        }

        .hsm-chat-profile strong {
          font-size:
            11px;
        }

        .hsm-chat-profile small {
          display:
            flex;
          align-items:
            center;
          gap:
            6px;
          color:
            rgba(23,21,18,.35);
          font-size:
            7px;
        }

        .hsm-chat-profile small i {
          width:
            5px;
          height:
            5px;
          border-radius:
            50%;
          background:
            var(--green);
        }

        .hsm-chat-header-right {
          display:
            flex;
          align-items:
            center;
          gap:
            10px;
        }

        .hsm-chat-header-right > span {
          color:
            rgba(23,21,18,.27);
          font-size:
            7px;
          letter-spacing:
            .20em;
        }

        .hsm-chat-live {
          padding:
            6px
            8px;
          border:
            1px solid
            rgba(104,116,94,.17);
          color:
            var(--green);
          font-size:
            6px;
          letter-spacing:
            .15em;
        }

        .hsm-chat-messages {
          flex:
            1;
          min-height:
            0;
          overflow-y:
            auto;
          background:
            linear-gradient(
              180deg,
              #fcfbf8 0%,
              #f7f3eb 100%
            );
        }

        .hsm-chat-messages-inner {
          min-height:
            100%;
          padding:
            22px
            clamp(
              15px,
              3vw,
              32px
            );
        }

        .hsm-chat-welcome {
          display:
            grid;
          grid-template-columns:
            42px
            1fr;
          gap:
            16px;
          padding:
            17px;
          margin-bottom:
            17px;
          border:
            1px solid
            rgba(23,21,18,.07);
          border-radius:
            21px;
          background:
            rgba(255,255,255,.68);
        }

        .hsm-chat-welcome-number {
          width:
            42px;
          height:
            42px;
          border:
            1px solid
            rgba(23,21,18,.10);
          border-radius:
            50%;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          color:
            var(--brown);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            12px;
        }

        .hsm-chat-welcome span {
          color:
            var(--brown);
          font-size:
            7px;
          font-weight:
            700;
          letter-spacing:
            .20em;
        }

        .hsm-chat-welcome strong {
          display:
            block;
          margin-top:
            7px;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            24px;
          line-height:
            .95;
          font-weight:
            400;
        }

        .hsm-chat-welcome p {
          max-width:
            550px;
          margin:
            10px
            0
            0;
          color:
            rgba(23,21,18,.40);
          font-size:
            9px;
          line-height:
            1.7;
        }

        .hsm-ai-topic-grid {
          display:
            grid;
          grid-template-columns:
            1fr
            1fr;
          gap:
            7px;
          margin-bottom:
            16px;
        }

        .hsm-ai-topic-grid button {
          min-height:
            70px;
          padding:
            10px;
          border:
            1px solid
            rgba(23,21,18,.07);
          border-radius:
            15px;
          background:
            rgba(255,255,255,.52);
          color:
            var(--ink);
          text-align:
            left;
          display:
            flex;
          flex-direction:
            column;
          justify-content:
            space-between;
          font-size:
            9px;
        }

        .hsm-ai-topic-grid button:hover {
          background:
            white;
          transform:
            translateY(-2px);
        }

        .hsm-ai-topic-grid span {
          color:
            var(--brown);
          font-size:
            6px;
          letter-spacing:
            .15em;
        }

        .hsm-message {
          width:
            fit-content;
          max-width:
            76%;
          margin-bottom:
            9px;
          padding:
            12px
            15px;
          font-size:
            11px;
          line-height:
            1.68;
          animation:
            hsmMessageIn .3s ease both;
        }

        .hsm-message.ai {
          margin-right:
            auto;
          border:
            1px solid
            rgba(23,21,18,.08);
          border-radius:
            18px
            18px
            18px
            5px;
          background:
            white;
          color:
            rgba(23,21,18,.70);
        }

        .hsm-message.user {
          margin-left:
            auto;
          border-radius:
            18px
            18px
            5px
            18px;
          background:
            var(--ink);
          color:
            white;
          box-shadow:
            0 10px 28px
            rgba(23,21,18,.10);
        }

        .hsm-message-label {
          margin-bottom:
            6px;
          color:
            var(--brown);
          font-size:
            6px;
          font-weight:
            700;
          letter-spacing:
            .17em;
        }

        .hsm-message.typing {
          width:
            64px;
        }

        .hsm-typing-dots {
          display:
            flex;
          align-items:
            center;
          gap:
            4px;
          padding:
            4px
            0;
        }

        .hsm-typing-dots span {
          width:
            5px;
          height:
            5px;
          border-radius:
            50%;
          background:
            rgba(23,21,18,.30);
          animation:
            hsmTyping 1s
            infinite
            ease-in-out;
        }

        .hsm-typing-dots span:nth-child(2) {
          animation-delay:
            .12s;
        }

        .hsm-typing-dots span:nth-child(3) {
          animation-delay:
            .24s;
        }

        .hsm-chat-bottom {
          flex-shrink:
            0;
          border-top:
            1px solid
            rgba(23,21,18,.08);
          background:
            rgba(255,255,255,.94);
          padding:
            10px;
        }

        .hsm-quick-title {
          display:
            flex;
          align-items:
            center;
          gap:
            10px;
          padding:
            0
            4px
            7px;
        }

        .hsm-quick-title span {
          color:
            rgba(23,21,18,.24);
          font-size:
            6px;
          letter-spacing:
            .17em;
        }

        .hsm-quick-title div {
          flex:
            1;
          height:
            1px;
          background:
            rgba(23,21,18,.06);
        }

        .hsm-quick-actions {
          display:
            flex;
          gap:
            7px;
          overflow-x:
            auto;
          padding-bottom:
            9px;
        }

        .hsm-quick-actions::-webkit-scrollbar {
          display:
            none;
        }

        .hsm-quick-actions button {
          flex-shrink:
            0;
          min-height:
            31px;
          padding:
            0
            11px;
          border:
            1px solid
            rgba(23,21,18,.09);
          border-radius:
            999px;
          background:
            #f7f4ee;
          color:
            rgba(23,21,18,.52);
          display:
            flex;
          align-items:
            center;
          gap:
            7px;
          font-size:
            8px;
        }

        .hsm-quick-actions button span {
          color:
            var(--brown);
          font-size:
            6px;
        }

        .hsm-chat-input {
          display:
            flex;
          align-items:
            center;
          gap:
            5px;
          border:
            1px solid
            rgba(23,21,18,.10);
          border-radius:
            18px;
          background:
            #f8f5ef;
          padding:
            4px
            5px;
        }

        .hsm-input-prefix {
          width:
            34px;
          height:
            34px;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          color:
            rgba(23,21,18,.30);
          font-size:
            13px;
        }

        .hsm-chat-input input {
          min-width:
            0;
          flex:
            1;
          height:
            42px;
          padding:
            0
            6px;
          border:
            0;
          outline:
            0;
          background:
            transparent;
          color:
            var(--ink);
          font-size:
            11px;
        }

        .hsm-chat-input input::placeholder {
          color:
            rgba(23,21,18,.28);
        }

        .hsm-chat-input button {
          width:
            42px;
          height:
            42px;
          border:
            0;
          border-radius:
            14px;
          background:
            var(--ink);
          color:
            white;
          font-size:
            15px;
        }

        .hsm-chat-input button:disabled {
          opacity:
            .28;
          cursor:
            not-allowed;
        }

        .hsm-chat-footer-note {
          padding-top:
            6px;
          text-align:
            center;
          color:
            rgba(23,21,18,.18);
          font-size:
            5px;
          letter-spacing:
            .18em;
        }

        /* =====================================================
           BOOKING
        ====================================================== */

        .hsm-booking-view {
          position:
            relative;
          min-height:
            100%;
          padding:
            96px
            clamp(16px,3vw,45px)
            40px;
          display:
            grid;
          grid-template-columns:
            minmax(280px,.68fr)
            minmax(0,1.32fr);
          gap:
            clamp(
              20px,
              5vw,
              80px
            );
          align-items:
            center;
          overflow:
            hidden;
          background:
            radial-gradient(
              circle at 8% 10%,
              rgba(255,255,255,.95),
              transparent 32%
            ),
            radial-gradient(
              circle at 90% 90%,
              rgba(118,94,76,.11),
              transparent 30%
            ),
            var(--cream);
        }

        .hsm-booking-glow {
          position:
            absolute;
          pointer-events:
            none;
          border-radius:
            50%;
          filter:
            blur(80px);
        }

        .booking-glow-one {
          width:
            340px;
          height:
            340px;
          top:
            -120px;
          left:
            -100px;
          background:
            rgba(255,255,255,.45);
        }

        .booking-glow-two {
          width:
            300px;
          height:
            300px;
          right:
            -100px;
          bottom:
            -130px;
          background:
            rgba(118,94,76,.10);
        }

        .hsm-booking-intro {
          position:
            relative;
          z-index:
            2;
          width:
            min(
              520px,
              100%
            );
          justify-self:
            end;
          padding:
            5px
            clamp(0px,2vw,20px)
            10px
            0;
        }

        .hsm-booking-topline {
          display:
            flex;
          align-items:
            center;
          justify-content:
            space-between;
          gap:
            15px;
        }

        .hsm-booking-topline > span:last-child {
          color:
            rgba(23,21,18,.25);
          font-size:
            6px;
          letter-spacing:
            .18em;
        }

        .hsm-booking-intro h2 {
          margin:
            20px
            0
            0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              55px,
              5.6vw,
              88px
            );
          line-height:
            .86;
          font-weight:
            400;
          letter-spacing:
            -.065em;
        }

        .hsm-booking-intro h2 em {
          color:
            var(--brown);
          font-style:
            italic;
        }

        .hsm-booking-intro > p {
          max-width:
            365px;
          margin:
            24px
            0
            0;
          color:
            rgba(23,21,18,.48);
          font-size:
            11px;
          line-height:
            1.85;
        }

        .hsm-booking-location {
          margin-top:
            33px;
          padding-top:
            18px;
          border-top:
            1px solid
            rgba(23,21,18,.11);
          display:
            grid;
          grid-template-columns:
            1fr
            1fr;
          gap:
            25px;
        }

        .hsm-booking-location div {
          display:
            flex;
          flex-direction:
            column;
          gap:
            7px;
        }

        .hsm-booking-location small {
          color:
            rgba(23,21,18,.35);
          font-size:
            6px;
          font-weight:
            700;
          letter-spacing:
            .19em;
        }

        .hsm-booking-location strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            19px;
          font-weight:
            400;
          line-height:
            1.1;
        }

        .hsm-booking-location span {
          color:
            rgba(23,21,18,.43);
          font-size:
            9px;
          line-height:
            1.65;
        }

        .hsm-booking-benefits {
          margin-top:
            30px;
          display:
            flex;
          flex-direction:
            column;
          gap:
            9px;
          color:
            rgba(23,21,18,.46);
          font-size:
            8px;
        }

        .hsm-booking-benefits div {
          display:
            flex;
          align-items:
            center;
          gap:
            9px;
        }

        .hsm-booking-benefits span {
          width:
            18px;
          height:
            18px;
          border-radius:
            50%;
          border:
            1px solid
            rgba(23,21,18,.12);
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          color:
            var(--green);
          font-size:
            8px;
        }

        .hsm-booking-card {
          position:
            relative;
          z-index:
            3;
          width:
            min(
              820px,
              100%
            );
          justify-self:
            start;
          padding:
            25px;
          border:
            1px solid
            rgba(23,21,18,.10);
          border-radius:
            26px;
          background:
            rgba(255,255,255,.88);
          backdrop-filter:
            blur(22px);
          box-shadow:
            0 30px 90px
            rgba(23,21,18,.09);
          overflow:
            hidden;
        }

        .hsm-booking-card-header {
          display:
            flex;
          align-items:
            center;
          justify-content:
            space-between;
          gap:
            20px;
          padding-bottom:
            17px;
          border-bottom:
            1px solid
            var(--line);
        }

        .hsm-booking-card-header.compact {
          padding-bottom:
            13px;
        }

        .hsm-booking-card-header > div:first-child {
          display:
            flex;
          flex-direction:
            column;
          gap:
            6px;
        }

        .hsm-booking-card-header span {
          color:
            var(--brown);
          font-size:
            6px;
          font-weight:
            700;
          letter-spacing:
            .18em;
        }

        .hsm-booking-card-header strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            20px;
          font-weight:
            400;
          line-height:
            1;
        }

        .hsm-booking-step {
          display:
            flex !important;
          align-items:
            center;
          gap:
            6px;
          color:
            rgba(23,21,18,.25) !important;
          font-family:
            Arial,
            sans-serif !important;
          font-size:
            7px !important;
          letter-spacing:
            .08em !important;
        }

        .hsm-booking-step span {
          width:
            18px;
          height:
            1px;
          background:
            rgba(23,21,18,.13);
        }

        .hsm-booking-services {
          margin-top:
            15px;
          display:
            grid;
          grid-template-columns:
            1fr
            1fr;
          gap:
            7px;
        }

        .hsm-booking-services button {
          min-height:
            68px;
          padding:
            11px
            12px;
          border:
            1px solid
            rgba(23,21,18,.08);
          border-radius:
            16px;
          background:
            rgba(248,245,239,.52);
          display:
            flex;
          align-items:
            center;
          justify-content:
            space-between;
          gap:
            8px;
          text-align:
            left;
          color:
            var(--ink);
          transition:
            transform .25s ease,
            background .25s ease,
            border-color .25s ease;
        }

        .hsm-booking-services button:hover {
          transform:
            translateY(-2px);
          border-color:
            rgba(23,21,18,.17);
          background:
            white;
        }

        .hsm-booking-services button.selected {
          border-color:
            rgba(118,94,76,.40);
          background:
            rgba(118,94,76,.09);
        }

        .hsm-booking-services button > div {
          min-width:
            0;
          display:
            flex;
          flex-direction:
            column;
          gap:
            5px;
        }

        .hsm-booking-services
        button
        > div
        > span {
          color:
            rgba(23,21,18,.27);
          font-size:
            6px;
          letter-spacing:
            .12em;
        }

        .hsm-booking-services
        button
        > div
        > strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            14px;
          font-weight:
            400;
        }

        .booking-service-price {
          color:
            var(--brown);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            12px;
          white-space:
            nowrap;
        }

        .booking-service-check {
          flex-shrink:
            0;
          width:
            25px;
          height:
            25px;
          border-radius:
            50%;
          border:
            1px solid
            rgba(23,21,18,.11);
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          color:
            rgba(23,21,18,.40);
          font-size:
            10px;
        }

        .hsm-booking-services
        button.selected
        .booking-service-check {
          background:
            var(--ink);
          color:
            white;
          border-color:
            var(--ink);
        }

        .hsm-booking-see-more {
          margin-top:
            10px;
          border:
            0;
          background:
            transparent;
          color:
            rgba(23,21,18,.34);
          display:
            flex;
          gap:
            8px;
          align-items:
            center;
          font-size:
            7px;
          letter-spacing:
            .14em;
        }

        .hsm-booking-see-more span {
          transition:
            transform .25s ease;
        }

        .hsm-booking-see-more:hover span {
          transform:
            translateX(4px);
        }

        .hsm-booking-input-section {
          margin-top:
            20px;
        }

        .hsm-booking-datetime {
          margin-top:
            14px;
          display:
            grid;
          grid-template-columns:
            1fr
            1fr;
          gap:
            10px;
        }

        .hsm-booking-datetime label,
        .hsm-booking-name {
          display:
            flex;
          flex-direction:
            column;
          gap:
            6px;
        }

        .hsm-booking-datetime label > span,
        .hsm-booking-name > span {
          color:
            rgba(23,21,18,.35);
          font-size:
            6px;
          font-weight:
            700;
          letter-spacing:
            .16em;
        }

        .hsm-booking-datetime input,
        .hsm-booking-datetime select,
        .hsm-booking-name input {
          width:
            100%;
          height:
            45px;
          padding:
            0
            12px;
          border:
            1px solid
            rgba(23,21,18,.09);
          border-radius:
            13px;
          background:
            #faf8f4;
          color:
            var(--ink);
          outline:
            0;
          font-size:
            10px;
        }

        .hsm-booking-datetime input:focus,
        .hsm-booking-datetime select:focus,
        .hsm-booking-name input:focus {
          border-color:
            rgba(118,94,76,.45);
          background:
            white;
          box-shadow:
            0 0 0 3px
            rgba(118,94,76,.06);
        }

        .hsm-booking-datetime select:disabled {
          opacity:
            .45;
          cursor:
            not-allowed;
        }

        .hsm-booking-hint {
          margin-top:
            9px;
          display:
            flex;
          align-items:
            flex-start;
          gap:
            7px;
        }

        .hsm-booking-hint span {
          color:
            var(--green);
          font-size:
            9px;
        }

        .hsm-booking-hint p {
          margin:
            0;
          color:
            rgba(23,21,18,.32);
          font-size:
            7px;
          line-height:
            1.5;
        }

        .hsm-booking-name {
          margin-top:
            14px;
        }

        .hsm-booking-addons {
          margin-top:
            12px;
          display:
            grid;
          grid-template-columns:
            1fr
            1fr;
          gap:
            7px;
        }

        .hsm-booking-addons button {
          min-height:
            64px;
          padding:
            10px
            11px;
          border:
            1px solid
            rgba(23,21,18,.08);
          border-radius:
            14px;
          background:
            #faf8f4;
          color:
            var(--ink);
          display:
            grid;
          grid-template-columns:
            25px
            1fr
            auto;
          gap:
            8px;
          align-items:
            center;
          text-align:
            left;
          transition:
            border-color .25s ease,
            background .25s ease;
        }

        .hsm-booking-addons button.selected {
          border-color:
            rgba(118,94,76,.4);
          background:
            rgba(118,94,76,.08);
        }

        .hsm-booking-addons button
        > span {
          width:
            23px;
          height:
            23px;
          border-radius:
            50%;
          border:
            1px solid
            rgba(23,21,18,.11);
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          font-size:
            9px;
        }

        .hsm-booking-addons button.selected
        > span {
          background:
            var(--ink);
          color:
            white;
        }

        .hsm-booking-addons button div {
          min-width:
            0;
          display:
            flex;
          flex-direction:
            column;
          gap:
            3px;
        }

        .hsm-booking-addons button strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            12px;
          font-weight:
            400;
        }

        .hsm-booking-addons button small {
          color:
            rgba(23,21,18,.35);
          font-size:
            7px;
        }

        .hsm-booking-addons button b {
          color:
            var(--brown);
          font-size:
            9px;
          font-weight:
            500;
        }

        /* =====================================================
           CONSENT
        ====================================================== */

        .hsm-consent {
          margin-top:
            18px;
          display:
            flex;
          align-items:
            flex-start;
          gap:
            10px;
        }

        .hsm-consent-check {
          flex-shrink:
            0;
          width:
            20px;
          height:
            20px;
          padding:
            0;
          border:
            1px solid
            rgba(23,21,18,.16);
          border-radius:
            6px;
          background:
            transparent;
          color:
            white;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          font-size:
            11px;
        }

        .hsm-consent-check.checked {
          background:
            var(--ink);
          border-color:
            var(--ink);
        }

        .hsm-consent p {
          margin:
            0;
          color:
            rgba(23,21,18,.37);
          font-size:
            7px;
          line-height:
            1.7;
        }

        .hsm-consent p button {
          border:
            0;
          padding:
            0;
          background:
            transparent;
          color:
            var(--brown);
          text-decoration:
            underline;
          text-underline-offset:
            2px;
          font-size:
            inherit;
        }

        /* =====================================================
           SUMMARY
        ====================================================== */

        .hsm-booking-summary {
          margin-top:
            20px;
          padding:
            14px
            15px;
          border:
            1px solid
            rgba(23,21,18,.09);
          border-radius:
            15px;
          background:
            #f8f5ef;
          display:
            grid;
          grid-template-columns:
            1.2fr
            1fr
            auto;
          gap:
            15px;
          align-items:
            center;
        }

        .hsm-booking-summary > div:first-child {
          display:
            flex;
          flex-direction:
            column;
          gap:
            5px;
        }

        .hsm-booking-summary
        > div:first-child
        > span {
          color:
            rgba(23,21,18,.30);
          font-size:
            6px;
          letter-spacing:
            .16em;
        }

        .hsm-booking-summary
        > div:first-child
        > strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            14px;
          font-weight:
            400;
        }

        .hsm-booking-summary
        > div:first-child
        > small {
          color:
            rgba(23,21,18,.35);
          font-size:
            7px;
        }

        .hsm-booking-summary-meta {
          display:
            flex;
          flex-direction:
            column;
          gap:
            4px;
          color:
            rgba(23,21,18,.43);
          font-size:
            8px;
        }

        .hsm-booking-summary-price {
          color:
            var(--brown);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            17px;
          font-weight:
            400;
        }

        .hsm-submit {
          width:
            100%;
          height:
            55px;
          margin-top:
            8px;
          padding:
            0
            17px
            0
            19px;
          border:
            0;
          border-radius:
            15px;
          background:
            var(--ink);
          color:
            white;
          display:
            flex;
          align-items:
            center;
          justify-content:
            space-between;
          font-size:
            10px;
          font-weight:
            600;
          transition:
            transform .3s ease,
            box-shadow .3s ease,
            opacity .3s ease;
        }

        .hsm-submit:hover:not(:disabled) {
          transform:
            translateY(-2px);
          box-shadow:
            0 16px 30px
            rgba(23,21,18,.15);
        }

        .hsm-submit > span:last-child {
          font-size:
            16px;
        }

        .hsm-submit:disabled {
          opacity:
            .42;
          cursor:
            not-allowed;
        }

        .hsm-booking-message {
          margin-top:
            9px;
          padding:
            11px
            12px;
          border:
            1px solid
            rgba(105,116,93,.18);
          border-radius:
            12px;
          background:
            rgba(105,116,93,.06);
          color:
            rgba(23,21,18,.63);
          display:
            flex;
          align-items:
            flex-start;
          gap:
            8px;
          font-size:
            8px;
          line-height:
            1.5;
        }

        .hsm-booking-message.error {
          border-color:
            rgba(154,81,75,.20);
          background:
            rgba(154,81,75,.06);
        }

        .hsm-booking-message > span {
          color:
            var(--green);
          font-weight:
            700;
        }

        .hsm-booking-message.error
        > span {
          color:
            var(--error);
        }

        .hsm-booking-required {
          margin:
            7px
            0
            0;
          color:
            rgba(23,21,18,.27);
          text-align:
            center;
          font-size:
            7px;
          line-height:
            1.5;
        }

        .hsm-booking-secure {
          margin-top:
            9px;
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          gap:
            8px;
          color:
            rgba(23,21,18,.20);
        }

        .hsm-booking-secure > span {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            9px;
          font-style:
            italic;
        }

        .hsm-booking-secure p {
          margin:
            0;
          font-size:
            6px;
          letter-spacing:
            .08em;
        }

        /* =====================================================
           PRIVACY MODAL
        ====================================================== */

        .hsm-modal-backdrop {
          position:
            fixed;
          inset:
            0;
          z-index:
            500;
          background:
            rgba(23,21,18,.42);
          backdrop-filter:
            blur(10px);
          display:
            flex;
          align-items:
            center;
          justify-content:
            center;
          padding:
            20px;
        }

        .hsm-privacy-modal {
          position:
            relative;
          width:
            min(
              620px,
              100%
            );
          max-height:
            min(
              720px,
              90dvh
            );
          overflow-y:
            auto;
          padding:
            34px;
          border:
            1px solid
            rgba(23,21,18,.10);
          border-radius:
            24px;
          background:
            var(--paper-light);
          box-shadow:
            0 35px 100px
            rgba(23,21,18,.25);
        }

        .hsm-modal-close {
          position:
            absolute;
          right:
            18px;
          top:
            18px;
          width:
            34px;
          height:
            34px;
          border:
            1px solid
            rgba(23,21,18,.10);
          border-radius:
            50%;
          background:
            transparent;
          color:
            var(--ink);
          font-size:
            20px;
        }

        .hsm-privacy-modal h2 {
          margin:
            17px
            0
            25px;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              48px,
              7vw,
              76px
            );
          font-weight:
            400;
          line-height:
            .87;
          letter-spacing:
            -.06em;
        }

        .hsm-privacy-modal h2 em {
          color:
            var(--brown);
          font-style:
            italic;
        }

        .hsm-privacy-copy p {
          margin:
            0
            0
            15px;
          color:
            rgba(23,21,18,.55);
          font-size:
            11px;
          line-height:
            1.8;
        }

        .hsm-modal-action {
          margin-top:
            12px;
        }

        /* =====================================================
           ANIMATIONS
        ====================================================== */

        @keyframes hsmFadeUp {

          from {
            opacity:
              0;
            transform:
              translateY(22px);
          }

          to {
            opacity:
              1;
            transform:
              translateY(0);
          }

        }

        @keyframes hsmMessageIn {

          from {
            opacity:
              0;
            transform:
              translateY(7px);
          }

          to {
            opacity:
              1;
            transform:
              translateY(0);
          }

        }

        @keyframes hsmTyping {

          0%,
          100% {
            opacity:
              .20;
            transform:
              translateY(0);
          }

          50% {
            opacity:
              1;
            transform:
              translateY(-3px);
          }

        }

        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 900px) {

          .hsm-cursor {
            display:
              none;
          }

          .hsm-desktop-nav,
          .hsm-header-book {
            display:
              none;
          }

          .hsm-header {
            padding:
              10px
              12px;
          }

          .hsm-header-inner {
            height:
              62px;
          }

          .hsm-menu {
            width:
              41px;
            height:
              41px;
            margin-left:
              auto;
            border:
              0;
            background:
              var(--ink);
            display:
              flex;
            flex-direction:
              column;
            align-items:
              center;
            justify-content:
              center;
            gap:
              5px;
          }

          .hsm-menu span {
            width:
              16px;
            height:
              1px;
            background:
              white;
            transition:
              transform .25s ease;
          }

          .hsm-menu.open
          span:first-child {
            transform:
              translateY(3px)
              rotate(45deg);
          }

          .hsm-menu.open
          span:last-child {
            transform:
              translateY(-3px)
              rotate(-45deg);
          }

          .hsm-mobile-menu {
            display:
              flex;
            flex-direction:
              column;
            width:
              min(
                calc(100% - 4px),
                1420px
              );
            margin:
              7px
              auto
              0;
            padding:
              6px;
            border:
              1px solid
              var(--line);
            background:
              rgba(247,244,239,.97);
            backdrop-filter:
              blur(20px);
            opacity:
              0;
            pointer-events:
              none;
            transform:
              translateY(-7px);
            transition:
              opacity .25s ease,
              transform .25s ease;
          }

          .hsm-mobile-menu.open {
            opacity:
              1;
            pointer-events:
              auto;
            transform:
              translateY(0);
          }

          .hsm-mobile-menu button {
            display:
              flex;
            align-items:
              center;
            gap:
              13px;
            padding:
              14px;
            border:
              0;
            border-bottom:
              1px solid
              var(--line);
            background:
              transparent;
            text-align:
              left;
            font-size:
              11px;
            color:
              var(--ink);
          }

          .hsm-mobile-menu button:last-child {
            border-bottom:
              0;
          }

          .hsm-mobile-menu span {
            color:
              var(--muted);
            font-size:
              7px;
          }

          .hsm-home {
            padding:
              93px
              18px
              35px;
          }

          .hsm-home-grid {
            min-height:
              auto;
            display:
              flex;
            flex-direction:
              column;
            gap:
              38px;
            align-items:
              stretch;
          }

          .hsm-home-copy {
            padding:
              0;
          }

          .hsm-home h1 {
            font-size:
              clamp(
                61px,
                17vw,
                85px
              );
          }

          .hsm-home-copy > p {
            max-width:
              100%;
            font-size:
              12px;
          }

          .hsm-home-actions {
            flex-direction:
              column;
            align-items:
              stretch;
          }

          .hsm-primary {
            width:
              100%;
          }

          .hsm-secondary {
            width:
              fit-content;
          }

          .hsm-home-meta {
            margin-top:
              36px;
            gap:
              22px;
          }

          .hsm-home-image-area {
            min-height:
              455px;
            height:
              455px;
          }

          .hsm-image-border {
            inset:
              -6px
              3px
              6px
              3px;
          }

          .hsm-home-image,
          .hsm-image-overlay {
            inset:
              0;
          }

          .hsm-image-label {
            left:
              16px;
            right:
              16px;
          }

          .hsm-floating-card {
            top:
              25px;
            left:
              4px;
            width:
              150px;
            padding:
              17px;
          }

          .hsm-floating-card strong {
            font-size:
              23px;
          }

          .hsm-stamp {
            width:
              92px;
            height:
              92px;
            right:
              5px;
            bottom:
              18px;
          }

          .hsm-stamp strong {
            font-size:
              22px;
          }

          .hsm-home-bottom {
            grid-template-columns:
              1fr;
            gap:
              20px;
          }

          .hsm-home-experience,
          .hsm-practical,
          .hsm-editorial-home,
          .hsm-faq,
          .hsm-packages,
          .hsm-addon-showcase,
          .hsm-home-final {
            margin-top:
              80px;
          }

          .hsm-home-experience-head,
          .hsm-practical,
          .hsm-subheading,
          .hsm-home-final {
            grid-template-columns:
              1fr;
            gap:
              25px;
          }

          .hsm-experience-grid {
            grid-template-columns:
              1fr
              1fr;
            margin-top:
              35px;
          }

          .hsm-experience-card {
            min-height:
              220px;
          }

          .hsm-editorial-home {
            height:
              500px;
          }

          .hsm-editorial-home-copy {
            left:
              7%;
            right:
              7%;
            bottom:
              7%;
          }

          .hsm-stat-strip {
            grid-template-columns:
              1fr
              1fr;
          }

          .hsm-stat-strip div:nth-child(2) {
            border-right:
              0;
          }

          .hsm-stat-strip div:nth-child(-n+2) {
            border-bottom:
              1px solid
              var(--line);
          }

          .hsm-practical-grid {
            grid-template-columns:
              1fr;
          }

          .hsm-home-final {
            padding:
              42px
              26px;
          }

          .hsm-footer {
            flex-direction:
              column;
            align-items:
              flex-start;
          }

          /* SERVICES */

          .hsm-services-view {
            padding:
              92px
              18px
              45px;
          }

          .hsm-page-heading {
            grid-template-columns:
              1fr;
            gap:
              22px;
          }

          .hsm-page-heading h2 {
            font-size:
              clamp(
                51px,
                13vw,
                74px
              );
          }

          .hsm-category-filters {
            margin-top:
              30px;
            overflow-x:
              auto;
            flex-wrap:
              nowrap;
            padding-bottom:
              2px;
          }

          .hsm-category-filters button {
            flex-shrink:
              0;
          }

          .hsm-services-grid {
            grid-template-columns:
              1fr;
            margin-top:
              22px;
          }

          .hsm-service-card {
            min-height:
              220px;
          }

          .hsm-packages-grid {
            grid-template-columns:
              1fr;
          }

          .hsm-addon-showcase {
            grid-template-columns:
              1fr;
            gap:
              35px;
          }

          .hsm-services-cta {
            flex-direction:
              column;
            align-items:
              flex-start;
          }

          /* ASSISTANT */

          .hsm-assistant-view {
            height:
              auto;
            min-height:
              100%;
            padding:
              92px
              12px
              14px;
            display:
              flex;
            flex-direction:
              column;
            gap:
              12px;
            overflow-y:
              auto;
          }

          .hsm-assistant-intro {
            min-height:
              auto;
            padding:
              17px;
          }

          .hsm-assistant-intro h2 {
            font-size:
              clamp(
                47px,
                12vw,
                70px
              );
          }

          .hsm-assistant-intro > p {
            display:
              none;
          }

          .hsm-assistant-editorial-card {
            display:
              none;
          }

          .hsm-assistant-location {
            margin-top:
              13px;
          }

          .hsm-chat-shell {
            height:
              calc(
                100dvh - 270px
              );
            min-height:
              430px;
          }

          .hsm-chat-header {
            height:
              63px;
          }

          .hsm-chat-header-right > span {
            display:
              none;
          }

          .hsm-chat-messages-inner {
            padding:
              15px
              12px;
          }

          .hsm-chat-welcome {
            padding:
              14px;
          }

          .hsm-chat-welcome p {
            display:
              none;
          }

          .hsm-message {
            max-width:
              88%;
          }

          /* BOOKING */

          .hsm-booking-view {
            min-height:
              100%;
            padding:
              92px
              12px
              25px;
            display:
              flex;
            flex-direction:
              column;
            align-items:
              stretch;
            gap:
              17px;
          }

          .hsm-booking-intro {
            width:
              100%;
            padding:
              0
              5px;
          }

          .hsm-booking-intro h2 {
            font-size:
              clamp(
                47px,
                12vw,
                68px
              );
          }

          .hsm-booking-intro > p {
            display:
              none;
          }

          .hsm-booking-location {
            margin-top:
              19px;
          }

          .hsm-booking-card {
            width:
              100%;
            padding:
              17px;
          }

          .hsm-modal-backdrop {
            padding:
              12px;
          }

          .hsm-privacy-modal {
            padding:
              25px;
          }

        }

        @media (max-width: 560px) {

          .hsm-brand-copy {
            display:
              none;
          }

          .hsm-home h1 {
            font-size:
              60px;
          }

          .hsm-home-image-area {
            min-height:
              405px;
            height:
              405px;
          }

          .hsm-home-bottom {
            padding-bottom:
              25px;
          }

          .hsm-experience-grid {
            grid-template-columns:
              1fr;
          }

          .hsm-editorial-home {
            height:
              420px;
          }

          .hsm-editorial-home-copy h3 {
            font-size:
              55px;
          }

          .hsm-stat-strip strong {
            font-size:
              28px;
          }

          .service-main {
            flex-direction:
              column;
            align-items:
              flex-start;
            gap:
              12px;
          }

          .hsm-chat-header {
            padding:
              0
              13px;
          }

          .hsm-chat-input {
            padding:
              8px;
          }

          .hsm-chat-input input,
          .hsm-chat-input button {
            height:
              45px;
          }

          .hsm-assistant-intro {
            padding:
              15px;
          }

          .hsm-chat-shell {
            min-height:
              440px;
            height:
              calc(
                100dvh - 250px
              );
          }

          .hsm-chat-welcome {
            grid-template-columns:
              34px
              1fr;
            gap:
              11px;
          }

          .hsm-chat-welcome-number {
            width:
              34px;
            height:
              34px;
          }

          .hsm-chat-welcome strong {
            font-size:
              20px;
          }

          .hsm-ai-topic-grid {
            grid-template-columns:
              1fr;
          }

          .hsm-booking-services {
            grid-template-columns:
              1fr;
          }

          .hsm-booking-datetime {
            grid-template-columns:
              1fr;
          }

          .hsm-booking-addons {
            grid-template-columns:
              1fr;
          }

          .hsm-booking-summary {
            grid-template-columns:
              1fr
              auto;
          }

          .hsm-booking-summary-meta {
            grid-column:
              1;
          }

          .hsm-booking-summary-price {
            grid-column:
              2;
            grid-row:
              1 / span 2;
          }

          .hsm-faq-item > button {
            grid-template-columns:
              34px
              1fr
              28px;
          }

          .hsm-faq-answer p {
            padding-left:
              48px;
            padding-right:
              20px;
          }

          .hsm-home-final-actions {
            flex-direction:
              column;
            align-items:
              stretch;
          }

        }

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration:
              .01ms !important;
            animation-iteration-count:
              1 !important;
            transition-duration:
              .01ms !important;
            scroll-behavior:
              auto !important;
          }

        }

      `}</style>
    </main>
  );
}