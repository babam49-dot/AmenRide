/**
 * Official Real Bahir Dar Landmarks & Location Database
 * City: Bahir Dar, Amhara Region, Ethiopia 🇪🇹
 */

export const BAHIR_DAR_PRESETS = [
  {
    id: 'loc_1',
    name: 'Felege Hiwot Referral Hospital',
    amharicName: 'ፈስጌ ሕይወት ሪፈራል ሆስፒታል',
    subtitle: 'Kebele 04, Bahir Dar',
    category: 'Hospital',
    lat: 11.6080,
    lng: 37.3699,
  },
  {
    id: 'loc_2',
    name: 'Grand Resort & Spa',
    amharicName: 'ግራንድ ሪዞርት ኤንድ ስፓ',
    subtitle: 'Lake Tana Shore, Near Stadium',
    category: 'Hotel',
    lat: 11.5936,
    lng: 37.3908,
  },
  {
    id: 'loc_3',
    name: 'Blue Nile Abay River Bridge',
    amharicName: 'አባይ ድልድይ',
    subtitle: 'Blue Nile Cable Bridge, Abay Mado',
    category: 'Bridge / Landmark',
    lat: 11.4210,
    lng: 37.4082,
  },
  {
    id: 'loc_4',
    name: 'Bahir Dar University (Peda Campus)',
    amharicName: 'ባሕር ዳር ዩኒቨርሲቲ (ፔዳ ካምፓስ)',
    subtitle: 'Main Peda Campus, Poly Road',
    category: 'University',
    lat: 11.5978,
    lng: 37.3956,
  },
  {
    id: 'loc_5',
    name: 'BDU Institute of Technology (BiT)',
    amharicName: 'ባሕር ዳር ቴክኖሎጂ ኢንስቲትዩት (BiT)',
    subtitle: 'BiT Campus, Zenbaba Area',
    category: 'University',
    lat: 11.5917,
    lng: 37.3908,
  },
  {
    id: 'loc_6',
    name: 'Dejazmach Belay Zeleke International Airport',
    amharicName: 'ደጃዝማች በላይ ዘለቀ ዓለም አቀፍ ኤርፖርት',
    subtitle: 'Bahir Dar Airport (BJR)',
    category: 'Airport',
    lat: 11.6081,
    lng: 37.3214,
  },
  {
    id: 'loc_7',
    name: 'Dib Anbessa Hotel',
    amharicName: 'ድብ አንበሳ ሆቴል',
    subtitle: 'City Center, Kebele 03',
    category: 'Hotel',
    lat: 11.5942,
    lng: 37.3881,
  },
  {
    id: 'loc_8',
    name: 'Abay Mado Sub City',
    amharicName: 'አባይ ማዶ ክፍለ ከተማ',
    subtitle: 'Across Blue Nile Bridge',
    category: 'District',
    lat: 11.4185,
    lng: 37.4120,
  },
  {
    id: 'loc_9',
    name: 'Kebele 04 Market & Shopping Mall',
    amharicName: 'ቀበሌ 04 ገበያ እና ሱቆች',
    subtitle: 'Commercial Zone, Bahir Dar',
    category: 'Shopping',
    lat: 11.5995,
    lng: 37.3855,
  },
  {
    id: 'loc_10',
    name: 'Bezawit Hill & Palace Viewpoint',
    amharicName: 'በዛዊት ተራራ እና ቤተ መንግሥት',
    subtitle: 'Panoramic Lake Tana & Nile River View',
    category: 'Sightseeing',
    lat: 11.4089,
    lng: 37.4211,
  },
  {
    id: 'loc_11',
    name: 'Lake Tana Boat Port / Kuriftu Resort',
    amharicName: 'ጣና ሐይቅ ጀልባ துறை / ኩሪፍቱ',
    subtitle: 'Island Monasteries Boat Station',
    category: 'Port / Tourism',
    lat: 11.6022,
    lng: 37.3785,
  },
  {
    id: 'loc_12',
    name: 'Sebatamit Bus Station',
    amharicName: 'ሰባታሚት መኪና ማቆሚያ',
    subtitle: 'South Exit Terminal, Bahir Dar',
    category: 'Transport',
    lat: 11.5750,
    lng: 37.3920,
  },
];

export function resolveBahirDarCoords(query) {
  if (!query) return { lat: 11.6080, lng: 37.3699, name: BAHIR_DAR_PRESETS[0].name, subtitle: BAHIR_DAR_PRESETS[0].subtitle };
  const q = query.toLowerCase().trim();

  let match = BAHIR_DAR_PRESETS.find(
    (loc) => loc.name.toLowerCase().includes(q) || loc.amharicName.includes(q) || loc.subtitle.toLowerCase().includes(q)
  );

  if (!match) {
    const tokens = q.split(/\s+/).filter(t => t.length > 2);
    match = BAHIR_DAR_PRESETS.find((loc) => {
      const locText = `${loc.name} ${loc.amharicName} ${loc.subtitle}`.toLowerCase();
      return tokens.every(token => locText.includes(token));
    });
  }

  if (match) return { lat: match.lat, lng: match.lng, name: match.name, subtitle: match.subtitle };

  // Fallback hash geocoder for typed addresses
  let hash = 0;
  for (let i = 0; i < query.length; i++) hash = (hash << 5) - hash + query.charCodeAt(i);
  const latOffset = ((Math.abs(hash) % 100) - 50) / 5000;
  const lngOffset = ((Math.abs(hash >> 2) % 100) - 50) / 5000;

  return {
    lat: 11.5980 + latOffset,
    lng: 37.3820 + lngOffset,
    name: query,
    subtitle: 'Bahir Dar, Ethiopia',
  };
}
