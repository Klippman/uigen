import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolStatusBadge } from "../ToolStatusBadge";

afterEach(() => {
  cleanup();
});

// str_replace_editor tests
test("shows 'Creating {path}' for str_replace_editor create command", () => {
  render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows 'Reading {path}' for str_replace_editor view command", () => {
  render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "/components/Card.jsx" }}
      state="result"
      result="file contents"
    />
  );

  expect(screen.getByText("Reading /components/Card.jsx")).toBeDefined();
});

test("shows 'Editing {path}' for str_replace_editor str_replace command", () => {
  render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/Card.jsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("Editing /Card.jsx")).toBeDefined();
});

test("shows 'Editing {path}' for str_replace_editor insert command", () => {
  render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/utils.js" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("Editing /utils.js")).toBeDefined();
});

// file_manager tests
test("shows 'Deleting {path}' for file_manager delete command", () => {
  render(
    <ToolStatusBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/old-file.jsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("Deleting /old-file.jsx")).toBeDefined();
});

test("shows 'Renaming {old_path}' for file_manager rename command", () => {
  render(
    <ToolStatusBadge
      toolName="file_manager"
      args={{ command: "rename", old_path: "/Button.jsx", new_path: "/PrimaryButton.jsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("Renaming /Button.jsx")).toBeDefined();
});

// JSON string args parsing
test("parses args from JSON string", () => {
  render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={JSON.stringify({ command: "create", path: "/Header.jsx" })}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("Creating /Header.jsx")).toBeDefined();
});

// Loading state tests
test("shows spinner for partial-call state", () => {
  const { container } = render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="partial-call"
    />
  );

  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows spinner for call state", () => {
  const { container } = render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );

  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

// Complete state test
test("shows green dot for result state with result", () => {
  const { container } = render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result="Success"
    />
  );

  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// Unknown tool fallback
test("falls back to raw tool name for unknown tools", () => {
  render(
    <ToolStatusBadge
      toolName="unknown_tool"
      args={{ some: "arg" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

// Malformed/empty args fallback
test("handles malformed JSON string args gracefully", () => {
  render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args="not valid json"
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("handles empty args object", () => {
  render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{}}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("shows generic message when path is missing for create command", () => {
  render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{ command: "create" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("Creating file")).toBeDefined();
});

test("shows spinner when result state but no result value", () => {
  const { container } = render(
    <ToolStatusBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result={undefined}
    />
  );

  expect(container.querySelector(".animate-spin")).not.toBeNull();
});
