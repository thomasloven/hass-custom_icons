import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

const dev = process.env.ROLLUP_WATCH;

module.exports = [
  {
    input: "js/loader/main.ts",
    output: {
      file: "custom_components/custom_icons/loader.js",
      format: "es",
    },
    plugins: [
      nodeResolve(),
      json(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),
      !dev && terser({ format: { comments: false } }),
      typescript(),
      commonjs(),
    ],
  },
  {
    input: "js/panel/main.ts",
    output: {
      file: "custom_components/custom_icons/panel.js",
      format: "es",
    },
    plugins: [
      nodeResolve(),
      json(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),
      !dev && terser({ format: { comments: false } }),
      typescript(),
      commonjs(),
    ],
  },
];
