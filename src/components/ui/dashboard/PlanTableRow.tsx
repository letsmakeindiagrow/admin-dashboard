// components/ui/dashboard/PlanTableRow.tsx
"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface Plan {
  name: string
  roi: number
  min: number
  term: number
  type: string
  active: boolean
}

interface PlanTableRowProps {
  plan: Plan
  index: number
}

export default function PlanTableRow({ plan, index }: PlanTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{plan.name}</TableCell>
      <TableCell>{plan.roi}%</TableCell>
      <TableCell>{(plan.roi / 12).toFixed(2)}%</TableCell>
      <TableCell>₹{plan.min.toLocaleString()}</TableCell>
      <TableCell>{plan.term}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={
            plan.type === "SIP" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
          }
        >
          {plan.type}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch id={`plan-status-${index}`} checked={plan.active} />
          <Label htmlFor={`plan-status-${index}`} className="text-xs">
            {plan.active ? "Active" : "Inactive"}
          </Label>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}