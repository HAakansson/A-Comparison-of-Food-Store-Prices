module.exports = {
  devServer: {
    proxy: {
      "^/rest/": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
      "^/api/": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
