import React from "react";
import { useAuthStore } from "../../store/authStore";

import UserNav from "./../navigations/UserNav";
import AdminNav from "./../navigations/AdminNav";
import NonNav from "./../navigations/NonNav";

const Navigation = () => {
  const { user } = useAuthStore();

  // Decide which navigation to show
  if (!user) {
    // Not logged in
    return <NonNav />;
  } else if (user.role === "renter") {
    // Admin user
    return <AdminNav />;
  } else {
    // Normal logged-in user
    return <UserNav />;
  }
};

export default Navigation;