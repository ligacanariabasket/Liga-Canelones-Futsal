
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../icons';
import { motion } from 'framer-motion';
import { ArrowRight, GanttChartSquare, Shield, Newspaper, Lock, BookUser, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';


const QuickLink = ({ href, children, icon }: { href: string; children: React.ReactNode, icon?: React.ReactNode }) => (
    <Link href={href} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary group">
        {icon ? React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4 text-primary/70 group-hover:text-primary transition-colors' }) : <ArrowRight className="h-4 w-4" />}
        <span className="group-hover:translate-x-1 transition-transform duration-200">{children}</span>
    </Link>
);

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-muted-foreground transition-colors hover:text-primary p-2 rounded-full hover:bg-primary/10"
    whileHover={{ scale: 1.1, rotate: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    {icon}
  </motion.a>
);


export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-t from-card to-background border-t border-border">
        <div className="container py-12 lg:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Logo and About */}
            <div className="md:col-span-12 lg:col-span-4 flex flex-col items-start gap-4">
                 <Link href="/" className="flex items-center space-x-2">
                    <Image src="/logofu.svg" alt="Liga Futsal Logo" width={32} height={32} />
                    <span className="font-bold text-lg whitespace-nowrap font-orbitron">
                      Liga Canaria Futsal
                    </span>
                </Link>
                <p className="text-sm text-muted-foreground max-w-sm">
                    La plataforma definitiva para los amantes del futsal en la región de Canelones. Sigue cada partido, cada gol y cada jugada.
                </p>
                 <div className="flex items-center space-x-2 mt-4">
                    <SocialLink href="https://www.instagram.com/ligacanariadefutsaloficial/" icon={<InstagramIcon width={24} height={24} />} />
                    <SocialLink href="https://www.facebook.com/Ligacanariadefutsal" icon={<FacebookIcon width={24} height={24} />} />
                    <SocialLink href="https://youtube.com/@ligacanariadefutsaltv" icon={<YoutubeIcon width={24} height={24} />} />
                </div>
            </div>
            
            {/* Quick Links */}
            <div className="md:col-span-6 lg:col-span-4 grid grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-foreground mb-4">Navegación</h4>
                    <nav className="flex flex-col gap-3">
                        <QuickLink href="/partidos" icon={<GanttChartSquare />}>Partidos</QuickLink>
                        <QuickLink href="/posiciones" icon={<Shield />}>Posiciones</QuickLink>
                        <QuickLink href="/clubes" icon={<Users />}>Clubes</QuickLink>
                        <QuickLink href="/jugadores" icon={<Users />}>Jugadores</QuickLink>
                        <QuickLink href="/blog" icon={<Newspaper />}>Noticias</QuickLink>
                    </nav>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                    <nav className="flex flex-col gap-3">
                        <QuickLink href="/politica-de-privacidad" icon={<Lock />}>Privacidad</QuickLink>
                        <QuickLink href="/terminos-de-servicio" icon={<BookUser />}>Términos</QuickLink>
                    </nav>
                </div>
            </div>

            {/* Newsletter/Contact */}
            <div className="md:col-span-6 lg:col-span-4 flex flex-col gap-4">
                 <h4 className="font-semibold text-foreground">Mantente Actualizado</h4>
                 <p className="text-sm text-muted-foreground">Recibe las últimas noticias y actualizaciones directamente en tu correo. (Funcionalidad próximamente)</p>
                 <div className="flex w-full max-w-sm items-center space-x-2">
                    <input type="email" placeholder="Email" className="h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" disabled />
                    <Button type="submit" disabled>Suscribirse</Button>
                </div>
            </div>
        </div>
        <div className="bg-background/30 py-4">
             <div className="container text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Liga Canelones Futsal. Todos los derechos reservados.
            </div>
        </div>
    </footer>
  );
}
