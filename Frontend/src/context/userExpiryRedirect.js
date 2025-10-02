import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAssignment } from "../context/AssignmentContext";
import { useAuth } from "../context/AuthContext";

export const useExpiryRedirect = () => {
  const { expiry, fetchExpiry } = useAssignment();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkExpiry = async () => {
      await fetchExpiry();

      const isDeptExpired =
        expiry?.deptExpiry && new Date(expiry.deptExpiry) <= new Date();
      const isWardExpired =
        expiry?.wardExpiry && new Date(expiry.wardExpiry) <= new Date();

      if (
        (isDeptExpired || isWardExpired) &&
        user?.role !== "intern" &&
        location.pathname !== "/update-expiry"
      ) {
        navigate("/update-expiry", { replace: true });
      }
    };

    checkExpiry();
  }, [expiry, user, location.pathname, navigate, fetchExpiry]);
};
