import { Dispatch, SetStateAction } from "react";

import { SignInFlow } from "@/src/features/auth/types";
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
            disabled={false}
            onChange={() => {}}
            placeholder={"Email"}
            type={"email"}
            required
          />
          <Input
            disabled={false}
            onChange={() => {}}
            placeholder={"Password"}
            type={"password"}
            required
          />
          <Button
            type={"submit"}
            size={"lg"}
            disabled={false}
            className={"w-full"}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className={"flex flex-col gap-y-2.5"}>
          <Button
            size={"lg"}
            disabled={false}
            className={"flex w-full items-center justify-between"}
            onChange={() => {}}
            variant={"outline"}
          >
            <FcGoogle className={"size-5"} />
            Continue with Google
            <div />
          </Button>
          <Button
            size={"lg"}
            disabled={false}
            className={"flex w-full items-center justify-between"}
            onChange={() => {}}
            variant={"outline"}
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
