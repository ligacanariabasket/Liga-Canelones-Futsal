
import type { Team } from '@/types';
import { players } from './players';

const baseTeams: Omit<Team, 'players'>[] = [
  {
    id: 1,
    name: "LOS QUITU",
    logoUrl: "/equipos/1.png",
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
    logoUrl: "/equipos/10.png",
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
    logoUrl: "/equipos/11.png",
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
    logoUrl: "/equipos/12.png",
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
    logoUrl: '/equipos/13.png',
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
    logoUrl: "/equipos/14.png",
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
    logoUrl: "/equipos/15.png",
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
    logoUrl: "/equipos/2.png",
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
    logoUrl: "/equipos/3.png",
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
    logoUrl: "/equipos/4.png",
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
    logoUrl: "/equipos/5.png",
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
    logoUrl: "/equipos/6.png",
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
    logoUrl: "/equipos/7.png",
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
    logoUrl: "/equipos/8.png",
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
    logoUrl: '/equipos/9.png',
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
