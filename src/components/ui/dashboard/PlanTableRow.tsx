// components/ui/dashboard/PlanTableRow.tsx
"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Plan {
  name: string;
  roiAAR: number;
  roiAMR: number;
  minInvestment: number;
  investmentTerm: number;
  productType: string;
  status: string;
  type: string;
}

interface PlanTableRowProps {
  plan: Plan;
  index: number;
}

export default function PlanTableRow({ plan, index }: PlanTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{plan.name}</TableCell>
      <TableCell>{plan.roiAAR}%</TableCell>
      <TableCell>{(plan.roiAMR / 12).toFixed(2)}%</TableCell>
      <TableCell>₹{plan.minInvestment.toLocaleString()}</TableCell>
      <TableCell>{plan.investmentTerm}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={
            plan.type === "SIP"
              ? "bg-blue-50 text-blue-700"
              : "bg-purple-50 text-purple-700"
          }
        >
          {plan.type}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            id={`plan-status-${index}`}
            checked={plan.status === "ACTIVE"}
          />
          <Label htmlFor={`plan-status-${index}`} className="text-xs">
            {plan.status === "ACTIVE" ? "Active" : "Deactivated"}
          </Label>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
