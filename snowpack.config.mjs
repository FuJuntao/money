/** @type {import("snowpack").SnowpackUserConfig } */
const config = {
  mount: { public: { url: '/', static: true }, src: { url: '/dist' } },
  routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
  ],
  packageOptions: {},
  devOptions: {},
  buildOptions: {
    sourcemap: 'inline',
  },
};

export default config;
