"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableRowActions } from "./DataTableRowActions"
import { DataTableColumnHeader } from "@/components/gestion/DataTableColumnHeader"

export type PollColumn = {
  id: number
  question: string
  type: string
  match: string | null
  votes: number
}

export const columns: ColumnDef<PollColumn>[] = [
  {
    accessorKey: "question",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pregunta" />
    ),
    cell: ({ row }) => <div className="w-[300px] truncate">{row.getValue("question")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => <span>{row.getValue("type")}</span>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "match",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Partido Asociado" />
    ),
    cell: ({ row }) => <span>{row.getValue("match") || "N/A"}</span>,
  },
  {
    accessorKey: "votes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Votos" />
    ),
    cell: ({ row }) => <span>{row.getValue("votes")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
