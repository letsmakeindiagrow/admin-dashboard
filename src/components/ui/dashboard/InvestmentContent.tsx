// components/dashboard/InvestmentContent.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PlanTableRow from "./PlanTableRow"

export default function InvestmentContent() {
  const plans = [
    {
      name: "Growth Fund",
      roi: 12,
      min: 5000,
      term: 5,
      type: "SIP",
      active: true,
    },
    {
      name: "Balanced Portfolio",
      roi: 8.5,
      min: 10000,
      term: 3,
      type: "Lumpsum",
      active: true,
    },
    // More plans...
  ]

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Investment Plans</h2>
        <Button className="bg-[#AACF45] hover:bg-[#9abe3a]">Add New Plan</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Investment Plans</CardTitle>
          <CardDescription>View and manage all investment plans here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Search plans..." className="w-[250px]" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All Plans</DropdownMenuItem>
                  <DropdownMenuItem>SIP Only</DropdownMenuItem>
                  <DropdownMenuItem>Lumpsum Only</DropdownMenuItem>
                  <DropdownMenuItem>Active Only</DropdownMenuItem>
                  <DropdownMenuItem>Inactive Only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>ROI (AAR)</TableHead>
                <TableHead>ROI (AMR)</TableHead>
                <TableHead>Min Investment</TableHead>
                <TableHead>Term (Years)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan, i) => (
                <PlanTableRow key={i} plan={plan} index={i} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}