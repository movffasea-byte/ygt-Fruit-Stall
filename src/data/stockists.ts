export type Stockist = { name: string; area: string };

// From the shop's "Available at our Stockist" post. Currently stocks the drinking yoghurt.
// Cities and phone numbers are not known yet: add them here when the client provides them.
export const stockists: Stockist[] = [
  { name: "SIA Provision Store", area: "Alqali road" },
  { name: "Sherifiddeen Stores", area: "Waff road" },
  { name: "Kantiplus Supermarket", area: "Alqali road" },
  { name: "Kantiplus Supermarket", area: "Isah Kaita" },
  { name: "Kantiplus Supermarket", area: "Opposite Kasuwa" },
  { name: "Talba Shop", area: "Almannar" },
  { name: "Mai Jama'a Shop", area: "Shooting" },
  { name: "Tahir Suya Spot", area: "Gamji gate" },
  { name: "Healthwise Supermarket", area: "Jaji" },
];
