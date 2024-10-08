import { Dispatch, SetStateAction, useState } from "react";

import { SignInFlow } from "@/src/features/auth/types";
import { useAuthActions } from "@convex-dev/auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";

interface SinInCardProps {
  setState: Dispatch<SetStateAction<SignInFlow>>;
}

const SignInCard = ({ setState }: SinInCardProps) => {
  const [pending, setPending] = useState(false);
  const { signIn } = useAuthActions();

  const onProviderSignIn = (value: "google" | "github") => {
    setPending(true);
    void signIn(value).then(() => setPending(true));
  };

  return (
    <Card className={"h-full w-full p-8"}>
      <CardHeader className={"px-0 pt-0"}>
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your Email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className={"space-y-5 px-0 pb-0"}>
        <form className={"space-y-2.5"}>
          <Input
            disabled={pending}
            placeholder={"Email"}
            type={"email"}
            required
          />
          <Input
            disabled={pending}
            placeholder={"Password"}
            type={"password"}
            required
          />
          <Button
            disabled={pending}
            size={"lg"}
            type={"submit"}
            className={"w-full"}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className={"flex flex-col gap-y-2.5"}>
          <Button
            size={"lg"}
            disabled={pending}
            variant={"outline"}
            onClick={() => onProviderSignIn("google")}
            className={"flex w-full items-center justify-between"}
          >
            <FcGoogle className={"size-5"} />
            Continue with Google
            <div />
          </Button>
          <Button
            size={"lg"}
            disabled={pending}
            variant={"outline"}
            onClick={() => onProviderSignIn("github")}
            className={"flex w-full items-center justify-between"}
          >
            <FaGithub className={"size-5"} />
            Continue with Github
            <div />
          </Button>
        </div>
        <p className={"text-xs text-muted-foreground"}>
          Don&apos;t have an account?
          <span
            className={"ml-1 cursor-pointer text-sky-700 hover:underline"}
            onClick={() => setState("signUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
export default SignInCard;
