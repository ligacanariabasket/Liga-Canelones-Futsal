
import { 
    Home, 
    Newspaper, 
    CalendarDays, 
    Shield, 
    Users, 
    Trophy, 
    BarChart2, 
    Megaphone, 
    Youtube,
    Gamepad2,
    LayoutGrid,
    PenSquare,
    Wand2,
    PictureInPicture,
    LayoutDashboard,
    ListChecks,
    Wrench,
    BookUser,
    ChevronDown,
    Settings
} from "lucide-react";

export const siteConfig = {
    name: "Liga Canaria Futsal",
    description: "La plataforma definitiva para los amantes del futsal en la región.",
    mainNav: [
        {
            title: "Inicio",
            href: "/",
        },
        {
            title: "Noticias",
            href: "/blog",
        },
    ],
    infoNav: {
        links: [
            {
                title: "Partidos",
                href: "/partidos",
            },
            {
                title: "Clubes",
                href: "/clubes",
            },
            {
                title: "Jugadores",
                href: "/jugadores",
            },
            {
                title: "Posiciones",
                href: "/posiciones",
            },
            {
                title: "Resumen",
                href: "/resumen",
            },
            {
                title: "Hinchada",
                href: "/hinchada",
            },
            {
                title: "Videos",
                href: "/videos",
            },
        ]
    },
    adminNav: {
        links: [
            {
                title: 'Control de Partidos',
                href: '/controles',
            },
            {
                title: 'Pizarra Táctica',
                href: '/cancha',
            },
            {
                title: 'Ingreso Manual',
                href: '/ingreso-manual',
            },
            {
                title: 'Ingreso Simple',
                href: '/ingreso-simple',
            },
            {
                title: 'Banner en Vivo',
                href: '/banner',
            },
        ]
    },
    gestionNav: {
        links: [
            {
                title: 'Panel Principal',
                href: '/gestion',
            },
            {
                title: 'Partidos',
                href: '/gestion/partidos',
            },
            {
                title: 'Clubes',
                href: '/gestion/clubes',
            },
            {
                title: 'Jugadores',
                href: '/gestion/jugadores',
            },
            {
                title: 'Temporadas',
                href: '/gestion/temporadas',
            },
            {
                title: 'Configuración',
                href: '/gestion/configuracion',
            },
            {
                title: 'Blog',
                href: '/gestion/blog',
            },
            {
                title: 'Gestión Manual',
                href: '/gestion/gestion-manual',
            },
            {
                title: 'Crónicas',
                href: '/gestion/cronicas',
            },
            {
                title: 'Manual de Usuario',
                href: '/manual',
            },
        ]
    }
}

export const siteIcons = {
    mainNav: {
        'Inicio': Home,
        'Noticias': Newspaper,
    },
    infoNav: Trophy,
    infoNavLinks: {
        'Partidos': CalendarDays,
        'Clubes': Shield,
        'Jugadores': Users,
        'Posiciones': Trophy,
        'Resumen': BarChart2,
        'Hinchada': Megaphone,
        'Videos': Youtube
    },
    adminNav: Gamepad2,
    adminNavLinks: {
        'Control de Partidos': Gamepad2,
        'Pizarra Táctica': LayoutGrid,
        'Ingreso Manual': PenSquare,
        'Ingreso Simple': Wand2,
        'Banner en Vivo': PictureInPicture
    },
    gestionNav: ListChecks,
    gestionNavLinks: {
        'Panel Principal': LayoutDashboard,
        'Partidos': CalendarDays,
        'Clubes': Shield,
        'Jugadores': Users,
        'Temporadas': Trophy,
        'Configuración': Wrench,
        'Blog': Newspaper,
        'Gestión Manual': ListChecks,
        'Crónicas': PenSquare,
        'Manual de Usuario': BookUser
    }
}
