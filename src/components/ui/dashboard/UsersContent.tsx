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
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    identityDetails: {
      panNumber: "",
      aadhaarNumber: "",
    },
    bankDetails: {
      accountNumber: "",
      ifsc: "",
      bankName: "",
      branch: "",
    },
  });
  const [showAddress, setShowAddress] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showBank, setShowBank] = useState(false);

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
    setAddUserError(null);
    setAddUserLoading(true);
    // Basic validation
    if (!addUserFields.firstName.trim() || !addUserFields.lastName.trim() || !addUserFields.email.trim() || !addUserFields.mobileNumber.trim() || !addUserFields.password.trim() || !addUserFields.dateOfBirth.trim()) {
      setAddUserError("All required fields must be filled.");
      setAddUserLoading(false);
      return;
    }
    try {
      await axios.post(
        `/api/v1/admin/create-new-user`,
        addUserFields,
        { withCredentials: true }
      );
      setShowAddUserModal(false);
      setAddUserFields({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        password: "",
        dateOfBirth: "",
        referralCode: "",
        address: { street: "", city: "", state: "", zip: "", country: "" },
        identityDetails: { panNumber: "", aadhaarNumber: "" },
        bankDetails: { accountNumber: "", ifsc: "", bankName: "", branch: "" },
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
              </div>
              <div>
                <Label htmlFor="lastName">Last Name*</Label>
                <Input id="lastName" name="lastName" value={addUserFields.lastName} onChange={handleAddUserChange} placeholder="Last Name" />
              </div>
              <div>
                <Label htmlFor="email">Email*</Label>
                <Input id="email" name="email" value={addUserFields.email} onChange={handleAddUserChange} placeholder="Email" type="email" />
              </div>
              <div>
                <Label htmlFor="mobileNumber">Mobile Number*</Label>
                <Input id="mobileNumber" name="mobileNumber" value={addUserFields.mobileNumber} onChange={handleAddUserChange} placeholder="Mobile Number" />
              </div>
              <div>
                <Label htmlFor="password">Password*</Label>
                <Input id="password" name="password" value={addUserFields.password} onChange={handleAddUserChange} placeholder="Password" type="password" />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                <Input id="dateOfBirth" name="dateOfBirth" value={addUserFields.dateOfBirth} onChange={handleAddUserChange} placeholder="YYYY-MM-DD" type="date" />
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
                    <Label htmlFor="address.street">Street</Label>
                    <Input id="address.street" name="address.street" value={addUserFields.address.street} onChange={handleAddUserChange} placeholder="Street" />
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
                    <Label htmlFor="address.zip">ZIP</Label>
                    <Input id="address.zip" name="address.zip" value={addUserFields.address.zip} onChange={handleAddUserChange} placeholder="ZIP" />
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
                    <Label htmlFor="identityDetails.aadhaarNumber">Aadhaar Number</Label>
                    <Input id="identityDetails.aadhaarNumber" name="identityDetails.aadhaarNumber" value={addUserFields.identityDetails.aadhaarNumber} onChange={handleAddUserChange} placeholder="Aadhaar Number" />
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
                    <Label htmlFor="bankDetails.ifsc">IFSC</Label>
                    <Input id="bankDetails.ifsc" name="bankDetails.ifsc" value={addUserFields.bankDetails.ifsc} onChange={handleAddUserChange} placeholder="IFSC" />
                  </div>
                  <div>
                    <Label htmlFor="bankDetails.bankName">Bank Name</Label>
                    <Input id="bankDetails.bankName" name="bankDetails.bankName" value={addUserFields.bankDetails.bankName} onChange={handleAddUserChange} placeholder="Bank Name" />
                  </div>
                  <div>
                    <Label htmlFor="bankDetails.branch">Branch</Label>
                    <Input id="bankDetails.branch" name="bankDetails.branch" value={addUserFields.bankDetails.branch} onChange={handleAddUserChange} placeholder="Branch" />
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
