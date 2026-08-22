import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const roles = ["SÓCIOS", "CLIENTES", "FORNECEDORES", "NETWORK"];

function RoleGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="arimo-relations-group" aria-hidden={duplicate || undefined}>
      {roles.map((role, index) => (
        <span
          key={role}
          className={cn("arimo-relations-item", index % 2 === 1 && "arimo-serif italic")}
        >
          {role}
        </span>
      ))}
    </div>
  );
}

export function RelationshipPerspectiveMarquee() {
  const rows = [
    { duration: 31, reverse: false, depth: "is-back" },
    { duration: 24, reverse: true, depth: "is-front" },
    { duration: 36, reverse: false, depth: "is-mid" },
  ];

  return (
    <div
      className="arimo-relations-perspective"
      role="img"
      aria-label="Sócios, clientes, fornecedores e network em movimento"
    >
      <div className="arimo-relations-stage">
        {rows.map((row, index) => (
          <div
            key={row.depth}
            className={cn("arimo-relations-row", row.reverse && "is-reverse", row.depth)}
            style={{ "--relations-duration": `${row.duration}s` } as CSSProperties}
          >
            <div className="arimo-relations-track">
              <RoleGroup />
              <RoleGroup duplicate />
            </div>
          </div>
        ))}
      </div>
      <div className="arimo-relations-fade is-left" aria-hidden="true" />
      <div className="arimo-relations-fade is-right" aria-hidden="true" />
      <div className="arimo-relations-scan" aria-hidden="true" />
    </div>
  );
}
