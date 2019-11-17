module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/client/script.ts",
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
            loader: "ts-loader" ,
            exclude: /node_modules/
        }
      ]
    }
  };