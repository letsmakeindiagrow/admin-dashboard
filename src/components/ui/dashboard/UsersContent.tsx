// components/dashboard/UsersContent.tsx
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import UserTableRow from "./UserTableRow"

export default function UsersContent() {
  const users = Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i === 0 ? "Admin" : i === 1 ? "Manager" : "Investor",
    investment: (i + 1) * 2500,
    joined: `${(i + 1) * 2} months ago`,
    status: (i + 1) % 3 === 0 ? "Pending" : "Verified"
  }))

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Management</h2>
        <Button className="bg-[#AACF45] hover:bg-[#9abe3a]">Add New User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage all users from this panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Search users..." className="w-[250px]" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All Users</DropdownMenuItem>
                  <DropdownMenuItem>Active Users</DropdownMenuItem>
                  <DropdownMenuItem>Inactive Users</DropdownMenuItem>
                  <DropdownMenuItem>Verified Users</DropdownMenuItem>
                  <DropdownMenuItem>Unverified Users</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Investments</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserTableRow key={user.id} user={user} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}