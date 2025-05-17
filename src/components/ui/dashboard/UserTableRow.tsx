// components/dashboard/UserTableRow.tsx
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import UserDetailsModal from "./UserDetailsModal";

interface User {
  id: string;
  email: string;
  availableBalance: number;
  verificationState: string;
  createdAt: string;
}

interface UserDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  dateOfBirth: string;
  referralCode: string;
  verificationState: string;
  availableBalance: string;
  createdAt: string;
  updatedAt: string;
}

interface UserTableRowProps {
  user: User;
  onVerify: () => void;
}

export default function UserTableRow({ user, onVerify }: UserTableRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const handleVerification = async (status: "approve" | "reject") => {
    try {
      await axios.post(
        `/api/v1/admin/verify-user`,
        { userId: user.id, status },
        { withCredentials: true }
      );
      onVerify();
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const handleView = async () => {
    try {
      const response = await axios.get(`/api/v1/admin/get-user/${user.id}`, {
        withCredentials: true,
      });
      setUserDetails(response.data.user);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <TableRow key={user.id}>
        <TableCell className="w-[300px]">
          <p className="text-sm font-medium">{user.email}</p>
        </TableCell>
        <TableCell>₹{user.availableBalance?.toLocaleString() || "0"}</TableCell>
        <TableCell>{formatDate(user.createdAt)}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(user.verificationState)}>
              {user.verificationState}
            </Badge>
            {user.verificationState === "PENDING" && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                  onClick={() => handleVerification("approve")}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  onClick={() => handleVerification("reject")}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleView}>
              View
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {userDetails && (
        <UserDetailsModal
          user={userDetails}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
