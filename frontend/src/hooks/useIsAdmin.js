// frontend/src/hooks/useIsAdmin.js
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const useIsAdmin = () => {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const checkAdminStatus = async () => {
      try {
        // Try to access an admin endpoint to verify admin status
        const response = await axios.get("/api/admin/dashboard/stats", {
          headers: {
            "x-user-id": user.id,
          },
        });

        // If we get a 200 response, user is admin
        setIsAdmin(response.status === 200);
      } catch (error) {
        // If 403 Forbidden or other error, user is not admin
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
