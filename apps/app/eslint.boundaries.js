import boundaries from "eslint-plugin-boundaries";

export const eslintBoundariesConfig = {
  plugins: { boundaries },

  settings: {
    "import/resolver": { typescript: { alwaysTryTypes: true } },
    "boundaries/elements": [
      { type: "app", pattern: "src/app" },
      { type: "features", pattern: "src/features/*" },
      { type: "shared", pattern: "src/shared" },
    ],
  },

  rules: {
    "boundaries/dependencies": [
      "error",
      {
        default: "allow",
        message: "❌ {{from.type}} → {{to.type}} ({{dependency.source}})",
        rules: [
          {
            from: { type: "shared" },
            disallow: { to: { type: ["app", "features"] } },
          },
          {
            from: { type: "features" },
            disallow: { to: { type: "app" } },
          },
          {
            disallow: {
              to: {
                type: "features",
                internalPath: "!{index,*.page}.{ts,tsx}",
              },
            },
          },
        ],
      },
    ],
  },
};
