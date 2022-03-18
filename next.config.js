module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    GRAPHQL_BACKEND: process.env.GRAPHQL_BACKEND || 'http://0.0.0.0',
  },
}
