import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <main className="pt-8 md:pt-20">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
