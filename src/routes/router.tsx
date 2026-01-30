import { DashboardLayout } from "@/layouts/DashboardLayout";
import FullPageLayout from "@/layouts/FullPageLayout";

import { PurchasesPage } from "@/pages/PurchasesPage";
import AddPurchasePage from "@/pages/purchase/AddPurchasePage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/purchases",
        element: <PurchasesPage />,
      },
      // other dashboard pages
    ],
  },

  // 🔥 FLOW ROUTE (no sidebar)
  {
    element: <FullPageLayout children={undefined} />,
    children: [
      {
        path: "/purchase/add",
        element: <AddPurchasePage />,
      },
    ],
  },
]);
