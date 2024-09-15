import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import ReduxWrapper from "@/app/store/ReduxWrapper";


interface ProviderProps {
  children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <NextUIProvider>  
        <ReduxWrapper>
          {children}
          </ReduxWrapper> 
      </NextUIProvider>
    </SessionProvider>
  );
}
