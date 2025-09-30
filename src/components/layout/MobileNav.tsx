
'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { siteConfig, siteIcons } from '@/config/site'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { motion, Variants } from 'framer-motion'
import { Separator } from '../ui/separator'
import { FutsalBallIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '../icons'
import { ScrollArea } from '../ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const NavLink = ({ href, title, icon: Icon, onClick }: { href: string; title: string; icon: React.ElementType, onClick: () => void }) => (
    <motion.div variants={staggerItem}>
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-4 rounded-md p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{title}</span>
        </Link>
    </motion.div>
);

const NavAccordion = ({ title, links, icon: Icon, linkIcons, onLinkClick }: { title: string; links: {href:string, title:string}[]; icon: React.ElementType, linkIcons: Record<string, React.ElementType>, onLinkClick: () => void }) => (
     <motion.div variants={staggerItem}>
        <AccordionItem value={title} className="border-b-0">
            <AccordionTrigger className="flex items-center justify-start gap-4 rounded-md p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:no-underline">
                <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{title}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-6">
                <div className="flex flex-col gap-1">
                    {links.map((item) => {
                      const LinkIcon = linkIcons[item.title as keyof typeof linkIcons];
                      return <NavLink key={item.href} {...item} icon={LinkIcon} onClick={onLinkClick} />
                    })}
                </div>
            </AccordionContent>
        </AccordionItem>
     </motion.div>
);


export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader className="border-b p-4">
            <VisuallyHidden>
                <SheetTitle>Menú de Navegación</SheetTitle>
            </VisuallyHidden>
            <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
            >
                <FutsalBallIcon className="h-6 w-6" />
                <span className="font-bold font-orbitron">{siteConfig.name}</span>
            </Link>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
            <motion.div 
                className="flex flex-col gap-2 p-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                 <Accordion type="multiple" className="w-full">
                    <div className="flex flex-col gap-1">
                        {siteConfig.mainNav.map((item) => {
                          const Icon = siteIcons.mainNav[item.title as keyof typeof siteIcons.mainNav];
                          return <NavLink key={item.href} {...item} icon={Icon} onClick={() => setOpen(false)} />
                        })}
                    </div>
                    <Separator className="my-2"/>
                    <NavAccordion title="Competición" icon={siteIcons.infoNav} links={siteConfig.infoNav.links} linkIcons={siteIcons.infoNavLinks} onLinkClick={() => setOpen(false)} />
                    <NavAccordion title="Gestión" icon={siteIcons.gestionNav} links={siteConfig.gestionNav.links} linkIcons={siteIcons.gestionNavLinks} onLinkClick={() => setOpen(false)} />
                     <NavAccordion title="Admin" icon={siteIcons.adminNav} links={siteConfig.adminNav.links} linkIcons={siteIcons.adminNavLinks} onLinkClick={() => setOpen(false)} />
                </Accordion>
            </motion.div>
        </ScrollArea>
        
        <div className="border-t p-4">
            <div className="flex items-center justify-center gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><InstagramIcon className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><FacebookIcon className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><YoutubeIcon className="h-6 w-6" /></Link>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
