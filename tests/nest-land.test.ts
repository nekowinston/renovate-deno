import { assertEquals } from "https://deno.land/std@0.210.0/assert/assert_equals.ts";

import renovateCfg from "@/sources/nest-land.json" with { type: "json" };
import { getMatches } from "@/tests/_helpers.ts";

const cases = [
  {
    title: "import map: should accept x.nest.land",
    input: `{
      "imports": {
        "sample": "https://x.nest.land/sample@0.0.1/mod.ts",
      }
    }`,
    currentValue: "0.0.1",
    depName: "sample",
  },
  {
    title: "import map: should accept x.nest.land with `v`",
    input: `{
      "imports": {
        "sample": "https://x.nest.land/sample@v0.0.1/mod.ts",
      }
    }`,
    currentValue: "v0.0.1",
    depName: "sample",
  },
  {
    title: "source code: should accept x.nest.land",
    input: `import { sample } from "https://x.nest.land/sample@0.0.1/mod.ts";`,
    currentValue: "0.0.1",
    depName: "sample",
  },
  {
    title: "source code: should accept x.nest.land with `v`",
    input: `import { sample } from "https://x.nest.land/sample@v0.0.1/mod.ts";`,
    currentValue: "v0.0.1",
    depName: "sample",
  },
  {
    title: "deno-types: should accept x.nest.land",
    input: `// @deno-types="https://x.nest.land/sample@0.0.1/mod.ts";`,
    currentValue: "0.0.1",
    depName: "sample",
  },
  {
    title: "deno-types: should accept x.nest.land with `v`",
    input: `// @deno-types="https://x.nest.land/sample@v0.0.1/mod.ts";`,
    currentValue: "v0.0.1",
    depName: "sample",
  },
] as const;

for (const { title, input, currentValue, depName } of cases) {
  Deno.test(title, () => {
    const matches = getMatches(renovateCfg, input)[0];
    assertEquals(matches?.depName, depName);
    assertEquals(matches?.currentValue, currentValue);
  });
}
