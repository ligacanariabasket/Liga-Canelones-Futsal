
'use client';

import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import { Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


export function ManualEntryActions() {
    const { state } = useGame();
    const router = useRouter();

    const onSave = async () => {
        // Now this button just navigates to the confirmation page
        router.push(`/ingreso-manual/${state.matchId}/confirmar`);
    }

    return (
        <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.push('/ingreso-manual')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Salir
            </Button>
            <Button onClick={onSave} >
                <Save className="mr-2 h-4 w-4" />
                Revisar y Guardar Datos
            </Button>
        </div>
    );
}
