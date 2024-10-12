"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface Props {
    children: ReactNode; // This allows for any valid React child type
  }

const ReduxWrapper: React.FC<Props> = ({ children }) => {
  return <Provider store={store}> <Toaster /> {/* Include the Toaster here */}{children}</Provider>;
};

export default ReduxWrapper;