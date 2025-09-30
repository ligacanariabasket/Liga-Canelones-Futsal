
"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { FullMatch, MatchStatus } from "@/types"
import { updateMatchStatus } from "@/actions/match-actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const match = row.original as FullMatch
  const { toast } = useToast()
  const router = useRouter()

  const handleChangeStatus = async (status: MatchStatus) => {
    try {
      await updateMatchStatus(match.id, status)
      toast({
        title: "Estado actualizado",
        description: `El partido ahora está ${status}.`,
      })
      router.refresh()
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del partido.",
      })
    }
  }

  return (
     <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Acciones</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-[160px]">
          {match.status === 'SCHEDULED' && (
            <DropdownMenuItem onClick={() => handleChangeStatus('LIVE')}>
              Marcar como En Vivo
            </DropdownMenuItem>
          )}
          {match.status === 'LIVE' && (
            <DropdownMenuItem onClick={() => handleChangeStatus('FINISHED')}>
              Marcar como Finalizado
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleChangeStatus('SCHEDULED')}>
              Marcar como Programado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
