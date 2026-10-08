export type ServiceCategory = "CUT" | "STYLE" | "COLOR" | "CARE" | "SIGNATURE";

export type Service = {
  name: string;
  category: ServiceCategory;
  price: number;
  priceFrom: boolean;
  duration: number;
  description: string;
};

export type AddOn = {
  name: string;
  price: number;
  duration: number;
};

export const SERVICES: readonly Service[] = [
  { name: "Taglio Donna", category: "CUT", price: 35, priceFrom: false, duration: 60, description: "Taglio personalizzato, consulenza e finish." },
  { name: "Taglio Uomo", category: "CUT", price: 25, priceFrom: false, duration: 45, description: "Taglio uomo preciso con finish." },
  { name: "Taglio Junior", category: "CUT", price: 20, priceFrom: false, duration: 45, description: "Taglio junior semplice e personalizzato." },
  { name: "Frangia / Refresh", category: "CUT", price: 12, priceFrom: false, duration: 20, description: "Refresh rapido di frangia e contorni." },

  { name: "Piega", category: "STYLE", price: 20, priceFrom: false, duration: 45, description: "Piega classica con finish pulito." },
  { name: "Piega Luxury", category: "STYLE", price: 30, priceFrom: false, duration: 60, description: "Piega più strutturata e finish premium." },
  { name: "Onde / Wavy", category: "STYLE", price: 25, priceFrom: false, duration: 60, description: "Onde morbide e texture moderna." },
  { name: "Acconciatura", category: "STYLE", price: 40, priceFrom: true, duration: 75, description: "Acconciatura personalizzata da evento." },

  { name: "Colore", category: "COLOR", price: 45, priceFrom: true, duration: 120, description: "Colore personalizzato in base a lunghezza e tecnica." },
  { name: "Root Touch-Up", category: "COLOR", price: 35, priceFrom: true, duration: 90, description: "Ritocco ricrescita mirato." },
  { name: "Gloss / Toner", category: "COLOR", price: 30, priceFrom: true, duration: 60, description: "Lucentezza, riflesso e tonalizzazione." },
  { name: "Balayage", category: "COLOR", price: 70, priceFrom: true, duration: 150, description: "Schiariture sfumate e naturali." },
  { name: "Highlights", category: "COLOR", price: 65, priceFrom: true, duration: 150, description: "Schiariture personalizzate e dimensione." },
  { name: "Face Framing", category: "COLOR", price: 45, priceFrom: true, duration: 120, description: "Punti luce frontali ad alto impatto." },

  { name: "Keratina", category: "CARE", price: 50, priceFrom: false, duration: 120, description: "Servizio lisciante/trattamento secondo consulenza." },
  { name: "Hair Repair", category: "CARE", price: 25, priceFrom: false, duration: 45, description: "Trattamento riparatore intensivo." },
  { name: "Scalp Ritual", category: "CARE", price: 22, priceFrom: false, duration: 30, description: "Rituale dedicato a cute e benessere." },
  { name: "Deep Hydration", category: "CARE", price: 20, priceFrom: false, duration: 45, description: "Trattamento idratante profondo." },

  { name: "HSM Signature", category: "SIGNATURE", price: 95, priceFrom: true, duration: 120, description: "Esperienza completa Hair Studio Milano." },
  { name: "Total Blonde", category: "SIGNATURE", price: 120, priceFrom: true, duration: 180, description: "Percorso blond completo su consulenza." },
  { name: "Color Transformation", category: "SIGNATURE", price: 110, priceFrom: true, duration: 180, description: "Trasformazione colore ad alta complessità." },
  { name: "Event Ready", category: "SIGNATURE", price: 80, priceFrom: true, duration: 120, description: "Look completo per evento o occasione speciale." },
];

export const ADD_ONS: readonly AddOn[] = [
  { name: "Massaggio cute", price: 10, duration: 10 },
  { name: "Gloss express", price: 15, duration: 20 },
  { name: "Treatment boost", price: 18, duration: 20 },
  { name: "Blow-dry finish", price: 12, duration: 15 },
];

export const BUSINESS = {
  name: "Hair Studio Milano",
  address: "Via Torino 15",
  city: "Milano",
  region: "Lombardia",
  country: "Italia",
  timezone: "Europe/Rome",
  openMinutes: 9 * 60,
  closeMinutes: 19 * 60 + 30,
  closedWeekdays: [0, 1] as const,
  openDaysLabel: "martedì-sabato",
  openingHoursLabel: "09:00-19:30",
};

export function getService(name: string) {
  return SERVICES.find((service) => service.name === name) ?? null;
}

export function getAddOn(name: string) {
  return ADD_ONS.find((addon) => addon.name === name) ?? null;
}

export function estimatePrice(serviceName: string, addOnNames: string[]) {
  const service = getService(serviceName);
  if (!service) return null;

  const addOns = addOnNames.map(getAddOn);
  if (addOns.some((item) => !item)) return null;

  return {
    total: service.price + addOns.reduce((sum, item) => sum + (item?.price ?? 0), 0),
    priceFrom: service.priceFrom,
    duration: service.duration + addOns.reduce((sum, item) => sum + (item?.duration ?? 0), 0),
  };
}

export function catalogForPrompt() {
  return SERVICES.map((service) => {
    const price = `${service.priceFrom ? "da " : ""}€${service.price}`;
    return `- ${service.name}: ${price}, circa ${service.duration} min — ${service.description}`;
  }).join("\n");
}

export function addOnsForPrompt() {
  return ADD_ONS.map((item) => `- ${item.name}: +€${item.price}, +${item.duration} min`).join("\n");
}
