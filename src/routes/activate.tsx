import { createFileRoute } from "@tanstack/react-router";
import { PasswordSetup } from "@/components/platform/PasswordSetup";

export const Route = createFileRoute("/activate")({
  head: () => ({
    meta: [{ title: "Ative seu acesso · ARIMO CLUB" }, { name: "robots", content: "noindex" }],
  }),
  component: () => <PasswordSetup mode="invite" />,
});
