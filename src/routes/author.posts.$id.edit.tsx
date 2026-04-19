import { createFileRoute } from "@tanstack/react-router";
import { AuthorGuard } from "@/components/author/AuthorGuard";
import { AuthorLayout } from "@/components/author/AuthorLayout";
import { PostFormPage } from "./author.posts.new";

export const Route = createFileRoute("/author/posts/$id/edit")({
  head: () => ({ meta: [{ title: "Edit post - Author" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AuthorGuard>
      <AuthorLayout>
        <PostFormPage mode="edit" />
      </AuthorLayout>
    </AuthorGuard>
  ),
});
