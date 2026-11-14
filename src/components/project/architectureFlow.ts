import { useState } from "react";
import {
  Database,
  Globe,
  Layers,
  Plug,
  Server,
  type LucideIcon,
} from "lucide-react";
import type {
  ArchitectureNodeRole,
  FeaturedProject,
  ProjectArchitectureItem,
} from "../../data/projects";

export interface NormalizedArchitectureNode {
  id: string;
  role: ArchitectureNodeRole;
  item: ProjectArchitectureItem;
}

const ROLE_ORDER: Record<ArchitectureNodeRole, number> = {
  edge: 0,
  frontend: 1,
  compute: 2,
  data: 3,
  integration: 4,
};

export const ROLE_ICON: Record<ArchitectureNodeRole, LucideIcon> = {
  edge: Globe,
  frontend: Layers,
  compute: Server,
  data: Database,
  integration: Plug,
};

export const ROLE_LABELS: Record<
  ArchitectureNodeRole,
  { pt: string; en: string }
> = {
  edge: { pt: "Edge / CDN", en: "Edge / CDN" },
  frontend: { pt: "Front-end", en: "Frontend" },
  compute: { pt: "API / Compute", en: "API / Compute" },
  data: { pt: "Auth & Dados", en: "Auth & Data" },
  integration: { pt: "Integrações", en: "Integrations" },
};

function inferNodeRole(
  item: ProjectArchitectureItem,
  fallbackIdx: number,
): ArchitectureNodeRole {
  if (item.nodeRole) return item.nodeRole;
  const text = `${item.layer.en} ${item.technologies.join(" ")}`.toLowerCase();
  if (text.includes("cloudflare") || text.includes("infrastructure")) {
    return "edge";
  }
  if (text.includes("frontend") || text.includes("react")) return "frontend";
  if (
    text.includes("fastify") ||
    text.includes("node") ||
    text.includes("render") ||
    text.includes("api")
  ) {
    return "compute";
  }
  if (text.includes("integration") || text.includes("resend")) {
    return "integration";
  }
  if (
    text.includes("supabase") ||
    text.includes("neon") ||
    text.includes("postgres")
  ) {
    return "data";
  }
  return fallbackIdx === 0 ? "frontend" : "data";
}

/**
 * Normalizes and sorts a project's architecture layers into logical topology
 * execution order (Edge -> Frontend -> API/Compute -> Auth & Data -> Integrations).
 */
export function getOrderedArchitectureNodes(
  project: FeaturedProject,
): NormalizedArchitectureNode[] {
  return project.architecture
    .map((item, idx) => {
      const role = inferNodeRole(item, idx);
      return {
        id: item.id ?? `${role}-${idx}`,
        role,
        item,
      };
    })
    .sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);
}

export function getArchitectureNodeById(
  nodes: NormalizedArchitectureNode[],
  id: string,
): NormalizedArchitectureNode | undefined {
  return nodes.find((node) => node.id === id);
}

/**
 * Shared directional inspector content variants (`mode="popLayout"` inside a
 * persistent `.bento-card` prevents full-container flicker when switching nodes).
 */
export const INSPECTOR_FLOW_VARIANTS = {
  enter: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction * 24,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      x: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
      opacity: {
        duration: 0.24,
        delay: 0.04,
        ease: [0.22, 1, 0.36, 1] as const,
      },
      filter: {
        duration: 0.26,
        delay: 0.03,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction * -16,
    filter: "blur(5px)",
    transition: { duration: 0.11, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * Tracks active layer id alongside navigation direction (`1` forward, `-1` back)
 * with automatic fallback if the underlying node array changes.
 */
export function useDirectionalLayer(nodes: NormalizedArchitectureNode[]) {
  const [selection, setSelection] = useState<{
    id: string;
    direction: 1 | -1;
  }>({
    id: nodes[0]?.id ?? "",
    direction: 1,
  });

  const activeId = nodes.some((n) => n.id === selection.id)
    ? selection.id
    : (nodes[0]?.id ?? "");

  const selectLayer = (nextId: string) => {
    setSelection((prev) => {
      const currentId = nodes.some((n) => n.id === prev.id)
        ? prev.id
        : (nodes[0]?.id ?? "");
      if (currentId === nextId) return prev;
      const prevIdx = nodes.findIndex((n) => n.id === currentId);
      const nextIdx = nodes.findIndex((n) => n.id === nextId);
      return {
        id: nextId,
        direction: prevIdx >= 0 && nextIdx < prevIdx ? -1 : 1,
      };
    });
  };

  return {
    selectedId: activeId,
    direction: selection.direction,
    selectLayer,
  };
}
