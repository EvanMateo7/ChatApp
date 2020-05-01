const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
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
            loader: "ts-loader",
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