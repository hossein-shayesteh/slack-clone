"use client";

import { useState } from "react";

import SignInCard from "@/src/features/auth/components/sign-in-card";
import SignUpCard from "@/src/features/auth/components/sign-up-card";
import { SignInFlow } from "@/src/features/auth/types";

const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className={"flex h-full items-center justify-center bg-[#5C3B58]"}>
      <div className={"md:h-auto md:w-[420px]"}>
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};
export default AuthScreen;
