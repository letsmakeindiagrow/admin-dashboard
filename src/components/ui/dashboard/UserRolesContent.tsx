import { Clock, Shield, Users } from "lucide-react";

export default function UserRolesContent() {
  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Roles Management</h2>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h3>
          <p className="text-gray-600 mb-6">
            We're working on implementing a comprehensive user roles management system.
            This feature will allow you to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Manage user permissions</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Set role-based access</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Track role changes</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Stay tuned for updates as we continue to enhance our platform's capabilities.
          </p>
        </div>
      </div>
    </main>
  );
}
