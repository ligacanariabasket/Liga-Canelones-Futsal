
import type { SocialLink } from '@/types';
import { InstagramIcon, FacebookIcon, GlobeIcon, YoutubeIcon } from '@/components/icons';

export const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/ligacanariadefutsaloficial/',
    icon: InstagramIcon,
    imageUrl: '/redes/instagram.png',
    color: '#E1306C',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/Ligacanariadefutsal',
    icon: FacebookIcon,
    imageUrl: '/redes/facebook.png',
    color: '#1877F2',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@ligacanariadefutsaltv',
    icon: YoutubeIcon,
    imageUrl: '/redes/youtube.png',
    color: '#FF0000',
  },
  {
    name: 'Sitio Web',
    url: 'https://ligacanelonesfutsalmc.netlify.app/',
    icon: GlobeIcon,
    imageUrl: '/redes/sitioweb.png',
    color: 'hsl(var(--primary))',
  },
];
