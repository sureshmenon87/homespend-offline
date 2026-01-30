import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import FullPageLayout from "../layouts/FullPageLayout";

import Dashboard from "../pages/DashboardPage";
import { PurchasesPage } from "../pages/PurchasesPage";
import CategoriesPage from "@/features/categories/CategoriesPage";
import ItemsPage from "@/features/items/ItemsPage";
import ShopsPage from "@/pages/ShopsPage";
import ReportsPage from "@/pages/ReportsPage";
import AI from "@/pages/AI";
import SettingsPage from "@/pages/settings/SettingsPage";
import AddPurchasePage from "@/pages/purchase/AddPurchasePage";

export function AppRoutes() {
  return (
    <Routes>
      {/* 🔹 Dashboard shell routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 🔥 Full-page flow route (NO sidebar) */}
      <Route element={<FullPageLayout />}>
        <Route path="/purchase/add" element={<AddPurchasePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
