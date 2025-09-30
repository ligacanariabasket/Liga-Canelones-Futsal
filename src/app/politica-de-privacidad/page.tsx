
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Política de Privacidad"
          description="Tu privacidad es importante para nosotros."
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
                <h2>1. Información que recopilamos</h2>
                <p>
                    Recopilamos información para proporcionar y mejorar nuestros servicios. Esto puede incluir:
                    información que nos proporcionas directamente (por ejemplo, al registrarte),
                    información que obtenemos de tu uso de nuestros servicios (como datos de partidos, estadísticas de jugadores),
                    e información de análisis sobre el uso del sitio web.
                </p>

                <h2>2. Cómo usamos la información</h2>
                <p>
                    Utilizamos la información que recopilamos para operar, mantener y mejorar nuestros servicios.
                    Esto incluye la visualización de resultados de partidos, estadísticas, noticias y la gestión de los
                    controles administrativos de la liga. No compartimos tu información personal con empresas,
                    organizaciones o individuos fuera de la Liga Canelones Futsal sin tu consentimiento.
                </p>

                <h2>3. Cookies</h2>
                <p>
                    Utilizamos cookies y tecnologías similares para recopilar información sobre tu interacción con nuestro
                    sitio web y para recordar tus preferencias. Por ejemplo, usamos cookies para mantener tu sesión iniciada
                    en el panel de administración. Puedes configurar tu navegador para rechazar todas las cookies o para
                    indicar cuándo se está enviando una cookie.
                </p>
                
                <h2>4. Seguridad de la Información</h2>
                <p>
                    Trabajamos para proteger a la Liga Canelones Futsal y a nuestros usuarios del acceso no autorizado o
                    de cualquier alteración, divulgación o destrucción no autorizada de la información que poseemos.
                    Sin embargo, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro.
                </p>

                <h2>5. Cambios en esta política</h2>
                <p>
                    Nuestra Política de Privacidad puede cambiar de vez en cuando. Publicaremos cualquier cambio en
                    esta página y, si los cambios son significativos, proporcionaremos un aviso más destacado.
                </p>

                <p className="text-sm text-muted-foreground mt-8">
                    Última actualización: 31 de Agosto de 2025
                </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
