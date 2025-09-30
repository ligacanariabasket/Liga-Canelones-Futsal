"use client"

import type { Season, SeasonTeam } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "../DataTableColumnHeader"

type SeasonWithTeams = Season & { teams: SeasonTeam[] }

export const columns: ColumnDef<SeasonWithTeams>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre de la Temporada" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Año" />
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("year")}</div>
    },
  },
  {
    accessorKey: "teams",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipos" />
    ),
    cell: ({ row }) => {
      const teams = row.original.teams;
      return <div className="text-center">{teams?.length || 0}</div>
    },
  },
]
