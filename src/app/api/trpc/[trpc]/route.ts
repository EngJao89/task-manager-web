import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/lib/trpc/root"
import { createContext } from "@/lib/trpc/context"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => createContext(),
    onError: ({ error, path, input }) => {
      console.error(`tRPC Error on '${path}':`, error)
      if (input) {
        console.error("Input:", input)
      }
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        if (error.stack) {
          console.error("Error stack:", error.stack)
        }
      } else {
        console.error("Error:", error)
      }
    },
  })

export { handler as GET, handler as POST }
