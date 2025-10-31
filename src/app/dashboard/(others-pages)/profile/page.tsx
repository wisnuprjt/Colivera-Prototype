import UserPersonalInformation from "@/components/user-profile/UserPersonalInformation";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Colivera - Profile",
};

export default function Profile() {
  return (
    <div>
      <UserPersonalInformation />
    </div>
  );
}
