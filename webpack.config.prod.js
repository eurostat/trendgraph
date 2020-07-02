const path = require("path");
module.exports = {
    mode: "production",
    entry: ["./src/trendgraph.js"],
    output: {
        filename: "trendgraph.min.js",
        publicPath: "build",
        library: "trendgraph",
        libraryTarget: "umd",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    watch: false,
    optimization: {
        usedExports: true
    }
};
