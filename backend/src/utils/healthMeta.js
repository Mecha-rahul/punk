/**
 * Injects deploy visibility into /api/v1/health.
 *
 * Why: the deployed Railway service has twice shipped stale code while
 * "redeploys" looked green (merge landed, deploy didn't rebuild). Adding the
 * git commit + boot time to /health makes staleness detectable from a single
 * curl, instead of only noticing when an admin route 404s.
 *
 * Rendered in src/app.js; reads what env.js exposes (RENDER_GIT_COMMIT,
 * RAILWAY_GIT_COMMIT_SHA, or VERCEL_GIT_COMMIT_SHA — set by the platforms).
 */

/**
 * Adds `data.commit` and `data.bootedAt` to the health payload.
 * @param {import("express").Express} app
 */
export function attachHealthMeta(app) {
  const commit =
    process.env.RENDER_GIT_COMMIT ||
    process.env.RAILWAY_GIT_COMMIT_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.COMMIT_SHA ||
    null;

  const bootedAt = new Date().toISOString();

  app.get("/api/v1/health", (_req, res) => {
    res.json({
      success: true,
      message: "API is up",
      data: { commit: commit ? commit.slice(0, 7) : "unknown", bootedAt },
    });
  });
}
