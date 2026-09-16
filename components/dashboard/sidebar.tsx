"use client";

import { usePathname } from "next/navigation";
import { motion } from 'framer-motion';
import { Code } from "lucide-react";
import { routes } from "@/app/data";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

export function DashboardSidebar() {
    const pathname = usePathname();
    return (
        <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r">
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 bg-linear-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg"
                    >
                        <Code className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="text-xl font-bold bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        BuildSpace
                    </span>
                </div>
            </div>
            <div className="flex-1 px-3">
                {routes.map((route) => (
                    <Link key={route.href} href={route.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                            pathname === route.href
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                                : "",
                        )}
                    >
                        <route.icon className={cn("h-5 w-5", route.color)} />
                        <span>{route.label}</span>
                    </Link>
                ))}
            </div>
            <div className="p-6 border-t">
                <div className="flex items-center gap-3">
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "h-8 w-8",
                                userButtonTrigger:
                                    "hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 transition-all rounded-full",
                            },
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Profile</p>
                        <p className="text-xs text-gray-500 truncate">Settings</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
