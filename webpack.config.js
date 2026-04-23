import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDirectory = path.resolve(__dirname, "src/main/resources/static/typescript");

export default {
  devtool: "inline-source-map",
  entry: {
    cadastro: path.resolve(baseDirectory, "application/paginas/cadastro.ts"),
    callbacksElementos: path.resolve(
      baseDirectory,
      "application/paginas/editor/callbacksElementos.ts",
    ),
    cookiesBanner: path.resolve(baseDirectory, "application/paginas/cookiesBanner.ts"),
    desligar: path.resolve(baseDirectory, "application/paginas/desligar.ts"),
    editor: path.resolve(baseDirectory, "application/paginas/editor/editor.ts"),
    login: path.resolve(baseDirectory, "application/paginas/login.ts"),
    toolbar: path.resolve(baseDirectory, "application/paginas/editor/toolbar.ts"),
  },
  output: {
    path: path.resolve(__dirname, "src/main/resources/static/javascript"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};
