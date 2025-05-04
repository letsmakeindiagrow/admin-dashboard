import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PlanTableRow from "./PlanTableRow";
import { useState, useEffect } from "react";
import AddInvestmentPlan from "./AddInvestmentPlan";
import axios from "axios";

export default function InvestmentContent() {
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  const fetchInvestmentPlans = async () => {
    try {
      // const baseUrl = import.meta.env.VITE_BASE_URL;
      // if (!baseUrl) {
      //   console.error("API base URL is not defined in environment variables.");
      //   return;
      // }
      const response = await axios.get(`/api/v1/admin/get-investment-plans`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        // Assuming the backend returns { investmentPlans: [...] }
        setPlans(response.data.investmentPlans || []);
      } else {
        console.error("Failed to fetch plans:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error fetching investment plans:", error);
      // Optionally: handle specific errors like 401 Unauthorized
    }
  };

  // Fetch plans when the component mounts
  useEffect(() => {
    fetchInvestmentPlans();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleAddPlan = async (newPlanData: any) => {
    const planToSend = {
      name: newPlanData.productName,
      roiAAR: parseFloat(newPlanData.roiAAR),
      roiAMR: parseFloat(newPlanData.roiAMR),
      minInvestment: parseFloat(newPlanData.minInvestment),
      investmentTerm: parseFloat(newPlanData.investmentTerm),
      type: newPlanData.productType,
      status: newPlanData.status,
    };

    try {
      // const baseUrl = import.meta.env.VITE_BASE_URL;
      // if (!baseUrl) {
      //   console.error("API base URL is not defined in environment variables.");
      //   return;
      // }
      const response = await axios.post(
        `/api/v1/admin/create-investment-plan`,
        planToSend,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Fetch the updated list of plans from the backend
        await fetchInvestmentPlans();
        setShowAddPlan(false); // Close the modal
      } else {
        console.error("Failed to add plan:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error submitting investment plan:", error);
    }
  };

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Investment Plans</h2>
        <Button
          className="bg-[#AACF45] hover:bg-[#9abe3a]"
          onClick={() => setShowAddPlan(true)}
        >
          Add New Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Investment Plans</CardTitle>
          <CardDescription>
            View and manage all investment plans here.
          </CardDescription>
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

      {showAddPlan && (
        <AddInvestmentPlan
          onClose={() => setShowAddPlan(false)}
          onSubmit={handleAddPlan}
        />
      )}
    </main>
  );
}
