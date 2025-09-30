
'use client';

import { RotateCcw, Undo2, Redo2, Move, Star, Settings, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ToolbarButton = ({ icon: Icon, label, isActive = false }: { icon: React.ElementType, label: string, isActive?: boolean }) => (
    <Button variant="ghost" className={cn("flex flex-col items-center h-auto text-white hover:bg-gray-600/50 hover:text-white p-2 rounded-lg", isActive && "bg-green-500/20 text-green-400")}>
        <Icon className="h-6 w-6" />
        <span className="text-xs mt-1">{label}</span>
    </Button>
)

export function ActionsToolbar() {
    const actions = [
        { icon: RotateCcw, label: 'Reset' },
        { icon: Undo2, label: 'Undo' },
        { icon: Redo2, label: 'Redo' },
        { icon: Move, label: 'Move' },
        { icon: LayoutGrid, label: 'Board', isActive: true },
        { icon: Star, label: 'Save' },
        { icon: Settings, label: 'Settings' }
    ]
  return (
    <footer className="flex items-center justify-center p-2 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
        <div className="flex items-center gap-2 bg-gray-900/70 p-2 rounded-xl shadow-lg">
            {actions.map(action => (
                <ToolbarButton key={action.label} {...action} />
            ))}
        </div>
    </footer>
  );
}
