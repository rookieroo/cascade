"use client";

import React from "react";
import posthog from "posthog-js";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import { SessionProvider, useSession } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import { env } from "~/env.mjs";
import { useSearchParams } from "next/navigation";
import { ThemeProvider } from "./theme-provider";

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_API_KEY!, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST!,
  });
}

const PostHogIdentification = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const posthog = usePostHog();

  const params = useSearchParams();
  const newLoginState = params.get("loginState");

  if (newLoginState == "signedIn" && session) {
    posthog.identify(session.user.id);
  }

  return <>{children}</>;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCReactProvider>
        <SessionProvider>
          <PostHogProvider client={posthog}>
            <PostHogIdentification>{children}</PostHogIdentification>
          </PostHogProvider>
        </SessionProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  );
};

export default Providers;