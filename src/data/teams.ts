
import type { Team } from '@/types';
import { players } from './players';

const baseTeams: Omit<Team, 'players'>[] = [
  {
    id: 1,
    name: "LOS QUITU",
    logoUrl: "/optimas/equipos/1.webp",
    slug: "losquitu",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 10,
    name: "LA PAPA MADRE",
    logoUrl: "/optimas/equipos/10.webp",
    slug: "lpm",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 11,
    name: "WANDERERS",
    logoUrl: "/optimas/equipos/11.webp",
    slug: "wanderers",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 12,
    name: "JCC 1930",
    logoUrl: "/optimas/equipos/12.webp",
    slug: "jcc-1930",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 13,
    name: "STELLA",
    logoUrl: '/optimas/equipos/13.webp',
    slug: "stella",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 14,
    name: "REAL CANELONES",
    logoUrl: "/optimas/equipos/14.webp",
    slug: "realcanelones",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 15,
    name: "DAC",
    logoUrl: "/optimas/equipos/15.webp",
    slug: "dac",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 2,
    name: "VALDEARCOS",
    logoUrl: "/optimas/equipos/2.webp",
    slug: "valdearcos",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 3,
    name: "NEGRIAZUL",
    logoUrl: "/optimas/equipos/3.webp",
    slug: "negriazul",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 4,
    name: "PEDRENSE",
    logoUrl: "/optimas/equipos/4.webp",
    slug: "pedrense",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 5,
    name: "LA PIECITA",
    logoUrl: "/optimas/equipos/5.webp",
    slug: "lapiecita",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 6,
    name: "EL HACHA",
    logoUrl: "/optimas/equipos/6.webp",
    slug: "elhacha",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 7,
    name: "MILANO",
    logoUrl: "/optimas/equipos/7.webp",
    slug: "milano",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 8,
    name: "T. DE CAMPEONES",
    logoUrl: "/optimas/equipos/8.webp",
    slug: "tierra",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  },
  {
    id: 9,
    name: "CAPINCHO",
    logoUrl: '/optimas/equipos/9.webp',
    slug: "capincho",
    createdAt: new Date("2025-09-06T02:11:09.842Z"),
    updatedAt: new Date("2025-09-06T02:11:09.842Z"),
    description: null,
    bannerUrl: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    phone: null
  }
];


// Distribute players to teams
export const futsalTeams: Team[] = baseTeams.map((team, index) => {
  const startIndex = index * 10;
  const endIndex = startIndex + 10;
  return {
    ...team,
    players: players.slice(startIndex, endIndex)
  };
});
