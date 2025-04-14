// components/dashboard/RoleTableRow.tsx
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Role {
  name: string
  description: string
  users: number
  permissions: string
}

interface RoleTableRowProps {
  role: Role
  index: number
}

export default function RoleTableRow({ role, index }: RoleTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{role.name}</TableCell>
      <TableCell>{role.description}</TableCell>
      <TableCell>{role.users}</TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-gray-100">
          {role.permissions}
        </Badge>
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