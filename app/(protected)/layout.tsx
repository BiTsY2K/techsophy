import React from "react";
import NavigationBar from "./_components/NavigationBar";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <NavigationBar />
      <div className="mx-auto">{children}</div>
    </div>
  );
}
