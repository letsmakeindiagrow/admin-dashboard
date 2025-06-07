import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface UserDetails {
  id: string
  email: string
  firstName: string
  lastName: string
  mobileNumber: string
  mobileVerified: boolean
  emailVerified: boolean
  dateOfBirth: string
  referralCode: string
  verificationState: string
  availableBalance: string
  createdAt: string
  updatedAt: string
  identityDetails?: {
    panNumber: string
    panAttachment: string
    aadharNumber: string
    aadharFront: string
    aadharBack: string
  }
  bankDetails?: {
    accountNumber: string
    ifscCode: string
    branchName: string
    proofAttachment: string
  }
}

interface UserDetailsModalProps {
  user: UserDetails
  isOpen: boolean
  onClose: () => void
}

export default function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-amber-100 text-amber-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Name</h4>
              <p className="text-sm">{`${user.firstName} ${user.lastName}`}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="text-sm">{user.email}</p>
              <Badge variant={user.emailVerified ? "default" : "secondary"} className="mt-1">
                {user.emailVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Mobile Number</h4>
              <p className="text-sm">{user.mobileNumber}</p>
              <Badge variant={user.mobileVerified ? "default" : "secondary"} className="mt-1">
                {user.mobileVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
              <p className="text-sm">{formatDate(user.dateOfBirth)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Referral Code</h4>
              <p className="text-sm">{user.referralCode}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Available Balance</h4>
              <p className="text-sm">₹{parseFloat(user.availableBalance).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Verification Status</h4>
              <Badge className={getStatusColor(user.verificationState)}>
                {user.verificationState}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">User ID</h4>
              <p className="text-sm font-mono text-xs">{user.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Created At</h4>
              <p className="text-sm">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
              <p className="text-sm">{formatDate(user.updatedAt)}</p>
            </div>
          </div>

          {/* Identity Documents Section */}
          {user.identityDetails && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Identity Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">PAN Card</h4>
                  <p className="text-sm mb-2">{user.identityDetails.panNumber}</p>
                  {user.identityDetails?.panAttachment && (
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => window.open(user.identityDetails?.panAttachment, "_blank")}
                    >
                      View PAN Card
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Aadhaar Card</h4>
                  <p className="text-sm mb-2">{user.identityDetails.aadharNumber}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {user.identityDetails?.aadharFront && (
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => window.open(user.identityDetails?.aadharFront, "_blank")}
                      >
                        Front Side
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    {user.identityDetails?.aadharBack && (
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => window.open(user.identityDetails?.aadharBack, "_blank")}
                      >
                        Back Side
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bank Details Section */}
          {user.bankDetails && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Bank Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Account Number</h4>
                  <p className="text-sm">{user.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">IFSC Code</h4>
                  <p className="text-sm">{user.bankDetails.ifscCode}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Branch Name</h4>
                  <p className="text-sm">{user.bankDetails.branchName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bank Proof</h4>
                  {user.bankDetails?.proofAttachment && (
                    <Button
                      variant="outline"
                      className="w-full justify-between mt-2"
                      onClick={() => window.open(user.bankDetails?.proofAttachment, "_blank")}
                    >
                      View Bank Proof
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 