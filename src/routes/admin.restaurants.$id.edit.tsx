import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { RestaurantForm } from "./admin.restaurants.new";

export const Route = createFileRoute("/admin/restaurants/$id/edit")({
  head: () => ({
    meta: [{ title: "Edit restaurant - Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <RestaurantForm mode="edit" />
      </AdminLayout>
    </RoleGuard>
  ),
});
