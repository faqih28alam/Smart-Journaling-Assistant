// src/layouts/MainLayout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pb-12">
        <Outlet />
      </main>
    </div>
  );
}