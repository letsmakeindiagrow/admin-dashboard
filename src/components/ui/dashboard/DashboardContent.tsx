// components/dashboard/DashboardContent.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatsCard from "./StatsCard";
import { DollarSign, Users, BarChart3, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import axios from "axios";

function DocumentViewer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}) {
  if (!isOpen) return null;

  // Hardcoded AWS links for demo
  const documents = {
    panCard: "https://example-aws-link.com/pan-card.pdf",
    aadharFront: "https://example-aws-link.com/aadhar-front.pdf",
    aadharBack: "https://example-aws-link.com/aadhar-back.pdf",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User Documents</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">PAN Card</h3>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open(documents.panCard, "_blank")}
            >
              View PAN Card
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Aadhar Card</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open(documents.aadharFront, "_blank")}
              >
                Front Side
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open(documents.aadharBack, "_blank")}
              >
                Back Side
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  useEffect(() => {
    fetchTransactions();
    fetchWithdrawalTransactions();
  }, []);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawalTransactions, setWithdrawalTransactions] = useState<any[]>(
    []
  );

  const fetchTransactions = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      if (!baseUrl) {
        console.error("API base URL is not defined in environment variables.");
        return;
      }
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/get-deposit-transactions`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setTransactions(response.data.transactions || []);
        console.log(response.data.transactions);
      } else {
        console.error(
          "Failed to fetch transactions:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Optionally: handle specific errors like 401 Unauthorized
    }
  };

  const fetchWithdrawalTransactions = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      if (!baseUrl) {
        console.error("API base URL is not defined in environment variables.");
        return;
      }
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/get-withdrawal-transactions`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setWithdrawalTransactions(response.data.transactions || []);
        console.log(response.data.transactions);
      } else {
        console.error(
          "Failed to fetch withdrawal transactions:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching withdrawal transactions:", error);
    }
  };

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Assets Under Management"
          value="₹12,546,000"
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
              <TabsTrigger
                value="verification"
                className="data-[state=active]:bg-[#08AFF1] data-[state=active]:text-white"
              >
                User Verification
              </TabsTrigger>
              <TabsTrigger
                value="fund-add"
                className="data-[state=active]:bg-[#08AFF1] data-[state=active]:text-white"
              >
                Fund Add
              </TabsTrigger>
              <TabsTrigger
                value="withdrawal"
                className="data-[state=active]:bg-[#08AFF1] data-[state=active]:text-white"
              >
                Fund Withdrawal
              </TabsTrigger>
            </TabsList>
            <Button className="bg-[#AACF45] hover:bg-[#9abe3a]">
              View All Requests
            </Button>
          </div>

          <TabsContent value="verification" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verification Requests</CardTitle>
                <CardDescription>
                  Manage user verification requests here.
                </CardDescription>
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
                              <p className="text-xs text-gray-500">
                                user{i}@example.com
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{`${i} day${
                          i > 1 ? "s" : ""
                        } ago`}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-100">
                            ID + Address
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-800">
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUserId(i)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#AACF45] hover:bg-[#9abe3a]"
                            >
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

          <TabsContent value="fund-add" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Fund Addition Requests</CardTitle>
                <CardDescription>
                  Manage fund addition requests here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* @ts-ignore */}
                    {transactions.map((transaction, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {transaction.user.email}
                        </TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.method}</TableCell>
                        <TableCell>{transaction.referenceNumber}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.remark}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawal" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
                <CardDescription>
                  Manage fund withdrawal requests here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* @ts-ignore */}
                    {withdrawalTransactions.map((transaction, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {transaction.user.email}
                        </TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DocumentViewer
        isOpen={selectedUserId !== null}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId || 0}
      />
    </main>
  );
}
