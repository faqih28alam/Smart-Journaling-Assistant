// src/layouts/MainLayout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="pb-12">
        <Outlet />
      </main>
    </div>
  );
}