import { assertEquals } from "https://deno.land/std@0.210.0/assert/assert_equals.ts";

import renovateCfg from "@/sources/deno-land.json" with { type: "json" };
import { getMatches } from "@/tests/_helpers.ts";

const cases = [
  {
    title: "import map: should accept deno.land/std",
    input: `{
      "import_map": {
        "std": "https://deno.land/std@0.204.0",
      }
    }`,
    currentValue: "0.204.0",
    depName: "https://deno.land/std",
  },
  {
    title: "import map: should accept if 'v' in version",
    input: `{
      "import_map": {
        "path": "https://deno.land/std@v0.204.0/path/mod.ts",
      }
    }`,
    currentValue: "v0.204.0",
    depName: "https://deno.land/std",
  },
  {
    title: "import map: should accept deno.land/x",
    input: `{
      "import_map": {
        "some": "https://deno.land/x/some_module@v0.1.0",
      }
    }`,
    currentValue: "v0.1.0",
    depName: "https://deno.land/x/some_module",
  },
  {
    title: "source code: should accept deno.land/std",
    input: `import { join } from "https://deno.land/std@0.204.0/path/mod.ts";`,
    currentValue: "0.204.0",
    depName: "https://deno.land/std",
  },
  {
    title: "source code: should accept export specifier",
    input: `export { someFuncion } from "https://deno.land/std@0.204.0/some/mod.ts";`,
    currentValue: "0.204.0",
    depName: "https://deno.land/std",
  },
  {
    title: "source code: should accept if 'v' in version",
    input: `import { someFuncion } from "https://deno.land/std@v1.0.0/some/mod.ts";`,
    currentValue: "v1.0.0",
    depName: "https://deno.land/std",
  },
  {
    title: "source code: should accept deno.land/x",
    input: `export { someFuncion } from "https://deno.land/x/some_module@0.1.0/some/mod.ts";`,
    currentValue: "0.1.0",
    depName: "https://deno.land/x/some_module",
  },
  {
    title: "source code: should accept deno.land/std in //@deno-types",
    input: `// @deno-types="https://deno.land/std@0.204.0/path/mod.ts";`,
    currentValue: "0.204.0",
    depName: "https://deno.land/std",
  },
  {
    title: "source code: should accept if 'v' in version in //@deno-types",
    input: `// @deno-types="https://deno.land/std@v1.0.0/some/mod.ts";`,
    currentValue: "v1.0.0",
    depName: "https://deno.land/std",
  },
  {
    title: "source code: should accept deno.land/x in //@deno-types",
    input: `// @deno-types="https://deno.land/x/some_module@0.1.0/some/mod.ts";`,
    currentValue: "0.1.0",
    depName: "https://deno.land/x/some_module",
  },
] as const;

for (const { title, input, currentValue, depName } of cases) {
  Deno.test(title, () => {
    const matches = getMatches(renovateCfg, input)[0];
    assertEquals(matches?.depName, depName);
    assertEquals(matches?.currentValue, currentValue);
  });
}
