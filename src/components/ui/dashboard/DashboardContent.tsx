// components/dashboard/DashboardContent.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StatsCard from "./StatsCard"
import { DollarSign, Users, BarChart3, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DashboardContent() {
  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Assets Under Management" 
          value="$12,546,000" 
          change="+15% from last month" 
          icon={DollarSign} 
          iconColor="text-[#AACF45]" 
        />
        <StatsCard 
          title="Active Investors" 
          value="2,350" 
          change="+180 new this month" 
          icon={Users} 
          iconColor="text-[#08AFF1]" 
        />
        <StatsCard 
          title="Pending Requests" 
          value="42" 
          change="12 verification, 30 funds" 
          icon={BarChart3} 
          iconColor="text-[#AACF45]" 
        />
        <StatsCard 
          title="Active Plans" 
          value="15" 
          change="8 SIP, 7 Lumpsum" 
          icon={CreditCard} 
          iconColor="text-[#08AFF1]" 
        />
      </div>

      <div className="mt-6">
        <Tabs defaultValue="verification">
          <div className="flex items-center justify-between">
            <TabsList className="bg-[#f5f5f5]">
              <TabsTrigger value="verification" className="data-[state=active]:bg-[#08AFF1] data-[state=active]:text-white">
                User Verification
              </TabsTrigger>
              <TabsTrigger value="fund-add" className="data-[state=active]:bg-[#08AFF1] data-[state=active]:text-white">
                Fund Add
              </TabsTrigger>
              <TabsTrigger value="withdrawal" className="data-[state=active]:bg-[#08AFF1] data-[state=active]:text-white">
                Fund Withdrawal
              </TabsTrigger>
            </TabsList>
            <Button className="bg-[#AACF45] hover:bg-[#9abe3a]">View All Requests</Button>
          </div>

          <TabsContent value="verification" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verification Requests</CardTitle>
                <CardDescription>Manage user verification requests here.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-[#08AFF1] text-white">{`U${i}`}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">User {i}</p>
                              <p className="text-xs text-gray-500">user{i}@example.com</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{`${i} day${i > 1 ? "s" : ""} ago`}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-100">
                            ID + Address
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button size="sm" className="bg-[#AACF45] hover:bg-[#9abe3a]">
                              Approve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents would go here */}
        </Tabs>
      </div>
    </main>
  )
}