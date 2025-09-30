
"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal, FileText, ArrowRight, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { FullMatch } from "@/types"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const match = row.original as FullMatch;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem asChild>
            <Link href={`/ingreso-manual/${match.id}`}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Ingresar Datos
            </Link>
        </DropdownMenuItem>
         <DropdownMenuItem asChild>
            <Link href={`/gestion/gestion-manual/edit/${match.seasonId}`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Fixture
            </Link>
        </DropdownMenuItem>
        {match.status === 'FINISHED' && (
             <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Crónica
                </DropdownMenuItem>
             </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
