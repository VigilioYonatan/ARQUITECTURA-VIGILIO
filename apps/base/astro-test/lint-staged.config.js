module.exports = {
    "*.{ts,tsx}": [
        "pnpm exec biome check --write",
        "pnpm exec biome format --write",
    ],
    "*.{json,md}": ["pnpm exec biome format --write"],
};
