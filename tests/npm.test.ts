import { assertEquals } from "https://deno.land/std@0.210.0/assert/assert_equals.ts";

import renovateCfg from "@/sources/npm.json" with { type: "json" };
import { getMatches } from "@/tests/_helpers.ts";

const cases = [
  {
    title: "import map: should accept npm specifier",
    input: `{
      "imports": {
        "chalk": "npm:chalk@5.0.1",
      }
    }`,
    currentValue: "5.0.1",
    depName: "chalk",
  },
  {
    title: "import map: should accept npm specifier with only major version",
    input: `{
      "imports": {
        "chalk": "npm:chalk@5",
      }
    }`,
    currentValue: "5",
    depName: "chalk",
  },
  {
    title: "import map: should accept esm.sh specifier",
    input: `{
      "imports": {
        "chalk": "https://esm.sh/chalk@5.0.1",
      }
    }`,
    currentValue: "5.0.1",
    depName: "chalk",
  },
  {
    title: "import map: should accept esm.sh specifier with query",
    input: `{
      "imports": {
        "tslib": "https://esm.sh/tslib@2.6.2?exports=__await,__rest",
      }
    }`,
    currentValue: "2.6.2",
    depName: "tslib",
  },
  {
    title: "import map: should accept unpkg.com specifier",
    input: `{
      "imports": {
        "foo": "https://unpkg.com/@bar/foo@0.1.0/foo.ts",
      }
    }`,
    currentValue: "0.1.0",
    depName: "@bar/foo",
  },
  {
    title: "import map: should accept unpkg.com specifier without @scope",
    input: `{
      "imports": {
        "foo": "https://unpkg.com/foo@0.1.0/umd/foo.production.min.js",
      }
    }`,
    currentValue: "0.1.0",
    depName: "foo",
  },
  {
    title: "import map: should accept skypack.dev specifier",
    input: `{
      "imports": {
        "foo": "https://cdn.skypack.dev/@scope/package@10.5.5",
      }
    }`,
    currentValue: "10.5.5",
    depName: "@scope/package",
  },
  {
    title: "import map: should accept skypack.dev with query",
    input: `{
      "imports": {
        "foo": "https://cdn.skypack.dev/@scope/package@10.5.5?min",
      }
    }`,
    currentValue: "10.5.5",
    depName: "@scope/package",
  },
  {
    title: "source code: should accept npm specifier",
    input: `import chalk from "npm:chalk@5.0.1";`,
    currentValue: "5.0.1",
    depName: "chalk",
  },
  {
    title: "source code: should accept npm specifier with only major version",
    input: `import chalk from "npm:chalk@5";`,
    currentValue: "5",
    depName: "chalk",
  },
  {
    title: "source code: should accept esm.sh specifier",
    input: `export chalk from "https://esm.sh/chalk@5.0.1";`,
    currentValue: "5.0.1",
    depName: "chalk",
  },
  {
    title: "source code: should accept esm.sh specifier with prefix",
    input: `export chalk from "https://esm.sh/v135/chalk@5.0.1";`,
    currentValue: "5.0.1",
    depName: "chalk",
  },
  {
    title: "source code: should accept esm.sh specifier with query",
    input: `import { __await, __rest } from "https://esm.sh/tslib@2.6.2?exports=__await,__rest";`,
    currentValue: "2.6.2",
    depName: "tslib",
  },
  {
    title: "source code: should accept unpkg.com specifier",
    input: `import foo from "https://unpkg.com/@bar/foo@0.1.0/foo.ts";`,
    currentValue: "0.1.0",
    depName: "@bar/foo",
  },
  {
    title: "source code: should accept unpkg.com specifier without @scope",
    input: `import foo from "https://unpkg.com/foo@0.1.0/umd/foo.production.min.js";`,
    currentValue: "0.1.0",
    depName: "foo",
  },
  {
    title: "source code: should accept skypack.dev specifier",
    input: `import foo from "https://cdn.skypack.dev/@scope/package@10.5.5";`,
    currentValue: "10.5.5",
    depName: "@scope/package",
  },
  {
    title: "source code: should accept skypack.dev with query",
    input: `import foo from "https://cdn.skypack.dev/@scope/package@10.5.5?min";`,
    currentValue: "10.5.5",
    depName: "@scope/package",
  },
  {
    title: "deno-types: should accept npm specifier",
    input: `// @deno-types="npm:chalk@5.0.1";`,
    currentValue: "5.0.1",
    depName: "chalk",
  },
  {
    title: "deno-types: should accept npm specifier with only major version",
    input: `// @deno-types="npm:chalk@5";`,
    currentValue: "5",
    depName: "chalk",
  },
  {
    title: "deno-types: should accept esm.sh specifier",
    input: `// @deno-types="https://esm.sh/chalk@5.0.1";`,
    currentValue: "5.0.1",
    depName: "chalk",
  },
  {
    title: "deno-types: should accept esm.sh specifier with prefix",
    input: `// @deno-types="https://esm.sh/v135/chalk@5.0.1";`,
    currentValue: "5.0.1",
    depName: "chalk",
  },
  {
    title: "deno-types: should accept esm.sh specifier with query",
    input: `// @deno-types="https://esm.sh/tslib@2.6.2?exports=__await,__rest";`,
    currentValue: "2.6.2",
    depName: "tslib",
  },
  {
    title: "deno-types: should accept unpkg.com specifier",
    input: `// @deno-types="https://unpkg.com/@bar/foo@0.1.0/foo.ts";`,
    currentValue: "0.1.0",
    depName: "@bar/foo",
  },
  {
    title: "deno-types: should accept unpkg.com specifier without @scope",
    input: `// @deno-types="https://unpkg.com/foo@0.1.0/umd/foo.production.min.js";`,
    currentValue: "0.1.0",
    depName: "foo",
  },
  {
    title: "deno-types: should accept skypack.dev specifier",
    input: `// @deno-types="https://cdn.skypack.dev/@scope/package@10.5.5";`,
    currentValue: "10.5.5",
    depName: "@scope/package",
  },
  {
    title: "deno-types: should accept skypack.dev with query",
    input: `// @deno-types="https://cdn.skypack.dev/@scope/package@10.5.5?min";`,
    currentValue: "10.5.5",
    depName: "@scope/package",
  },
] as const;

for (const { title, input, currentValue, depName } of cases) {
  Deno.test(title, () => {
    const matches = getMatches(renovateCfg, input)[0];
    assertEquals(matches?.depName, depName);
    assertEquals(matches?.currentValue, currentValue);
  });
}
