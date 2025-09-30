
'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const tabs = ['Resumen', 'Estadísticas'];

export function PlayerInfoTabs() {
    const [activeTab, setActiveTab] = useState('Resumen');

    return (
        <div className="sticky top-[var(--header-height)] z-30 bg-card shadow-md">
            <div className="container mx-auto flex">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'flex-1 py-3 text-sm font-semibold text-center transition-colors',
                            activeTab === tab
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
