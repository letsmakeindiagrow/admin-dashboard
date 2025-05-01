import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddInvestmentPlanProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function AddInvestmentPlan({
  onClose,
  onSubmit,
}: AddInvestmentPlanProps) {
  const [formData, setFormData] = useState({
    productName: "",
    roiAAR: "",
    minInvestment: "",
    investmentTerm: "",
    productType: "SIP",
    status: "ACTIVE",
  });

  const calculateTotalGain = () => {
    const investment = parseFloat(formData.minInvestment) || 0;
    const roi = parseFloat(formData.roiAAR) || 0;
    const term = parseFloat(formData.investmentTerm) || 0;
    return ((investment * roi * term) / 100).toFixed(2);
  };

  const calculateMaturityValue = () => {
    const investment = parseFloat(formData.minInvestment) || 0;
    const totalGain = parseFloat(calculateTotalGain());
    return (investment + totalGain).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      roiAMR: (parseFloat(formData.roiAAR) / 12).toFixed(2),
      totalGain: calculateTotalGain(),
      maturityValue: calculateMaturityValue(),
    };
    onSubmit(data);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Investment Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roiAAR">ROI (AAR) %</Label>
              <Input
                id="roiAAR"
                type="number"
                step="0.01"
                value={formData.roiAAR}
                onChange={(e) =>
                  setFormData({ ...formData, roiAAR: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>ROI (AMR) %</Label>
              <Input
                value={(parseFloat(formData.roiAAR) / 12).toFixed(2)}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minInvestment">Min Investment (₹)</Label>
              <Input
                id="minInvestment"
                type="number"
                value={formData.minInvestment}
                onChange={(e) =>
                  setFormData({ ...formData, minInvestment: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentTerm">Investment Term (Years)</Label>
              <Input
                id="investmentTerm"
                type="number"
                value={formData.investmentTerm}
                onChange={(e) =>
                  setFormData({ ...formData, investmentTerm: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Total Gain (₹)</Label>
              <Input value={calculateTotalGain()} disabled />
            </div>

            <div className="space-y-2">
              <Label>Maturity Value (₹)</Label>
              <Input value={calculateMaturityValue()} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select
                value={formData.productType}
                onValueChange={(value: "SIP" | "LUMPSUM") =>
                  setFormData({ ...formData, productType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIP">SIP</SelectItem>
                  <SelectItem value="LUMPSUM">LUMPSUM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.status === "ACTIVE"}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked ? "ACTIVE" : "DEACTIVATED",
                    })
                  }
                />
                <span className="text-sm">
                  {formData.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#AACF45] hover:bg-[#9abe3a]">
              Add Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
