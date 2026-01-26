import { Route, Routes } from "react-router-dom";
import AdminLog from "../admin_dashboard/admin_dashboard_login";
import Dashboard from "../admin_dashboard/services/dashboard";
import CreateProduct from "../admin_dashboard/create_product";
import InventoryProduct from "../admin_dashboard/inventory_product";
import EditProduct from "../admin_dashboard/edit_product";

export default function AdminApp() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<AdminLog />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/create-product" element={<CreateProduct />} />
        <Route path="/admin/edit-product" element={<EditProduct />} />
        <Route path="/admin/inventory" element={<InventoryProduct />} />
      </Routes>
    </>
  );
}
