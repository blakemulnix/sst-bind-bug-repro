# sst-bind-bug-repro

Repro of this [bug](https://github.com/sst/sst/issues/3270).

## Steps taken:

```bash
npx create-next-app@latest 

# ✔ What is your project named? … sst-bind-bug-repro
# ✔ Would you like to use TypeScript? … Yes
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like to use `src/` directory? … Yes
# ✔ Would you like to use App Router? (recommended) … Yes
# ✔ Would you like to customize the default import alias (@/*)? … No

cd sst-bind-bug-repro

# ? You are in a Next.js project so SST will be setup in drop-in mode. Continue? Yes
# ✔ Copied template files

npx create-sst@latest

yarn

yarn dev

# yarn run v1.22.19
# $ sst bind next dev
# Please enter a name you’d like to use for your personal stage. Or hit enter to use codespace: 
# Warning: The site has not been deployed. Some resources might not be available.

#    ▲ Next.js 14.0.4
#    - Local:        http://localhost:3000

```

At this point, the Next app comes up sucessfully at `localhost:3000`.

Now I'll try to add a new secret `NEW_SECRET` to the SST infrastructure as code, use it in my app, then re-run `yarn dev`.

I've added it to `sst.config.ts`:

```typescript
...

const NEW_SECRET = new Config.Secret(stack, "NEW_SECRET");

const site = new NextjsSite(stack, "site", {
bind: [NEW_SECRET],
});

...
```

I've updated `src/app/page.tsx` 


```typescript
import { Config } from "sst/node/config";

export default function Home() {
  const NEW_SECRET = Config.NEW_SECRET;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {NEW_SECRET}
    </main>
  )
}
```

Now I'll rerun `yarn dev` and I get:

```bash
yarn run v1.22.19
$ sst bind next dev
Warning: The site has not been deployed. Some resources might not be available.

   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000

 ✓ Ready in 4.2s
 ○ Compiling / ...
 ✓ Compiled / in 9.1s (1166 modules)
 ⨯ node_modules/sst/node/util/index.js (32:26) @ Object.get
 ⨯ Error: Cannot use Config.NEW_SECRET. Please make sure it is bound to this function.
    at Home (./src/app/page.tsx:14:76)
    at stringify (<anonymous>)
```

I also run into this issue if I try to deploy:

```bash
npx sst deploy --stage test
SST v2.38.4

➜  App:     sst-bind-bug-repro
   Stage:   test
   Region:  us-east-1
   Account: 902024878759

Next.js v14.0.4
OpenNext v2.3.1

┌─────────────────────────────────┐
│ OpenNext — Building Next.js app │
└─────────────────────────────────┘


> sst-bind-bug-repro@0.1.0 build
> next build

   ▲ Next.js 14.0.4

 ✓ Creating an optimized production build    
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
   Generating static pages (2/5)  [==  ] 
Error: 
Cannot access bound resources. This usually happens if the "sst/node" package is used at build time. For example:

  - The "sst/node" package is used inside the "getStaticProps()" function of a Next.js app.
  - The "sst/node" package is used at the top level outside of the "load()" function of a SvelteKit app.

Please wrap your build script with "sst bind". For example, "sst bind next build".

    at Object.get (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/.next/server/app/page.js:35:30942)
    at a (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/.next/server/app/page.js:35:29943)
    at em (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:128334)
    at /workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:140034
    at Array.toJSON (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:143612)
    at stringify (<anonymous>)
    at eE (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:131997)
    at eR (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:132440)
    at AsyncLocalStorage.run (node:async_hooks:346:14)
    at Timeout._onTimeout (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:144064)
Error: 
Cannot access bound resources. This usually happens if the "sst/node" package is used at build time. For example:

  - The "sst/node" package is used inside the "getStaticProps()" function of a Next.js app.
  - The "sst/node" package is used at the top level outside of the "load()" function of a SvelteKit app.

Please wrap your build script with "sst bind". For example, "sst bind next build".

    at Object.get (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/.next/server/app/page.js:35:30942)
    at a (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/.next/server/app/page.js:35:29943)
    at em (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:128334)
    at /workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:140034
    at Array.toJSON (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:143612)
    at stringify (<anonymous>)
    at eE (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:131997)
    at eR (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:132440)
    at Timeout._onTimeout (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:129220)
    at listOnTimeout (node:internal/timers:573:17)

Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
Error: 
Cannot access bound resources. This usually happens if the "sst/node" package is used at build time. For example:

  - The "sst/node" package is used inside the "getStaticProps()" function of a Next.js app.
  - The "sst/node" package is used at the top level outside of the "load()" function of a SvelteKit app.

Please wrap your build script with "sst bind". For example, "sst bind next build".

    at Object.get (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/.next/server/app/page.js:35:30942)
    at a (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/.next/server/app/page.js:35:29943)
    at em (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:128334)
    at /workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:140034
    at Array.toJSON (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:143612)
    at stringify (<anonymous>)
    at eE (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:131997)
    at eR (/workspaces/sst-bind-bug-repro/sst-bind-bug-repro/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:132440)
    at AsyncLocalStorage.run (node:async_hooks:346:14)
 ✓ Generating static pages (5/5) 

> Export encountered errors on following paths:
        /page: /
node:internal/errors:932
  const err = new Error(message);
              ^

Error: Command failed: npm run build
    at checkExecSyncError (node:child_process:890:11)
    at Object.execSync (node:child_process:962:15)
    at buildNextjsApp (file:///home/codespace/.npm/_npx/5e5e2f11d04ee7cb/node_modules/open-next/dist/build.js:107:8)
    at build (file:///home/codespace/.npm/_npx/5e5e2f11d04ee7cb/node_modules/open-next/dist/build.js:25:11)
    at file:///home/codespace/.npm/_npx/5e5e2f11d04ee7cb/node_modules/open-next/dist/index.js:9:1
    at ModuleJob.run (node:internal/modules/esm/module_job:218:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:329:24)
    at async loadESM (node:internal/process/esm_loader:34:7)
    at async handleMainPromise (node:internal/modules/run_main:113:12) {
  status: 1,
  signal: null,
  output: [ null, null, null ],
  pid: 2564,
  stdout: null,
  stderr: null
}

Node.js v20.10.0

Error: There was a problem building the "site" site.

Need help with this error? Post it in #help on the SST Discord https://sst.dev/discord

```

