"use client"

import { useUser } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    // we are creating queryclient as a use state because we dont want to create new queryclient on every render 
    // useState will keep the same client everytime once it renders
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 60 mins
                        refetchOnMount: true,
                        refetchOnWindowFocus: true,
                    }
                }
            })
    );

    //clear the cache when the user changes
    useEffect(() => {
        if (user?.id) { // when user exists not when user disappear
            queryClient.invalidateQueries();
            queryClient.clear();
        }
    }, [user?.id, queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}