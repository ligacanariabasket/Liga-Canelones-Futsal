
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Términos de Servicio"
          description="Reglas para el uso de nuestra plataforma."
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
                <h2>1. Aceptación de los Términos</h2>
                <p>
                    Al acceder y utilizar el sitio web de la Liga Canelones Futsal, aceptas estar sujeto a estos
                    Términos de Servicio y a todas las leyes y regulaciones aplicables. Si no estás de acuerdo
                    con alguno de estos términos, tienes prohibido usar o acceder a este sitio.
                </p>

                <h2>2. Uso de la Licencia</h2>
                <p>
                    Se concede permiso para ver temporalmente los materiales (información o software) en el sitio web
                    de la Liga Canelones Futsal solo para visualización transitoria personal y no comercial. Esta es
                    la concesión de una licencia, no una transferencia de título.
                </p>

                <h2>3. Conducta del Usuario</h2>
                <p>
                    Eres responsable de tu propia conducta y de cualquier contenido que crees, transmitas o muestres
                    mientras usas los Servicios. Aceptas no utilizar el servicio para ningún propósito ilegal o no
                    autorizado. Los administradores con acceso al panel de control se comprometen a ingresar
                    información veraz y precisa sobre los partidos.
                </p>
                
                <h2>4. Limitaciones</h2>
                <p>
                    En ningún caso la Liga Canelones Futsal o sus proveedores serán responsables de los daños
                    (incluidos, entre otros, los daños por pérdida de datos o beneficios, o por interrupción del
                    negocio) que surjan del uso o la imposibilidad de usar los materiales en el sitio web.
                </p>

                <h2>5. Modificaciones</h2>
                <p>
                    La Liga Canelones Futsal puede revisar estos términos de servicio para su sitio web en cualquier
                    momento sin previo aviso. Al usar este sitio web, aceptas estar sujeto a la versión actual de
                    estos Términos de Servicio.
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
