// 1. Create server/index.ts
export const serverIndexTs = () => {
  return `import { usersRouter } from "./routers/users";
import { router } from "./trpc";

export const appRouter = router({
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
`;
};

// 2. create server/trpc.ts
export const serverTrpcTs = () => {
  return `import { initTRPC } from "@trpc/server";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;`;
};

// 3. create server/router/users.ts directory and maybe a users file
export const serverRouterUsersTs = () => {
  return `import { publicProcedure, router } from "../trpc";
export const usersRouter = router({
  getUsers: publicProcedure.query(async () => {
    return [{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Doe" }];
  }),
});
`;
};

// 4. create api/trpc/[trpc]/route.ts
export const apiTrpcRouteTs = () => {
  return `import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/lib/server";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };`;
};

// 5. create lib/trpc/client.ts
export const libTrpcClientTs = () => {
  return `import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/lib/server";

export const trpc = createTRPCReact<AppRouter>({});`;
};

// 6. create lib/trpc/Provider.tsx
export const libTrpcProviderTsx = () => {
  return `"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";

import { trpc } from "./client";

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}`;
};

// 7. create lib/trpc/serverClient.ts
export const libTrpcServerClientTs = () => {
  return `import { httpBatchLink } from "@trpc/client";

import { appRouter } from "@/lib/server";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});
`;
};