// components/dashboard/UserTableRow.tsx
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  investment: number
  joined: string
  status: string
}

interface UserTableRowProps {
  user: User
}

export default function UserTableRow({ user }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#08AFF1] text-white">{`U${user.id}`}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-gray-100">
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>${user.investment.toLocaleString()}</TableCell>
      <TableCell>{user.joined}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge className={user.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
            {user.status}
          </Badge>
          {user.status === "Pending" && (
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <CheckCircle className="h-4 w-4 text-[#AACF45]" />
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}