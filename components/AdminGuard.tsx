"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard Component
 * 
 * Protects admin routes by checking if the current user has admin privileges.
 * Redirects non-admin users to the home page.
 * 
 * Usage:
 * Wrap your admin page content with this component:
 * 
 * <AdminGuard>
 *   <AdminPage />
 * </AdminGuard>
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // No user logged in
        setIsAdmin(false);
        setIsLoading(false);
        router.push("/login");
        return;
      }

      try {
        // Get the user's ID token and check for admin claim
        const idTokenResult = await user.getIdTokenResult();
        const hasAdminClaim = idTokenResult.claims.admin === true;

        setIsAdmin(hasAdminClaim);
        setIsLoading(false);

        if (!hasAdminClaim) {
          // User is authenticated but not an admin
          console.warn("Access denied: User is not an admin");
          router.push("/home");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        setIsLoading(false);
        router.push("/home");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#000000] to-[#4B0009]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B2182B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#000000] to-[#4B0009]">
        <div className="text-center">
          <div className="text-[#B2182B] text-6xl mb-4">🔒</div>
          <h1 className="text-white text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-white/70">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
