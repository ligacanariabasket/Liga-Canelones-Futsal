
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { siteConfig, siteIcons } from '@/config/site';
import { MobileNav } from '@/components/layout/MobileNav';
import { Shield, ChevronDown } from 'lucide-react';

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!isMounted) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)]">
            <div className="container flex h-full max-w-screen-2xl items-center justify-between">
                <div className="flex items-center space-x-2">
                     <Image src="/logofu.svg" alt="Liga Futsal Logo" width={32} height={32} />
                    <span className="font-bold sm:inline-block text-lg whitespace-nowrap font-orbitron">
                        {siteConfig.name}
                    </span>
                </div>
            </div>
        </header>
    );
  }

  return (
    <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? 'bg-background/80 border-b backdrop-blur-lg shadow-lg' : 'bg-transparent border-b border-transparent'
    )}>
      <div className="container flex h-[var(--header-height)] max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
            <Image src="/logofu.svg" alt="Liga Futsal Logo" width={32} height={32} />
            <span className="font-bold sm:inline-block text-lg whitespace-nowrap font-orbitron">
              {siteConfig.name}
            </span>
        </Link>
        
        <div className="flex items-center gap-4">
            <nav className="hidden gap-2 md:flex">
                {siteConfig.mainNav.map((link) => (
                <Button key={`${link.href}-${link.title}`} variant="ghost" asChild className={cn(
                    "relative text-sm font-medium transition-colors",
                    pathname === link.href ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                )}>
                    <Link href={link.href} className="group">
                        <span className="flex items-center gap-2">
                             {link.title}
                        </span>
                        <span className={cn(
                             "absolute bottom-0 left-0 h-0.5 bg-primary w-full transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                             pathname === link.href ? 'scale-x-100' : 'scale-x-0'
                        )} />
                    </Link>
                </Button>
                ))}
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn(
                        "relative text-sm font-medium transition-colors",
                        siteConfig.infoNav.links.some(link => pathname.startsWith(link.href)) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                    )}>
                       <div className="group">
                        <span className="flex items-center gap-2">
                            <siteIcons.infoNav className="h-4 w-4" />
                            Competición
                            <ChevronDown className="h-4 w-4" />
                        </span>
                        <span className={cn(
                             "absolute bottom-0 left-0 h-0.5 bg-primary w-full transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                             siteConfig.infoNav.links.some(link => pathname.startsWith(link.href)) ? 'scale-x-100' : 'scale-x-0'
                        )} />
                       </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {siteConfig.infoNav.links.map((link) => {
                      const Icon = siteIcons.infoNavLinks[link.title];
                      return (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{link.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn(
                        "relative text-sm font-medium transition-colors",
                        siteConfig.gestionNav.links.some(link => pathname.startsWith(link.href)) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                    )}>
                       <div className="group">
                        <span className="flex items-center gap-2">
                            <siteIcons.gestionNav className="h-4 w-4" />
                            Gestión
                            <ChevronDown className="h-4 w-4" />
                        </span>
                        <span className={cn(
                             "absolute bottom-0 left-0 h-0.5 bg-primary w-full transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                             siteConfig.gestionNav.links.some(link => pathname.startsWith(link.href)) ? 'scale-x-100' : 'scale-x-0'
                        )} />
                       </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                     {siteConfig.gestionNav.links.map((link) => {
                      const Icon = siteIcons.gestionNavLinks[link.title];
                      return (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{link.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
            </nav>
            <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {siteConfig.adminNav.links.map((link) => {
                       const Icon = siteIcons.adminNavLinks[link.title];
                       return (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{link.title}</span>
                          </Link>
                        </DropdownMenuItem>
                       )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <MobileNav />
        </div>
      </div>
    </motion.header>
  );
}

