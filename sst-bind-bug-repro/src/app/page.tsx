import { Config } from "sst/node/config";

export default function Home() {
  const NEW_SECRET = Config.NEW_SECRET;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      NEW_SECRET: {NEW_SECRET}
    </main>
  )
}
