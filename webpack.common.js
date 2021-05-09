const path = require("path");

module.exports = {
  entry: "./src/client/script.tsx",
  output: {
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {   
          test: /\.tsx?$/, 
          use: [{loader: 'ts-loader', options: {onlyCompileBundledFiles: true}}],
          include: path.resolve(__dirname, 'src/client'),
          exclude: /node_modules/
      }
    ]
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};
