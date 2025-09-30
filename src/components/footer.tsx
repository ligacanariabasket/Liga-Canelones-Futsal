export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Liga Canelones Futsal. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
