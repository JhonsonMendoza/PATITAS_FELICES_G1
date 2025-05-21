import Header from "@/components/Header/header";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Patitas Felices | Login",
  description: "Welcome to Patitas Felices, your pet adoption platform",
};

export default function spotifyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
