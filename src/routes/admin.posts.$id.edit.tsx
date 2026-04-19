import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { PostFormPage } from "./admin.posts.new";

export const Route = createFileRoute("/admin/posts/$id/edit")({
  head: () => ({ meta: [{ title: "Edit post - Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard>
      <AdminLayout>
        <PostFormPage mode="edit" />
      </AdminLayout>
    </RoleGuard>
  ),
});
