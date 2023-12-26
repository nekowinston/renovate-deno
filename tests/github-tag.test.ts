import { assertEquals } from "https://deno.land/std@0.210.0/assert/assert_equals.ts";

import renovateCfg from "@/sources/github-tag.json" with { type: "json" };
import { getMatches } from "@/tests/_helpers.ts";

const cases = [
  {
    title: "import map: should accept raw.githubusercontent.com",
    input: `{
      "imports": {
        "sample": "https://raw.githubusercontent.com/user/repo/1.0.0/mod.ts",
      }
    }`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "import map: should accept raw.githubusercontent.com complex semver version",
    input: `{
      "imports": {
        "sample": "https://raw.githubusercontent.com/user/repo/1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay/mod.ts"
      }
    }`,
    currentValue: "1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay",
    depName: "user/repo",
  },
  {
    title: "import map: should accept raw.githubusercontent.com non-semver version",
    input: `{
      "imports": {
        "sample": "https://raw.githubusercontent.com/user/repo/sampleversion/mod.ts"
      }
    }`,
    currentValue: "sampleversion",
    depName: "user/repo",
  },
  {
    title: "import map: should accept esm.sh/gh/",
    input: `{
      "imports": {
        "sample": "https://esm.sh/gh/user/repo/1.0.0/mod.ts",
      }
    }`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "import map: should accept esm.sh/gh/ complex semver version",
    input: `{
      "imports": {
        "sample": "https://esm.sh/gh/user/repo/1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay/mod.ts"
      }
    }`,
    currentValue: "1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay",
    depName: "user/repo",
  },
  {
    title: "import map: should accept esm.sh/gh/ non-semver version",
    input: `{
      "imports": {
        "sample": "https://esm.sh/gh/user/repo/sampleversion/mod.ts"
      }
    }`,
    currentValue: "sampleversion",
    depName: "user/repo",
  },
  {
    title: "import map: should accept pax.deno.dev",
    input: `{
      "imports": {
        "sample": "https://pax.deno.dev/user/repo@1.0.0/mod.ts",
      }
    }`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "import map: should accept pax.deno.dev omitting 'mod.ts'",
    input: `{
      "imports": {
        "sample": "https://pax.deno.dev/user/repo@1.0.0",
      }
    }`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "source code: should accept raw.githubusercontent.com",
    input: `import { sample } from "https://raw.githubusercontent.com/user/repo/1.0.0/mod.ts"`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "source code: should accept raw.githubusercontent.com complex semver version",
    input: `import { sample } from "https://raw.githubusercontent.com/user/repo/1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay/mod.ts"`,
    currentValue: "1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay",
    depName: "user/repo",
  },
  {
    title: "source code: should accept raw.githubusercontent.com non-semver version",
    input: `import { sample } from "https://raw.githubusercontent.com/user/repo/sampleversion/mod.ts"`,
    currentValue: "sampleversion",
    depName: "user/repo",
  },
  {
    title: "source code: should accept esm.sh/gh/",
    input: `import { sample } from "https://esm.sh/gh/user/repo/1.0.0/mod.ts"`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "source code: should accept esm.sh/gh/ complex semver version",
    input: `import { sample } from "https://esm.sh/gh/user/repo/1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay/mod.ts"`,
    currentValue: "1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay",
    depName: "user/repo",
  },
  {
    title: "source code: should accept esm.sh/gh/ non-semver version",
    input: `import { sample } from "https://esm.sh/gh/user/repo/sampleversion/mod.ts"`,
    currentValue: "sampleversion",
    depName: "user/repo",
  },
  {
    title: "source code: should accept pax.deno.dev",
    input: `import { sample } from "https://pax.deno.dev/user/repo@1.0.0/mod.ts"`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "source code: should accept pax.deno.dev ommitting 'mod.ts'",
    input: `import { sample } from "https://pax.deno.dev/user/repo@1.0.0"`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "deno-types: should accept raw.githubusercontent.com",
    input: `// @deno-types="https://raw.githubusercontent.com/user/repo/1.0.0/mod.ts"`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "deno-types: should accept raw.githubusercontent.com complex semver version",
    input: `// @deno-types="https://raw.githubusercontent.com/user/repo/1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay/mod.ts"`,
    currentValue: "1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay",
    depName: "user/repo",
  },
  {
    title: "deno-types: should accept raw.githubusercontent.com non-semver version",
    input: `// @deno-types="https://raw.githubusercontent.com/user/repo/sampleversion/mod.ts"`,
    currentValue: "sampleversion",
    depName: "user/repo",
  },
  {
    title: "deno-types: should accept esm.sh/gh/",
    input: `// @deno-types="https://esm.sh/gh/user/repo/1.0.0/mod.ts"`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "deno-types: should accept esm.sh/gh/ complex semver version",
    input: `// @deno-types="https://esm.sh/gh/user/repo/1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay/mod.ts"`,
    currentValue: "1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay",
    depName: "user/repo",
  },
  {
    title: "deno-types: should accept esm.sh/gh/ non-semver version",
    input: `// @deno-types="https://esm.sh/gh/user/repo/sampleversion/mod.ts"`,
    currentValue: "sampleversion",
    depName: "user/repo",
  },
  {
    title: "deno-types: should accept pax.deno.dev",
    input: `// @deno-types="https://pax.deno.dev/user/repo@1.0.0/mod.ts"`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
  {
    title: "deno-types: should accept pax.deno.dev ommitting 'mod.ts'",
    input: `// @deno-types="https://pax.deno.dev/user/repo@1.0.0"`,
    currentValue: "1.0.0",
    depName: "user/repo",
  },
] as const;

for (const { title, input, currentValue, depName } of cases) {
  Deno.test(title, () => {
    const matches = getMatches(renovateCfg, input)[0];
    assertEquals(matches?.depName, depName);
    assertEquals(matches?.currentValue, currentValue);
  });
}
