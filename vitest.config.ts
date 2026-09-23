import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    // e2e is Playwright; security hits the live project and has its own config.
    exclude: ["node_modules/**", "tests/e2e/**", "tests/security/**"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: ["src/lib/**"],
      // supabase.ts only builds a client from env; it has no branch worth covering.
      exclude: ["src/lib/supabase.ts"],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70,
      },
    },
  },
});
