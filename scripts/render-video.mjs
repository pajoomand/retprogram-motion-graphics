import { spawnSync } from "node:child_process";
import path from "node:path";
import { findStoryboard, requireStoryboardApproval } from "./storyboard-workflow.mjs";

const [id] = process.argv.slice(2);
const context = await findStoryboard(process.cwd(), id);
if (context) {
  await requireStoryboardApproval(context);
  throw new Error("Use qa:preview/qa:video for production review, or export:video after human video approval. Direct production export is disabled for storyboard-managed videos.");
}
const result = spawnSync(process.execPath, [
  path.resolve("node_modules", "@remotion", "cli", "remotion-cli.js"),
  "render",
  ...process.argv.slice(2),
], { stdio: "inherit" });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
