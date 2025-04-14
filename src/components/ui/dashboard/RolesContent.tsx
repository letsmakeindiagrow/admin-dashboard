// components/dashboard/RolesContent.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import RoleTableRow from "./RoleTableRow"

export default function RolesContent() {
  const roles = [
    {
      name: "Administrator",
      description: "Full system access",
      users: 2,
      permissions: "All",
    },
    {
      name: "Manager",
      description: "Can manage users and investments",
      users: 5,
      permissions: "Users, Investments",
    },
    // More roles...
  ]

  const permissions = [
    {
      feature: "Dashboard",
      admin: true,
      manager: true,
      support: true,
      investor: false,
    },
    {
      feature: "User Management",
      admin: true,
      manager: true,
      support: true,
      investor: false,
    },
    // More permissions...
  ]

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Roles</h2>
        <Button className="bg-[#AACF45] hover:bg-[#9abe3a]">Add New Role</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Roles</CardTitle>
          <CardDescription>Configure user roles and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role, i) => (
                <RoleTableRow key={i} role={role} index={i} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>Configure what each role can access.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Administrator</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Support</TableHead>
                <TableHead>Investor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.feature}</TableCell>
                  <TableCell>
                    <Switch id={`admin-${i}`} checked={item.admin} />
                  </TableCell>
                  <TableCell>
                    <Switch id={`manager-${i}`} checked={item.manager} />
                  </TableCell>
                  <TableCell>
                    <Switch id={`support-${i}`} checked={item.support} />
                  </TableCell>
                  <TableCell>
                    <Switch id={`investor-${i}`} checked={item.investor} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}