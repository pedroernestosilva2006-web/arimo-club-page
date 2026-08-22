import { createFileRoute } from "@tanstack/react-router";
import { PasswordSetup } from "@/components/platform/PasswordSetup";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Nova senha · ARIMO CLUB" }, { name: "robots", content: "noindex" }],
  }),
  component: () => <PasswordSetup mode="recovery" />,
});
