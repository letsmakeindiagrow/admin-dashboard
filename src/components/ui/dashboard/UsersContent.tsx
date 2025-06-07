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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface User {
  id: string;
  email: string;
  availableBalance: number;
  verificationState: string;
  createdAt: string;
}

interface UserRegistrationForm {
  referralCode?: string | null;
  mobileNumber: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    pincode: string;
  };
  identityDetails?: {
    panNumber: string;
    panAttachment: string;
    aadharNumber: string;
    aadharFront: string;
    aadharBack: string;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    proofAttachment: string;
  };
}

interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  file: File | null;
  url: string;
}

interface FileUploadStates {
  panAttachment: FileUploadState;
  aadharFront: FileUploadState;
  aadharBack: FileUploadState;
  bankProof: FileUploadState;
}

export default function UsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [addUserFields, setAddUserFields] = useState<UserRegistrationForm>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    dateOfBirth: new Date(),
    referralCode: null,
  });
  const [showAddress, setShowAddress] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [addUserFieldErrors, setAddUserFieldErrors] = useState<any>({});

  const [fileUploadStates, setFileUploadStates] = useState<FileUploadStates>({
    panAttachment: { isUploading: false, progress: 0, error: null, file: null, url: "" },
    aadharFront: { isUploading: false, progress: 0, error: null, file: null, url: "" },
    aadharBack: { isUploading: false, progress: 0, error: null, file: null, url: "" },
    bankProof: { isUploading: false, progress: 0, error: null, file: null, url: "" },
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/v1/admin/get-users', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUsers(response.data.users || []);
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
    const matchesSearch = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && user.verificationState === filter.toUpperCase();
  });

  const uploadFile = async (file: File, documentType: keyof FileUploadStates) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_FILE_SIZE) {
      setFileUploadStates(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          error: "File size must be less than 5MB",
          file: null,
          url: ""
        }
      }));
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    try {
      setFileUploadStates(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          isUploading: true,
          error: null,
          file,
          url: ""
        }
      }));

      const response = await axios.post('/api/v1/documents/upload', formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setFileUploadStates(prev => ({
            ...prev,
            [documentType]: {
              ...prev[documentType],
              progress
            }
          }));
        },
      });

      console.log('Upload response for', documentType, ':', response.data);
      const url = response.data.url;
      if (!url) {
        setFileUploadStates(prev => ({
          ...prev,
          [documentType]: {
            ...prev[documentType],
            isUploading: false,
            error: 'No URL returned from upload',
          }
        }));
        return null;
      }
      setFileUploadStates(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          url,
          isUploading: false,
          error: null
        }
      }));

      // Set the URL in the form data as well
      setAddUserFields(prev => {
        const newFields = { ...prev };
        if (documentType === "panAttachment" && newFields.identityDetails) {
          newFields.identityDetails.panAttachment = url;
        } else if (documentType === "aadharFront" && newFields.identityDetails) {
          newFields.identityDetails.aadharFront = url;
        } else if (documentType === "aadharBack" && newFields.identityDetails) {
          newFields.identityDetails.aadharBack = url;
        } else if (documentType === "bankProof" && newFields.bankDetails) {
          newFields.bankDetails.proofAttachment = url;
        }
        return newFields;
      });

      return url;
    } catch (error) {
      setFileUploadStates(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          error: "Failed to upload file. Please try again.",
          isUploading: false
        }
      }));
      return null;
    }
  };

  const handleAddUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files && files[0]) {
      const documentType = name.split(".")[1] as keyof FileUploadStates;
      uploadFile(files[0], documentType);
    } else {
      setAddUserFields(prev => {
        const newFields = {...prev};
        const [parent, child] = name.split(".");
        
        if (parent === "address") {
          newFields.address = {
            ...newFields.address || { line1: "", city: "", pincode: "" },
            [child]: value
          };
        } else if (parent === "identityDetails") {
          newFields.identityDetails = {
            ...newFields.identityDetails || { 
              panNumber: "", panAttachment: "", 
              aadharNumber: "", aadharFront: "", aadharBack: "" 
            },
            [child]: child === "panNumber" ? value.toUpperCase() : value
          };
        } else if (parent === "bankDetails") {
          newFields.bankDetails = {
            ...newFields.bankDetails || {
              accountNumber: "", ifscCode: "", 
              branchName: "", proofAttachment: ""
            },
            [child]: value
          };
        } else if (name === "dateOfBirth") {
          newFields.dateOfBirth = new Date(value);
        } else if (name === "referralCode") {
          newFields.referralCode = value || null;
        } else {
          // Handle basic string fields
          switch (name) {
            case "firstName":
              newFields.firstName = value;
              break;
            case "lastName":
              newFields.lastName = value;
              break;
            case "email":
              newFields.email = value;
              break;
            case "mobileNumber":
              newFields.mobileNumber = value;
              break;
            case "password":
              newFields.password = value;
              break;
          }
        }
        
        return newFields;
      });
    }
  };

  const validateForm = () => {
    const errors: any = {};
    const requiredFields = [
      'firstName', 'lastName', 'email', 'mobileNumber', 'password', 'dateOfBirth'
    ];

    // Basic field validation
    requiredFields.forEach(field => {
      if (!addUserFields[field as keyof UserRegistrationForm]) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
      }
    });

    // Email format validation
    if (addUserFields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addUserFields.email)) {
      errors.email = "Invalid email format";
    }

    // Mobile number validation
    if (addUserFields.mobileNumber && !/^\d{10}$/.test(addUserFields.mobileNumber)) {
      errors.mobileNumber = "Mobile number must be 10 digits";
    }

    // Address validation if shown
    if (showAddress) {
      if (!addUserFields.address?.line1) errors["address.line1"] = "Address line 1 is required";
      if (!addUserFields.address?.city) errors["address.city"] = "City is required";
      if (!addUserFields.address?.pincode) errors["address.pincode"] = "Pincode is required";
      else if (!/^\d{6}$/.test(addUserFields.address.pincode)) {
        errors["address.pincode"] = "Pincode must be 6 digits";
      }
    }

    // Identity validation if shown
    if (showIdentity) {
      if (!addUserFields.identityDetails?.panNumber) {
        errors["identityDetails.panNumber"] = "PAN number is required";
      }
      if (!addUserFields.identityDetails?.aadharNumber) {
        errors["identityDetails.aadharNumber"] = "Aadhaar number is required";
      }
      if (!fileUploadStates.panAttachment.url) {
        errors["identityDetails.panAttachment"] = "PAN attachment is required";
      }
      if (!fileUploadStates.aadharFront.url) {
        errors["identityDetails.aadharFront"] = "Aadhaar front is required";
      }
      if (!fileUploadStates.aadharBack.url) {
        errors["identityDetails.aadharBack"] = "Aadhaar back is required";
      }
    }

    // Bank validation if shown
    if (showBank) {
      if (!addUserFields.bankDetails?.accountNumber) {
        errors["bankDetails.accountNumber"] = "Account number is required";
      }
      if (!addUserFields.bankDetails?.ifscCode) {
        errors["bankDetails.ifscCode"] = "IFSC code is required";
      }
      if (!addUserFields.bankDetails?.branchName) {
        errors["bankDetails.branchName"] = "Branch name is required";
      }
      const bankProofUploading = fileUploadStates.bankProof.isUploading;
      const bankProofUrl = fileUploadStates.bankProof.url || addUserFields.bankDetails?.proofAttachment;
      if (!bankProofUploading && !bankProofUrl) {
        errors["bankDetails.proofAttachment"] = "Bank proof is required";
      }
    }

    return errors;
  };

  const handleAddUser = async () => {
    setAddUserError(null);
    setAddUserLoading(true);
    
    // Check for any ongoing uploads
    const uploadsInProgress = Object.values(fileUploadStates).some(
      state => state.isUploading
    );

    if (uploadsInProgress) {
      setAddUserError("Please wait for all file uploads to complete");
      setAddUserLoading(false);
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setAddUserFieldErrors(errors);
      setAddUserLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/v1/admin/create-user', addUserFields, {
        withCredentials: true,
      });

      if (response.status === 201) {
        setShowAddUserModal(false);
        resetForm();
        fetchUsers();
      }
    } catch (error: any) {
      if (error.response) {
        setAddUserError(error.response.data.message || "Error creating user");
      } else {
        setAddUserError("Network error. Please check your connection.");
      }
    } finally {
      setAddUserLoading(false);
    }
  };

  const resetForm = () => {
    setAddUserFields({
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      dateOfBirth: new Date(),
      referralCode: null,
    });
    setFileUploadStates({
      panAttachment: { isUploading: false, progress: 0, error: null, file: null, url: "" },
      aadharFront: { isUploading: false, progress: 0, error: null, file: null, url: "" },
      aadharBack: { isUploading: false, progress: 0, error: null, file: null, url: "" },
      bankProof: { isUploading: false, progress: 0, error: null, file: null, url: "" },
    });
    setAddUserFieldErrors({});
    setShowAddress(false);
    setShowIdentity(false);
    setShowBank(false);
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center animate-fade-in">
        <Loader2 className="h-16 w-16 text-[#00ADEF] animate-spin mb-6" />
        <h2 className="text-2xl font-semibold mb-2 text-[#00ADEF]">
          Creating User...
        </h2>
        <p className="text-gray-600 text-center">
          Please wait while we create the user account.
          <br />
          This may take a few seconds.
        </p>
      </div>
    </div>
  );

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Management</h2>
        <Button
          className="bg-[#AACF45] hover:bg-[#9abe3a]"
          onClick={() => setShowAddUserModal(true)}
        >
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={addUserFields.firstName}
                  onChange={handleAddUserChange}
                />
                {addUserFieldErrors.firstName && (
                  <div className="text-red-600 text-xs mt-1">
                    {addUserFieldErrors.firstName}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={addUserFields.lastName}
                  onChange={handleAddUserChange}
                />
                {addUserFieldErrors.lastName && (
                  <div className="text-red-600 text-xs mt-1">
                    {addUserFieldErrors.lastName}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={addUserFields.email}
                  onChange={handleAddUserChange}
                />
                {addUserFieldErrors.email && (
                  <div className="text-red-600 text-xs mt-1">
                    {addUserFieldErrors.email}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="mobileNumber">Mobile Number*</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  value={addUserFields.mobileNumber}
                  onChange={handleAddUserChange}
                />
                {addUserFieldErrors.mobileNumber && (
                  <div className="text-red-600 text-xs mt-1">
                    {addUserFieldErrors.mobileNumber}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={addUserFields.password}
                  onChange={handleAddUserChange}
                />
                {addUserFieldErrors.password && (
                  <div className="text-red-600 text-xs mt-1">
                    {addUserFieldErrors.password}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={addUserFields.dateOfBirth.toISOString().split('T')[0]}
                  onChange={handleAddUserChange}
                />
                {addUserFieldErrors.dateOfBirth && (
                  <div className="text-red-600 text-xs mt-1">
                    {addUserFieldErrors.dateOfBirth}
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <Input
                  id="referralCode"
                  name="referralCode"
                  value={addUserFields.referralCode || ''}
                  onChange={handleAddUserChange}
                />
              </div>
            </div>

            {/* Address Section */}
            <div>
              <button
                type="button"
                className="flex items-center gap-1 text-blue-600"
                onClick={() => setShowAddress(!showAddress)}
              >
                Address {showAddress ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showAddress && (
                <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-50 p-4 rounded">
                  <div>
                    <Label htmlFor="address.line1">Address Line 1*</Label>
                    <Input
                      id="address.line1"
                      name="address.line1"
                      value={addUserFields.address?.line1 || ''}
                      onChange={handleAddUserChange}
                    />
                    {addUserFieldErrors["address.line1"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["address.line1"]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="address.line2">Address Line 2</Label>
                    <Input
                      id="address.line2"
                      name="address.line2"
                      value={addUserFields.address?.line2 || ''}
                      onChange={handleAddUserChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address.city">City*</Label>
                    <Input
                      id="address.city"
                      name="address.city"
                      value={addUserFields.address?.city || ''}
                      onChange={handleAddUserChange}
                    />
                    {addUserFieldErrors["address.city"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["address.city"]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="address.pincode">Pincode*</Label>
                    <Input
                      id="address.pincode"
                      name="address.pincode"
                      value={addUserFields.address?.pincode || ''}
                      onChange={handleAddUserChange}
                    />
                    {addUserFieldErrors["address.pincode"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["address.pincode"]}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Identity Details Section */}
            <div>
              <button
                type="button"
                className="flex items-center gap-1 text-blue-600"
                onClick={() => setShowIdentity(!showIdentity)}
              >
                Identity Details {showIdentity ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showIdentity && (
                <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-50 p-4 rounded">
                  <div>
                    <Label htmlFor="identityDetails.panNumber">PAN Number*</Label>
                    <Input
                      id="identityDetails.panNumber"
                      name="identityDetails.panNumber"
                      value={addUserFields.identityDetails?.panNumber}
                      onChange={handleAddUserChange}
                      placeholder="PAN Number"
                      style={{ textTransform: "uppercase" }}
                    />
                    {addUserFieldErrors["identityDetails.panNumber"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["identityDetails.panNumber"]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="identityDetails.panAttachment">PAN Attachment*</Label>
                    <Input
                      id="identityDetails.panAttachment"
                      name="identityDetails.panAttachment"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleAddUserChange}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Max 5MB (PDF, JPG, PNG)
                    </div>
                    {fileUploadStates.panAttachment.isUploading && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${fileUploadStates.panAttachment.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Uploading: {fileUploadStates.panAttachment.progress}%
                        </div>
                      </div>
                    )}
                    {fileUploadStates.panAttachment.url && (
                      <div className="flex items-center text-green-600 text-xs mt-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        File uploaded successfully
                      </div>
                    )}
                    {fileUploadStates.panAttachment.error && (
                      <div className="flex items-center text-red-600 text-xs mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {fileUploadStates.panAttachment.error}
                      </div>
                    )}
                    {addUserFieldErrors["identityDetails.panAttachment"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["identityDetails.panAttachment"]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="identityDetails.aadharNumber">Aadhaar Number*</Label>
                    <Input
                      id="identityDetails.aadharNumber"
                      name="identityDetails.aadharNumber"
                      value={addUserFields.identityDetails?.aadharNumber || ''}
                      onChange={handleAddUserChange}
                    />
                    {addUserFieldErrors["identityDetails.aadharNumber"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["identityDetails.aadharNumber"]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="identityDetails.aadharFront">Aadhaar Front*</Label>
                    <Input
                      id="identityDetails.aadharFront"
                      name="identityDetails.aadharFront"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleAddUserChange}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Max 5MB (PDF, JPG, PNG)
                    </div>
                    {fileUploadStates.aadharFront.isUploading && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${fileUploadStates.aadharFront.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Uploading: {fileUploadStates.aadharFront.progress}%
                        </div>
                      </div>
                    )}
                    {fileUploadStates.aadharFront.url && (
                      <div className="flex items-center text-green-600 text-xs mt-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        File uploaded successfully
                      </div>
                    )}
                    {fileUploadStates.aadharFront.error && (
                      <div className="flex items-center text-red-600 text-xs mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {fileUploadStates.aadharFront.error}
                      </div>
                    )}
                    {addUserFieldErrors["identityDetails.aadharFront"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["identityDetails.aadharFront"]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="identityDetails.aadharBack">Aadhaar Back*</Label>
                    <Input
                      id="identityDetails.aadharBack"
                      name="identityDetails.aadharBack"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleAddUserChange}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Max 5MB (PDF, JPG, PNG)
                    </div>
                    {fileUploadStates.aadharBack.isUploading && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${fileUploadStates.aadharBack.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Uploading: {fileUploadStates.aadharBack.progress}%
                        </div>
                      </div>
                    )}
                    {fileUploadStates.aadharBack.url && (
                      <div className="flex items-center text-green-600 text-xs mt-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        File uploaded successfully
                      </div>
                    )}
                    {fileUploadStates.aadharBack.error && (
                      <div className="flex items-center text-red-600 text-xs mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {fileUploadStates.aadharBack.error}
                      </div>
                    )}
                    {addUserFieldErrors["identityDetails.aadharBack"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["identityDetails.aadharBack"]}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bank Details Section */}
            <div>
              <button
                type="button"
                className="flex items-center gap-1 text-blue-600"
                onClick={() => setShowBank(!showBank)}
              >
                Bank Details {showBank ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showBank && (
                <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-50 p-4 rounded">
                  <div>
                    <Label htmlFor="bankDetails.accountNumber">Account Number*</Label>
                    <Input
                      id="bankDetails.accountNumber"
                      name="bankDetails.accountNumber"
                      value={addUserFields.bankDetails?.accountNumber || ''}
                      onChange={handleAddUserChange}
                    />
                    {addUserFieldErrors["bankDetails.accountNumber"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["bankDetails.accountNumber"]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="bankDetails.ifscCode">IFSC Code*</Label>
                    <Input
                      id="bankDetails.ifscCode"
                      name="bankDetails.ifscCode"
                      value={addUserFields.bankDetails?.ifscCode || ''}
                      onChange={handleAddUserChange}
                    />
                    {addUserFieldErrors["bankDetails.ifscCode"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["bankDetails.ifscCode"]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="bankDetails.branchName">Branch Name*</Label>
                    <Input
                      id="bankDetails.branchName"
                      name="bankDetails.branchName"
                      value={addUserFields.bankDetails?.branchName || ''}
                      onChange={handleAddUserChange}
                    />
                    {addUserFieldErrors["bankDetails.branchName"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["bankDetails.branchName"]}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="bankDetails.proofAttachment">Proof Attachment*</Label>
                    <Input
                      id="bankDetails.proofAttachment"
                      name="bankDetails.proofAttachment"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleAddUserChange}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Max 5MB (PDF, JPG, PNG)
                    </div>
                    {fileUploadStates.bankProof.isUploading && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${fileUploadStates.bankProof.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Uploading: {fileUploadStates.bankProof.progress}%
                        </div>
                      </div>
                    )}
                    {fileUploadStates.bankProof.url && (
                      <div className="flex items-center text-green-600 text-xs mt-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        File uploaded successfully
                      </div>
                    )}
                    {fileUploadStates.bankProof.error && (
                      <div className="flex items-center text-red-600 text-xs mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {fileUploadStates.bankProof.error}
                      </div>
                    )}
                    {addUserFieldErrors["bankDetails.proofAttachment"] && (
                      <div className="text-red-600 text-xs mt-1">
                        {addUserFieldErrors["bankDetails.proofAttachment"]}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {addUserError && (
            <div className="text-red-600 text-sm mt-4">{addUserError}</div>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddUserModal(false)}
              disabled={addUserLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#AACF45] hover:bg-[#9abe3a]"
              onClick={handleAddUser}
              disabled={
                addUserLoading || 
                Object.values(fileUploadStates).some(state => state.isUploading)
              }
            >
              {addUserLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {addUserLoading && <LoadingOverlay />}
    </main>
  );
}
