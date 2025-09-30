
"use client"

import type { Team } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "../DataTableColumnHeader"
import { DataTableRowActions } from "./DataTableRowActions"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"

export const columns: ColumnDef<Team>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
          ? true
          : table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "logoUrl",
    header: "Logo",
    cell: ({ row }) => {
      const logoUrl = row.original.logoUrl;
      const name = row.original.name;
      return <Image src={logoUrl || '/logofu.svg'} alt={`Logo de ${name}`} width={32} height={32} className="rounded-full aspect-square object-contain" />
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre del Club" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
    {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => {
      return <div className="text-muted-foreground font-mono text-xs">{row.getValue("slug")}</div>
    },
  },
  {
    accessorKey: "players",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jugadores" />
    ),
    cell: ({ row }) => {
      const players = row.original.players;
      return <div className="text-center">{players?.length || 0}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
