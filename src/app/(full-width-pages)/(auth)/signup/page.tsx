import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | Colivera - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page Colivera Dashboard Template",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
