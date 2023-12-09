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

