"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/react";
import ReduxWrapper from "@/app/store/ReduxWrapper";


interface ProviderProps {
  children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <HeroUIProvider>
        <ReduxWrapper>
          {children}
        </ReduxWrapper>
      </HeroUIProvider>
    </SessionProvider>
  );
}
