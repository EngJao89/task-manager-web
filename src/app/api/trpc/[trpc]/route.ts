import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/lib/trpc/root"
import { createContext } from "@/lib/trpc/context"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => createContext(),
    onError: ({ error, path }) => {
      console.error(`tRPC Error on '${path}':`, error)
    },
  })

export { handler as GET, handler as POST }
