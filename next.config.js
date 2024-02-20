/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images: {
        domains: ["oaidalleapiprodscus.blob.core.windows.net", "replicate.delivery", "res.cloudinary.com"],
    },

};

export default config;
