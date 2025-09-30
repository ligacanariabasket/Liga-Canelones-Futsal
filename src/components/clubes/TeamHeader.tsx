
'use client';

import type { Team } from '@/types';
import Image from 'next/image';
import { Users, BarChart2, Clock, Goal, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { InstagramIcon, FacebookIcon,  WhatsAppIcon } from '../icons';
import { motion } from 'framer-motion';


const Stat = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: number | string }) => (
    <motion.div 
        className="flex flex-col items-center justify-center p-4 rounded-lg bg-black/30 backdrop-blur-sm text-white shadow-lg border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="p-3 bg-primary/20 rounded-full mb-2 border border-primary/30">
            <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className="text-3xl font-bold font-orbitron">{value}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    </motion.div>
)

export const TeamHeader = ({ team }: { team: Team }) => {
    const finishedMatches = team.matches?.filter(m => m.status === 'FINISHED') || [];
    const totalMatchesPlayed = finishedMatches.length;

    const totalMinutesPlayed = finishedMatches.reduce((acc) => {
        // Assuming each match is 40 minutes (2 periods of 20 minutes)
        // This could be more accurate if match duration is stored
        return acc + 40; 
    }, 0);

    const totalGoalsScored = finishedMatches.reduce((acc, match) => {
        if (match.teamA.id === team.id) return acc + (match.scoreA || 0);
        if (match.teamB.id === team.id) return acc + (match.scoreB || 0);
        return acc;
    }, 0);

    const averageGoals = totalMatchesPlayed > 0 ? (totalGoalsScored / totalMatchesPlayed).toFixed(1) : '0';

    const getSocialHandle = (platform: 'instagram' | 'facebook' | 'whatsapp', url: string): string => {
        if (!url) return '';
        try {
            const path = new URL(url).pathname.split('/').filter(p => p);
            if (platform === 'instagram') {
                return `@${path[0]}`;
            }
            if (platform === 'facebook') {
                return path[0];
            }
        } catch {
            // Handle cases where it's not a full URL (e.g., just a username)
            if (platform === 'instagram') return url.startsWith('@') ? url : `@${url}`;
            return url;
        }
        return '';
    };

    const socialLinks = [
        {
            href: team.instagram,
            icon: <InstagramIcon width={24} height={24} />,
            name: 'Instagram',
            handle: getSocialHandle('instagram', team.instagram || '')
        },
        {
            href: team.facebook,
            icon: <FacebookIcon width={24} height={24} />,
            name: 'Facebook',
            handle: getSocialHandle('facebook', team.facebook || '')
        },
        {
            href: team.whatsapp,
            icon: <WhatsAppIcon width={24} height={24} />,
            name: 'WhatsApp',
            handle: team.whatsapp // For whatsapp, we just show the number/link as is
        }
    ].filter(link => link.href && link.handle);

    return (
        <section 
            className="relative bg-secondary/30 pt-12 pb-12 text-foreground bg-cover bg-center"
            style={{ backgroundImage: team.bannerUrl ? `url(${team.bannerUrl})` : "none" }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                 <div className="w-full flex justify-start md:justify-end mb-4">
                    <Button asChild variant="outline" className="bg-background/60 backdrop-blur-sm hover:bg-background/80">
                        <Link href="/clubes">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a Clubes
                        </Link>
                    </Button>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <Image
                        src={team.logoUrl || '/logofu.svg'}
                        alt={team.name}
                        width={150}
                        height={150}
                        className="rounded-full border-4 border-primary shadow-2xl bg-white/10 flex-shrink-0"
                    />
                    <div>
                        <p className="text-primary font-semibold">Equipo de la Liga</p>
                        <h1 className="text-5xl lg:text-7xl font-bold font-orbitron mt-1 drop-shadow-lg">{team.name}</h1>
                        {team.description && (
                            <p className="mt-4 text-muted-foreground max-w-xl mx-auto md:mx-0">{team.description}</p>
                        )}
                        {socialLinks.length > 0 && (
                             <div className="mt-4 flex items-center justify-center md:justify-start gap-4">
                                {socialLinks.map(link => (
                                    <Link key={link.name} href={link.href!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
                                        {link.icon}
                                        <span className="text-sm font-medium">{link.handle}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10 mt-12">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <Stat icon={Users} label="Jugadores" value={team.players.length} />
                    <Stat icon={BarChart2} label="Partidos Jugados" value={totalMatchesPlayed} />
                    <Stat icon={Clock} label="Minutos Jugados" value={totalMinutesPlayed} />
                    <Stat icon={Goal} label="Prom. Goles" value={averageGoals} />
                </div>
            </div>
        </section>
    );
};
