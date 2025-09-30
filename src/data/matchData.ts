
import { CheckCircle2, Circle, XCircle } from "lucide-react"

export const matchStatuses = [
  {
    value: "SCHEDULED",
    label: "Programado",
    icon: Circle,
  },
  {
    value: "LIVE",
    label: "En Vivo",
    icon: CheckCircle2,
  },
  {
    value: "FINISHED",
    label: "Finalizado",
    icon: XCircle,
  },
]
