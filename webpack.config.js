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
    criarAtividade: path.resolve(baseDirectory, "application/paginas/criarAtividade.ts"),
    desligar: path.resolve(baseDirectory, "application/paginas/desligar.ts"),
    editor: path.resolve(baseDirectory, "application/paginas/editor/editor.ts"),
    helperAbrirNovoArquivo: path.resolve(
      baseDirectory,
      "application/paginas/editor/helperAbrirNovoArquivo",
    ),
    helperEditorDescricaoModeloRelacional: path.resolve(
      baseDirectory,
      "application/paginas/editor/helperEditorDescricaoModeloRelacional",
    ),
    helperSeletorTipoDiagrama: path.resolve(
      baseDirectory,
      "application/paginas/helperSeletorTipoDiagrama",
    ),
    login: path.resolve(baseDirectory, "application/paginas/login.ts"),
    salvar: path.resolve(baseDirectory, "application/paginas/editor/salvar.ts"),
    quill: "quill",
  },
  output: {
    path: path.resolve(__dirname, "src/main/resources/static/javascript"),
  },
  module: {
    rules: [
      {
        test: /\.([jt])s?$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".css"],
  },
};
