// components/dashboard/UsersContent.tsx
import { useEffect, useState } from "react";
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
  TableCell,
} from "@/components/ui/table";
import UserTableRow from "./UserTableRow";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

interface User {
  id: string;
  email: string;
  availableBalance: number;
  verificationState: string;
  createdAt: string;
}

// Helper validation functions
const validateEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);
const validatePincode = (pincode: string) => /^\d{6}$/.test(pincode);
const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
const validateAadhar = (aadhar: string) => /^\d{12}$/.test(aadhar);
const validateIFSC = (ifsc: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

export default function UsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [addUserFields, setAddUserFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    dateOfBirth: "",
    referralCode: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    identityDetails: {
      panNumber: "",
      panAttachment: "",
      aadharNumber: "",
      aadharFront: "",
      aadharBack: "",
    },
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
      proofAttachment: "",
    },
  });
  const [showAddress, setShowAddress] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [addUserFieldErrors, setAddUserFieldErrors] = useState<any>({});

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/v1/admin/get-users`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Users data:", response.data.users);
        setUsers(response.data.users || []);
      } else {
        console.error("Failed to fetch users:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = (user.email?.toLowerCase() || "").includes(
      searchQuery.toLowerCase()
    );

    if (filter === "all") return matchesSearch;
    if (filter === "verified")
      return matchesSearch && user.verificationState === "VERIFIED";
    if (filter === "pending")
      return matchesSearch && user.verificationState === "PENDING";
    if (filter === "rejected")
      return matchesSearch && user.verificationState === "REJECTED";

    return matchesSearch;
  });

  const handleAddUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      setAddUserFields((prev) => ({
        ...prev,
        address: { ...prev.address, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("identityDetails.")) {
      setAddUserFields((prev) => ({
        ...prev,
        identityDetails: { ...prev.identityDetails, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("bankDetails.")) {
      setAddUserFields((prev) => ({
        ...prev,
        bankDetails: { ...prev.bankDetails, [name.split(".")[1]]: value },
      }));
    } else {
      setAddUserFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddUser = async () => {
    console.log("Submitting", addUserFields);
    setAddUserError(null);
    setAddUserLoading(true);
    setAddUserFieldErrors({});
    const errors: any = {};
    // Validate required fields and schema
    if (!addUserFields.firstName.trim()) errors.firstName = "First name is required";
    if (!addUserFields.lastName.trim()) errors.lastName = "Last name is required";
    if (!addUserFields.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(addUserFields.email)) errors.email = "Invalid email format";
    if (!addUserFields.mobileNumber.trim()) errors.mobileNumber = "Mobile number is required";
    else if (!validateMobile(addUserFields.mobileNumber)) errors.mobileNumber = "Mobile number must be 10 digits";
    if (!addUserFields.password.trim()) errors.password = "Password is required";
    if (!addUserFields.dateOfBirth.trim()) errors.dateOfBirth = "Date of birth is required";
    else if (isNaN(Date.parse(addUserFields.dateOfBirth))) errors.dateOfBirth = "Invalid date";
    // Address
    if (addUserFields.address) {
      if (!addUserFields.address.line1.trim()) errors["address.line1"] = "Address Line 1 is required";
      if (!addUserFields.address.pincode.trim()) errors["address.pincode"] = "Pincode is required";
      else if (!validatePincode(addUserFields.address.pincode)) errors["address.pincode"] = "Pincode must be 6 digits";
    }
    // Identity
    if (addUserFields.identityDetails) {
      if (!addUserFields.identityDetails.panNumber.trim()) errors["identityDetails.panNumber"] = "PAN is required";
      else if (!validatePAN(addUserFields.identityDetails.panNumber)) errors["identityDetails.panNumber"] = "PAN must be 10 characters (ABCDE1234F)";
      if (!addUserFields.identityDetails.aadharNumber.trim()) errors["identityDetails.aadharNumber"] = "Aadhar number is required";
      else if (!validateAadhar(addUserFields.identityDetails.aadharNumber)) errors["identityDetails.aadharNumber"] = "Aadhar number must be 12 digits";
      // File fields: show a message that backend expects URLs
      if (!addUserFields.identityDetails.panAttachment) errors["identityDetails.panAttachment"] = "PAN Attachment (URL) is required (backend expects a URL)";
      if (!addUserFields.identityDetails.aadharFront) errors["identityDetails.aadharFront"] = "Aadhaar Front (URL) is required (backend expects a URL)";
      if (!addUserFields.identityDetails.aadharBack) errors["identityDetails.aadharBack"] = "Aadhaar Back (URL) is required (backend expects a URL)";
    }
    // Bank
    if (addUserFields.bankDetails) {
      if (!addUserFields.bankDetails.accountNumber.trim()) errors["bankDetails.accountNumber"] = "Account number is required";
      else if (addUserFields.bankDetails.accountNumber.length < 8) errors["bankDetails.accountNumber"] = "Account number must be at least 8 digits";
      if (!addUserFields.bankDetails.ifscCode.trim()) errors["bankDetails.ifscCode"] = "IFSC Code is required";
      else if (!validateIFSC(addUserFields.bankDetails.ifscCode)) errors["bankDetails.ifscCode"] = "Invalid IFSC Code";
      if (!addUserFields.bankDetails.branchName.trim()) errors["bankDetails.branchName"] = "Branch name is required";
      // File fields: show a message that backend expects URLs
      if (!addUserFields.bankDetails.proofAttachment) errors["bankDetails.proofAttachment"] = "Proof Attachment (URL) is required (backend expects a URL)";
    }
    if (Object.keys(errors).length > 0) {
      setAddUserFieldErrors(errors);
      setAddUserLoading(false);
      const errorSummary = Object.values(errors).join('\n');
      alert(`Please fix the following errors before submitting:\n${errorSummary}`);
      return;
    }
    try {
      // Send as JSON with dateOfBirth as ISO string
      const payload = {
        ...addUserFields,
        dateOfBirth: new Date(addUserFields.dateOfBirth).toISOString(),
        referralCode: addUserFields.referralCode.trim() === "" ? null : addUserFields.referralCode,
      };
      await axios.post(
        `/api/v1/admin/create-new-user`,
        payload,
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      setAddUserFieldErrors({});
      setShowAddUserModal(false);
      setAddUserFields({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        password: "",
        dateOfBirth: "",
        referralCode: "",
        address: { line1: "", line2: "", city: "", state: "", pincode: "", country: "" },
        identityDetails: { panNumber: "", panAttachment: "", aadharNumber: "", aadharFront: "", aadharBack: "" },
        bankDetails: { accountNumber: "", ifscCode: "", bankName: "", branchName: "", proofAttachment: "" },
      });
      fetchUsers();
    } catch (error: any) {
      setAddUserError(error?.response?.data?.message || "Error creating user.");
    } finally {
      setAddUserLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Management</h2>
        <Button className="bg-[#AACF45] hover:bg-[#9abe3a]" onClick={() => setShowAddUserModal(true)}>
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage all users from this panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search users..."
                className="w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    All Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("verified")}>
                    Verified Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("pending")}>
                    Pending Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("rejected")}>
                    Rejected Users
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onVerify={fetchUsers}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="firstName">First Name*</Label>
                <Input id="firstName" name="firstName" value={addUserFields.firstName} onChange={handleAddUserChange} placeholder="First Name" />
                {addUserFieldErrors.firstName && <div className="text-red-600 text-xs">{addUserFieldErrors.firstName}</div>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name*</Label>
                <Input id="lastName" name="lastName" value={addUserFields.lastName} onChange={handleAddUserChange} placeholder="Last Name" />
                {addUserFieldErrors.lastName && <div className="text-red-600 text-xs">{addUserFieldErrors.lastName}</div>}
              </div>
              <div>
                <Label htmlFor="email">Email*</Label>
                <Input id="email" name="email" value={addUserFields.email} onChange={handleAddUserChange} placeholder="Email" type="email" />
                {addUserFieldErrors.email && <div className="text-red-600 text-xs">{addUserFieldErrors.email}</div>}
              </div>
              <div>
                <Label htmlFor="mobileNumber">Mobile Number*</Label>
                <Input id="mobileNumber" name="mobileNumber" value={addUserFields.mobileNumber} onChange={handleAddUserChange} placeholder="Mobile Number" />
                <div className="text-xs text-gray-500">10 digits, e.g. 9876543210</div>
                {addUserFieldErrors.mobileNumber && <div className="text-red-600 text-xs">{addUserFieldErrors.mobileNumber}</div>}
              </div>
              <div>
                <Label htmlFor="password">Password*</Label>
                <Input id="password" name="password" value={addUserFields.password} onChange={handleAddUserChange} placeholder="Password" type="password" />
                {addUserFieldErrors.password && <div className="text-red-600 text-xs">{addUserFieldErrors.password}</div>}
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                <Input id="dateOfBirth" name="dateOfBirth" value={addUserFields.dateOfBirth} onChange={handleAddUserChange} placeholder="YYYY-MM-DD" type="date" />
                {addUserFieldErrors.dateOfBirth && <div className="text-red-600 text-xs">{addUserFieldErrors.dateOfBirth}</div>}
              </div>
              <div className="col-span-2">
                <Label htmlFor="referralCode">Referral Code</Label>
                <Input id="referralCode" name="referralCode" value={addUserFields.referralCode} onChange={handleAddUserChange} placeholder="Referral Code (optional)" />
              </div>
            </div>
            {/* Address Section */}
            <div>
              <button type="button" className="flex items-center gap-1 text-blue-600 mt-2" onClick={() => setShowAddress((v) => !v)}>
                Address {showAddress ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showAddress && (
                <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-2 rounded">
                  <div>
                    <Label htmlFor="address.line1">Address Line 1*</Label>
                    <Input id="address.line1" name="address.line1" value={addUserFields.address.line1} onChange={handleAddUserChange} placeholder="Line 1" />
                  </div>
                  <div>
                    <Label htmlFor="address.line2">Address Line 2</Label>
                    <Input id="address.line2" name="address.line2" value={addUserFields.address.line2} onChange={handleAddUserChange} placeholder="Line 2" />
                  </div>
                  <div>
                    <Label htmlFor="address.city">City</Label>
                    <Input id="address.city" name="address.city" value={addUserFields.address.city} onChange={handleAddUserChange} placeholder="City" />
                  </div>
                  <div>
                    <Label htmlFor="address.state">State</Label>
                    <Input id="address.state" name="address.state" value={addUserFields.address.state} onChange={handleAddUserChange} placeholder="State" />
                  </div>
                  <div>
                    <Label htmlFor="address.pincode">Pincode*</Label>
                    <Input id="address.pincode" name="address.pincode" value={addUserFields.address.pincode} onChange={handleAddUserChange} placeholder="Pincode" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address.country">Country</Label>
                    <Input id="address.country" name="address.country" value={addUserFields.address.country} onChange={handleAddUserChange} placeholder="Country" />
                  </div>
                </div>
              )}
            </div>
            {/* Identity Details Section */}
            <div>
              <button type="button" className="flex items-center gap-1 text-blue-600 mt-2" onClick={() => setShowIdentity((v) => !v)}>
                Identity Details {showIdentity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showIdentity && (
                <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-2 rounded">
                  <div>
                    <Label htmlFor="identityDetails.panNumber">PAN Number</Label>
                    <Input id="identityDetails.panNumber" name="identityDetails.panNumber" value={addUserFields.identityDetails.panNumber} onChange={handleAddUserChange} placeholder="PAN Number" />
                  </div>
                  <div>
                    <Label htmlFor="identityDetails.panAttachment">PAN Attachment (AWS URL)*</Label>
                    <Input id="identityDetails.panAttachment" name="identityDetails.panAttachment" value={addUserFields.identityDetails.panAttachment} onChange={handleAddUserChange} placeholder="https://bucket.s3.amazonaws.com/pan.pdf" />
                  </div>
                  <div>
                    <Label htmlFor="identityDetails.aadharNumber">Aadhaar Number*</Label>
                    <Input id="identityDetails.aadharNumber" name="identityDetails.aadharNumber" value={addUserFields.identityDetails.aadharNumber} onChange={handleAddUserChange} placeholder="Aadhaar Number" />
                  </div>
                  <div>
                    <Label htmlFor="identityDetails.aadharFront">Aadhaar Front (AWS URL)*</Label>
                    <Input id="identityDetails.aadharFront" name="identityDetails.aadharFront" value={addUserFields.identityDetails.aadharFront} onChange={handleAddUserChange} placeholder="https://bucket.s3.amazonaws.com/aadhar-front.pdf" />
                  </div>
                  <div>
                    <Label htmlFor="identityDetails.aadharBack">Aadhaar Back (AWS URL)*</Label>
                    <Input id="identityDetails.aadharBack" name="identityDetails.aadharBack" value={addUserFields.identityDetails.aadharBack} onChange={handleAddUserChange} placeholder="https://bucket.s3.amazonaws.com/aadhar-back.pdf" />
                  </div>
                </div>
              )}
            </div>
            {/* Bank Details Section */}
            <div>
              <button type="button" className="flex items-center gap-1 text-blue-600 mt-2" onClick={() => setShowBank((v) => !v)}>
                Bank Details {showBank ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showBank && (
                <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-2 rounded">
                  <div>
                    <Label htmlFor="bankDetails.accountNumber">Account Number</Label>
                    <Input id="bankDetails.accountNumber" name="bankDetails.accountNumber" value={addUserFields.bankDetails.accountNumber} onChange={handleAddUserChange} placeholder="Account Number" />
                  </div>
                  <div>
                    <Label htmlFor="bankDetails.ifscCode">IFSC Code*</Label>
                    <Input id="bankDetails.ifscCode" name="bankDetails.ifscCode" value={addUserFields.bankDetails.ifscCode} onChange={handleAddUserChange} placeholder="IFSC Code" />
                  </div>
                  <div>
                    <Label htmlFor="bankDetails.bankName">Bank Name</Label>
                    <Input id="bankDetails.bankName" name="bankDetails.bankName" value={addUserFields.bankDetails.bankName} onChange={handleAddUserChange} placeholder="Bank Name" />
                  </div>
                  <div>
                    <Label htmlFor="bankDetails.branchName">Branch Name*</Label>
                    <Input id="bankDetails.branchName" name="bankDetails.branchName" value={addUserFields.bankDetails.branchName} onChange={handleAddUserChange} placeholder="Branch Name" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="bankDetails.proofAttachment">Proof Attachment (AWS URL)*</Label>
                    <Input id="bankDetails.proofAttachment" name="bankDetails.proofAttachment" value={addUserFields.bankDetails.proofAttachment} onChange={handleAddUserChange} placeholder="https://bucket.s3.amazonaws.com/bank-proof.pdf" />
                  </div>
                </div>
              )}
            </div>
          </div>
          {addUserError && <div className="text-red-600 text-sm mb-2">{addUserError}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserModal(false)} disabled={addUserLoading}>
              Cancel
            </Button>
            <Button className="bg-[#AACF45] hover:bg-[#9abe3a] text-white" onClick={handleAddUser} disabled={addUserLoading}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
