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
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawalTransactions, setWithdrawalTransactions] = useState<any[]>([]);
  const [activeInvestors, setActiveInvestors] = useState<number>(0);
  const [unusedFunds, setUnusedFunds] = useState<number>(0);
  const [activePlans, setActivePlans] = useState<number>(0);
  const [sipPlans, setSipPlans] = useState<number>(0);
  const [lumpsumPlans, setLumpsumPlans] = useState<number>(0);
  const [aum, setAum] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchTransactions();
    fetchWithdrawalTransactions();
    fetchPendingVerifications();
    fetchActiveInvestors();
    fetchUnusedFunds();
    fetchActivePlans();
    fetchAum();
    fetchPendingRequests();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/get-deposit-transactions`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Fetched transactions:", response.data.transactions);
        setTransactions(response.data.transactions || []);
      } else {
        console.error(
          "Failed to fetch transactions:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchWithdrawalTransactions = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/get-withdrawal-transactions`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log(
          "Fetched withdrawal transactions:",
          response.data.transactions
        );
        setWithdrawalTransactions(response.data.transactions || []);
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

  const fetchPendingVerifications = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/get-users`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        // Filter for pending verifications
        const pendingUsers = response.data.users.filter(
          (user: any) => user.verificationState === "PENDING"
        );
        setPendingVerifications(pendingUsers);
      } else {
        console.error(
          "Failed to fetch verifications:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveInvestors = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/activeInvestors`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log('Active Investors:', response.data);
        setActiveInvestors(response.data.count || 0);
      } else {
        console.error(
          "Failed to fetch active investors:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching active investors:", error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data
        });
      }
    }
  };

  const fetchUnusedFunds = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/getUnusedFunds`,
        { withCredentials: true }
      );
      console.log("Unused funds data:", response.data);
      setUnusedFunds(response.data.funds?._sum?.availableBalance || 0);
    } catch (error) {
      console.error("Failed to fetch unused funds:", error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data
        });
      }
    }
  };

  const fetchActivePlans = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/activePlans`,
        { withCredentials: true }
      )
      console.log("Active plans data:", response.data)
      setActivePlans(response.data.totalPlans || 0)
      
      // Get counts from plansByType array
      const sipCount = response.data.plansByType.find(
        (plan: any) => plan.type === "SIP"
      )?._count?.type || 0
      const lumpsumCount = response.data.plansByType.find(
        (plan: any) => plan.type === "LUMPSUM"
      )?._count?.type || 0
      
      setSipPlans(sipCount)
      setLumpsumPlans(lumpsumCount)
    } catch (error) {
      console.error("Failed to fetch active plans:", error)
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data
        })
      }
    }
  }

  const fetchAum = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/aum`,
        { withCredentials: true }
      )
      console.log("AUM data:", response.data)
      setAum(response.data.assets._sum.investedAmount || 0)
    } catch (error) {
      console.error("Failed to fetch AUM:", error)
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data
        })
      }
    }
  }

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/pendingRequests`,
        { withCredentials: true }
      )
      console.log("Pending requests data:", response.data)
      setPendingRequests(response.data.totalPending || 0)
    } catch (error) {
      console.error("Failed to fetch pending requests:", error)
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data
        })
      }
    }
  }

  const handleApproveTransaction = async (
    transactionId: string,
    type: "deposit" | "withdrawal"
  ) => {
    try {
      // Validate transactionId
      if (!transactionId || typeof transactionId !== "string") {
        console.error("Invalid transaction ID:", transactionId);
        return;
      }

      console.log("Approving transaction:", { transactionId, type });

      const endpoint =
        type === "deposit"
          ? `${baseUrl}/api/v1/admin/add-funds`
          : `${baseUrl}/api/v1/admin/withdraw-funds`;

      const response = await axios.post(
        endpoint,
        {
          transactionsId: transactionId,
          status: "approved",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Transaction approved successfully:", transactionId);
        // Refresh the transactions list
        if (type === "deposit") {
          fetchTransactions();
        } else {
          fetchWithdrawalTransactions();
        }
      }
    } catch (error) {
      console.error("Error approving transaction:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          transactionId,
        });
      }
    }
  };

  const handleRejectTransaction = async (
    transactionId: string,
    type: "deposit" | "withdrawal"
  ) => {
    try {
      // Validate transactionId
      if (!transactionId || typeof transactionId !== "string") {
        console.error("Invalid transaction ID:", transactionId);
        return;
      }

      console.log("Rejecting transaction:", { transactionId, type });

      const endpoint =
        type === "deposit"
          ? `${baseUrl}/api/v1/admin/add-funds`
          : `${baseUrl}/api/v1/admin/withdraw-funds`;

      const response = await axios.post(
        endpoint,
        {
          transactionsId: transactionId,
          status: "reject",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Transaction rejected successfully:", transactionId);
        // Refresh the transactions list
        if (type === "deposit") {
          fetchTransactions();
        } else {
          fetchWithdrawalTransactions();
        }
      }
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          transactionId,
        });
      }
    }
  };

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Assets Under Management"
          value={`₹${aum.toLocaleString()}`}
          change="+15% from last month"
          icon={DollarSign}
          iconColor="text-[#AACF45]"
        />
        <StatsCard
          title="Active Investors"
          value={activeInvestors.toString()}
          change="+180 new this month"
          icon={Users}
          iconColor="text-[#08AFF1]"
        />
        <StatsCard
          title="Unused Funds"
          value={`₹${unusedFunds.toLocaleString()}`}
          change="Available for investment"
          icon={CreditCard}
          iconColor="text-[#AACF45]"
        />
        <StatsCard
          title="Active Plans"
          value={activePlans.toString()}
          change={`${sipPlans} SIP, ${lumpsumPlans} Lumpsum`}
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
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-gray-100">
                Pending Requests
              </Badge>
              <Badge className="bg-[#08AFF1] text-white">
                {pendingRequests}
              </Badge>
            </div>
          </div>

          <TabsContent value="verification" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verification Requests</CardTitle>
                <CardDescription>
                  Review and verify user documents.
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Loading verifications...
                        </TableCell>
                      </TableRow>
                    ) : pendingVerifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No pending verifications
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingVerifications.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[#08AFF1] text-white">
                                  {user.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {user.email}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Joined{" "}
                                  {new Date(
                                    user.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
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
                                onClick={() => setSelectedUserId(user.id)}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                className="bg-[#AACF45] hover:bg-[#9abe3a]"
                                onClick={async () => {
                                  try {
                                    const response = await axios.post(
                                      `${baseUrl}/api/v1/admin/verify-user/`,
                                      { userId: user.id, status: "approve" },
                                      { withCredentials: true }
                                    );
                                    if (response.status === 200) {
                                      fetchPendingVerifications();
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error verifying user:",
                                      error
                                    );
                                  }
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                className="bg-[#AACF45] hover:bg-[#9abe3a]"
                                onClick={async () => {
                                  try {
                                    const response = await axios.post(
                                      `${baseUrl}/api/v1/admin/verify-user/`,
                                      { userId: user.id, status: "rejected" },
                                      { withCredentials: true }
                                    );
                                    if (response.status === 200) {
                                      fetchPendingVerifications();
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error verifying user:",
                                      error
                                    );
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
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
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleApproveTransaction(
                                  transaction.id,
                                  "deposit"
                                )
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() =>
                                handleRejectTransaction(
                                  transaction.id,
                                  "deposit"
                                )
                              }
                            >
                              Reject
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
                    {withdrawalTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
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
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleApproveTransaction(
                                  transaction.id,
                                  "withdrawal"
                                )
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() =>
                                handleRejectTransaction(
                                  transaction.id,
                                  "withdrawal"
                                )
                              }
                            >
                              Reject
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
