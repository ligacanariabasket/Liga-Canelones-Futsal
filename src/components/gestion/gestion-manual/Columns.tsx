
"use client"

import type { FullMatch } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "../DataTableColumnHeader"
import Image from "next/image"
import { DataTableRowActions } from "./DataTableRowActions"


const statusVariantMap: Record<FullMatch['status'], 'default' | 'destructive' | 'secondary'> = {
  SCHEDULED: 'secondary',
  LIVE: 'destructive',
  FINISHED: 'default',
  SELECTING_STARTERS: 'secondary',
  POSTPONED: 'secondary',
  IN_PROGRESS: 'destructive'
};

const statusTextMap: Record<FullMatch['status'], string> = {
    SCHEDULED: 'Programado',
    LIVE: 'En Vivo',
    FINISHED: 'Finalizado',
    SELECTING_STARTERS: 'Def. Titulares',
    POSTPONED: 'Pospuesto',
    IN_PROGRESS: 'En Progreso'
};

export const columns: ColumnDef<FullMatch>[] = [
  {
    accessorKey: "teamA",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Partido" />
    ),
    cell: ({ row }) => {
      const { teamA, teamB, scoreA, scoreB } = row.original;
      return (
        <div className="flex items-center gap-2 font-medium">
            <Image src={teamA.logoUrl || '/logofu.svg'} alt={teamA.name} width={24} height={24} className="rounded-full" />
            <span className="truncate max-w-[120px]">{teamA.name}</span>
            <span className="text-muted-foreground">{scoreA} - {scoreB}</span>
            <span className="truncate max-w-[120px]">{teamB.name}</span>
            <Image src={teamB.logoUrl || '/logofu.svg'} alt={teamB.name} width={24} height={24} className="rounded-full" />
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "scheduledTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("scheduledTime"));
      const formatted = date.toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC' });
      return <div className="text-muted-foreground">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as FullMatch['status'];
      return (
        <Badge variant={statusVariantMap[status]}>
            {statusTextMap[status]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
