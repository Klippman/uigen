"use client";

import { Loader2 } from "lucide-react";

interface ToolStatusBadgeProps {
  toolName: string;
  args: Record<string, unknown> | string;
  state: "partial-call" | "call" | "result";
  result?: unknown;
}

function parseArgs(args: Record<string, unknown> | string): Record<string, unknown> {
  if (typeof args === "string") {
    try {
      return JSON.parse(args);
    } catch {
      return {};
    }
  }
  return args || {};
}

function getToolMessage(toolName: string, args: Record<string, unknown>): string {
  const command = args.command as string | undefined;
  const path = args.path as string | undefined;
  const oldPath = args.old_path as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return path ? `Creating ${path}` : "Creating file";
      case "view":
        return path ? `Reading ${path}` : "Reading file";
      case "str_replace":
      case "insert":
        return path ? `Editing ${path}` : "Editing file";
      default:
        return path ? `${toolName} ${path}` : toolName;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "delete":
        return path ? `Deleting ${path}` : "Deleting file";
      case "rename":
        return oldPath ? `Renaming ${oldPath}` : "Renaming file";
      default:
        return path || oldPath ? `${toolName} ${path || oldPath}` : toolName;
    }
  }

  return toolName;
}

export function ToolStatusBadge({ toolName, args, state, result }: ToolStatusBadgeProps) {
  const parsedArgs = parseArgs(args);
  const message = getToolMessage(toolName, parsedArgs);
  const isComplete = state === "result" && result !== undefined;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
