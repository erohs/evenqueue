import tseslint from "typescript-eslint";

const namingConvention = [
    "error",
    { selector: "default", format: ["camelCase"] },
    // `_` marks a parameter a callback must accept but does not use.
    { selector: "parameter", filter: { regex: "^_$", match: true }, format: null },
    { selector: "import", format: ["camelCase", "PascalCase"] },
    { selector: "typeLike", format: ["PascalCase"] },
    { selector: "interface", format: ["PascalCase"], prefix: ["I"] },
    {
        selector: ["variable", "parameter", "typeProperty"],
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["is", "has", "should", "can"],
    },
    { selector: "objectLiteralProperty", modifiers: ["requiresQuotes"], format: null },
];

// Each layer may import only the layers beneath it: entry points → web → application → domain, with adapters
// implementing application ports. A relative import stays inside its own area; anything else uses an alias.
const crossingAreas = {
    group: ["../../*", "../../**"],
    message: "Import from another area with its alias, e.g. #domain/…",
};
// A regex, because `group` patterns use .gitignore syntax, where a leading `#` starts a comment.
const layer = (name) => ({ regex: `^#${name}/`, message: `This layer must not import #${name}.` });
const nodeBuiltIns = { regex: "^node:", message: "Runtime code uses web-standard APIs only, so it runs on Workers." };
const testSupport = { regex: "^#tests/", message: "Only tests import test support." };
const restrictImports = (files, ignores, patterns) => ({
    files,
    ignores,
    rules: { "no-restricted-imports": ["error", { patterns }] },
});

const importBoundaries = [
    restrictImports(["**/*.ts"], [], [crossingAreas]),
    restrictImports(
        ["src/domain/**/*.ts"],
        ["**/tests/**"],
        [crossingAreas, layer("application"), layer("adapters"), layer("web"), nodeBuiltIns, testSupport],
    ),
    restrictImports(
        ["src/domain/**/tests/**/*.ts"],
        [],
        [crossingAreas, layer("application"), layer("adapters"), layer("web")],
    ),
    restrictImports(
        ["src/application/**/*.ts"],
        ["**/tests/**"],
        [crossingAreas, layer("adapters"), layer("web"), nodeBuiltIns, testSupport],
    ),
    restrictImports(["src/adapters/**/*.ts"], ["**/tests/**"], [crossingAreas, layer("web"), testSupport]),
    restrictImports(
        ["src/web/**/*.ts"],
        ["**/tests/**"],
        [crossingAreas, layer("adapters"), nodeBuiltIns, testSupport],
    ),
];

export default [
    {
        ignores: ["node_modules/", ".wrangler/", "dist/", "coverage/", "eslint.config.js"],
    },
    ...tseslint.configs.strict,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
        },
        rules: {
            "max-lines": ["error", { max: 400, skipBlankLines: true, skipComments: true }],
            "max-lines-per-function": ["error", { max: 25, skipBlankLines: true, skipComments: true }],
            "func-style": ["error", "expression"],
            "prefer-arrow-callback": "error",
            "no-restricted-syntax": ["error", { selector: "FunctionExpression", message: "Use an arrow function." }],
            curly: ["error", "multi-line", "consistent"],
            "@typescript-eslint/naming-convention": namingConvention,
            "@typescript-eslint/explicit-module-boundary-types": "error",
        },
    },
    ...importBoundaries,
];
