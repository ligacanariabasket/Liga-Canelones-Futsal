import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <FutsalIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold text-foreground">
            Liga Futsal
          </span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/partidos">Partidos</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/posiciones">Posiciones</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function FutsalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 12.152v-2.7a.45.45 0 0 1 .45-.45h2.7a.45.45 0 0 1 .45.45v2.7a.45.45 0 0 1-.45.45h-2.7a.45.45 0 0 1-.45-.45Z" />
      <path d="m13.297 5.234 3.927 1.487a.932.932 0 0 1 .576.873v5.19a.932.932 0 0 1-.576.873l-3.927 1.487a.93.93 0 0 1-1.094-.31L9.16 11.23a.932.932 0 0 1 0-1.24l3.043-4.446a.93.93 0 0 1 1.094-.31Z" />
      <path d="M4.243 18.364s.385-2 .77-2c.385 0 .77 2 .77 2" />
      <path d="M12 18.364s.385-2 .77-2c.385 0 .77 2 .77 2" />
      <path d="m5.5 16.364 2.5-3.5" />
      <path d="m11 16.364-2-3" />
      <path d="m6.5 12.364 2.5 3" />
      <path d="m12 12.364-3 4" />
      <path d="M5.186 10.364a.5.5 0 1 0-.372-.864.5.5 0 0 0 .372.864Z" />
      <path d="M3 14.364s.385-2 .77-2c.385 0 .77 2 .77 2" />
    </svg>
  )
}
