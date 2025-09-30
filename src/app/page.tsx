import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { NewsSummarizer } from "@/components/news-summarizer";

const newsArticles = [
  {
    id: 1,
    title: "Gran victoria en el clásico",
    summary:
      "El equipo local se impuso con un contundente 5-2 en un partido vibrante lleno de emoción y grandes jugadas.",
    image: PlaceHolderImages.find((img) => img.id === "futsal-1"),
  },
  {
    id: 2,
    title: "Nuevo fichaje estrella para la temporada",
    summary:
      "Se anuncia la incorporación de un jugador de renombre internacional que promete cambiar el rumbo del equipo.",
    image: PlaceHolderImages.find((img) => img.id === "futsal-2"),
  },
  {
    id: 3,
    title: "El calendario de la próxima temporada ya está aquí",
    summary:
      "Conoce las fechas y los enfrentamientos clave de la nueva temporada que se avecina. ¡No te pierdas ni un solo partido!",
    image: PlaceHolderImages.find((img) => img.id === "futsal-3"),
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-24 text-center lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="font-headline text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              LIGA CANELONES FUTSAL
            </h1>
            <p className="text-lg text-foreground/80 md:text-xl">
              La pasión del futsal en el corazón de Canelones. Sigue a tu
              equipo, consulta los resultados y no te pierdas ninguna noticia.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/partidos">Ver Partidos</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/posiciones">Tabla de Posiciones</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-card py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Últimas Noticias
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Mantente al día con las últimas novedades del campeonato.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsArticles.map((article) => (
              <Card
                key={article.id}
                className="flex transform flex-col overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-primary/20"
              >
                {article.image && (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={article.image.imageUrl}
                      alt={article.image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={article.image.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/80">{article.summary}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="h-auto p-0" asChild>
                    <Link href="#">
                      Leer más <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Summarizer Section */}
      <NewsSummarizer />
    </>
  );
}
