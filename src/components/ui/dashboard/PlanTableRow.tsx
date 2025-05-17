// components/ui/dashboard/PlanTableRow.tsx
"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Plan {
  name: string;
  roiAAR: number;
  roiAMR: number;
  minInvestment: number;
  investmentTerm: number;
  productType: string;
  status: string;
  type: string;
  id: string;
}

interface PlanTableRowProps {
  plan: Plan;
  index: number;
  onDelete: () => void;
  onStatusChange: () => void;
}

export default function PlanTableRow({ plan, index, onDelete, onStatusChange }: PlanTableRowProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFields, setEditFields] = useState({
    name: plan.name,
    roiAAR: plan.roiAAR,
    roiAMR: plan.roiAMR,
    minInvestment: plan.minInvestment,
    investmentTerm: plan.investmentTerm,
  });
  const [editError, setEditError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/deletePlan/${plan.id}`, {
        withCredentials: true,
      });
      setShowDeleteModal(false);
      onDelete();
    } catch (error) {
      console.error("Error deleting investment plan:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusToggle = () => {
    const newStatus = plan.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
    setPendingStatus(newStatus);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;
    setStatusLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/planStatus`,
        {
          planId: plan.id,
          status: pendingStatus,
        },
        { withCredentials: true }
      );
      setShowStatusModal(false);
      setPendingStatus(null);
      onStatusChange();
    } catch (error) {
      console.error("Error updating plan status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    setEditError(null);
    setEditLoading(true);
    // Validation
    if (!editFields.name.trim()) {
      setEditError('Product Name is required.');
      setEditLoading(false);
      return;
    }
    if (
      isNaN(Number(editFields.roiAAR)) ||
      isNaN(Number(editFields.roiAMR)) ||
      isNaN(Number(editFields.minInvestment)) ||
      isNaN(Number(editFields.investmentTerm))
    ) {
      setEditError('ROI (AAR), ROI (AMR), Min Investment, and Investment Term must be valid numbers.');
      setEditLoading(false);
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/edit-investment-plan`,
        {
          planId: plan.id,
          name: editFields.name,
          roiAAR: Number(editFields.roiAAR),
          roiAMR: Number(editFields.roiAMR),
          minInvestment: Number(editFields.minInvestment),
          investmentTerm: Number(editFields.investmentTerm),
        },
        { withCredentials: true }
      );
      setShowEditModal(false);
      onStatusChange();
    } catch (error: any) {
      setEditError(
        error?.response?.data?.message || 'Error editing investment plan.'
      );
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
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
              onCheckedChange={handleStatusToggle}
            />
            <Label htmlFor={`plan-status-${index}`} className="text-xs">
              {plan.status === "ACTIVE" ? "Active" : "Deactivated"}
            </Label>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the investment plan "{plan.name}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-700 text-white" onClick={handleDelete} disabled={deleting}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to {pendingStatus === "ACTIVE" ? "activate" : "deactivate"} the investment plan "{plan.name}"?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusModal(false)} disabled={statusLoading}>
              Cancel
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-700 text-white" onClick={confirmStatusChange} disabled={statusLoading}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Investment Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor={`edit-name-${plan.id}`}>Product Name</Label>
              <Input
                id={`edit-name-${plan.id}`}
                name="name"
                value={editFields.name}
                onChange={handleEditChange}
                placeholder="Product Name"
              />
            </div>
            <div>
              <Label htmlFor={`edit-roiAAR-${plan.id}`}>ROI (AAR)</Label>
              <Input
                id={`edit-roiAAR-${plan.id}`}
                name="roiAAR"
                type="number"
                value={editFields.roiAAR}
                onChange={handleEditChange}
                placeholder="ROI (AAR)"
              />
            </div>
            <div>
              <Label htmlFor={`edit-roiAMR-${plan.id}`}>ROI (AMR)</Label>
              <Input
                id={`edit-roiAMR-${plan.id}`}
                name="roiAMR"
                type="number"
                value={editFields.roiAMR}
                onChange={handleEditChange}
                placeholder="ROI (AMR)"
              />
            </div>
            <div>
              <Label htmlFor={`edit-minInvestment-${plan.id}`}>Min Investment</Label>
              <Input
                id={`edit-minInvestment-${plan.id}`}
                name="minInvestment"
                type="number"
                value={editFields.minInvestment}
                onChange={handleEditChange}
                placeholder="Min Investment"
              />
            </div>
            <div>
              <Label htmlFor={`edit-investmentTerm-${plan.id}`}>Investment Term (Years)</Label>
              <Input
                id={`edit-investmentTerm-${plan.id}`}
                name="investmentTerm"
                type="number"
                value={editFields.investmentTerm}
                onChange={handleEditChange}
                placeholder="Investment Term"
              />
            </div>
          </div>
          {editError && (
            <div className="text-red-600 text-sm mb-2">{editError}</div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={editLoading}>
              Cancel
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-700 text-white" onClick={handleEditSubmit} disabled={editLoading}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
