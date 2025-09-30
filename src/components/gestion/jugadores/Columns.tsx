
"use client"

import type { Player, Team } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "../DataTableColumnHeader"
import Image from "next/image"
import { DataTableRowActions } from "./DataTableRowActions"

type PlayerWithTeam = Player & { team?: Team };

export const columns: ColumnDef<PlayerWithTeam>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jugador" />
    ),
    cell: ({ row }) => {
      const player = row.original;
      return (
        <div className="flex items-center gap-3">
             <Image 
                src={player.avatarUrl || '/avatar/1.png'} 
                alt={`Avatar de ${player.name}`} 
                width={32} 
                height={32} 
                className="rounded-full aspect-square object-cover"
            />
            <span className="font-medium">{player.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "team",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipo" />
    ),
    cell: ({ row }) => {
      const team = row.original.team;
      if (!team) return null;
      
      return (
        <div className="flex items-center gap-2">
            <Image src={team.logoUrl || '/logofu.svg'} alt={`Logo de ${team.name}`} width={24} height={24} className="rounded-full" />
            <span>{team.name}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
        const team = row.original.team;
        if (!team) return false;
        return value.includes(team.id);
    },
  },
   {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posición" />
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("position")}</div>
    },
  },
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nº" />
    ),
    cell: ({ row }) => {
      return <div className="text-center font-bold">{row.getValue("number")}</div>
    },
  },
    {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
