import { Dispatch, SetStateAction } from "react";

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

interface SignUpCardProps {
  setState: Dispatch<SetStateAction<SignInFlow>>;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  return (
    <Card className={"h-full w-full border-0 p-8"}>
      <CardHeader className={"px-0 pt-0"}>
        <CardTitle>Sign up to continue</CardTitle>
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
          <Input
            disabled={false}
            onChange={() => {}}
            placeholder={"Confirm password"}
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
            variant={"outline"}
            className={"flex w-full items-center justify-between"}
          >
            <FcGoogle className={"size-5"} />
            Continue with Google
            <div />
          </Button>
          <Button
            size={"lg"}
            disabled={false}
            variant={"outline"}
            onClick={() => void signIn("github")}
            className={"flex w-full items-center justify-between"}
          >
            <FaGithub className={"size-5"} />
            Continue with Github
            <div />
          </Button>
        </div>
        <p className={"text-xs text-muted-foreground"}>
          Already have an account?
          <span
            className={"ml-1 cursor-pointer text-sky-700 hover:underline"}
            onClick={() => setState("signIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
export default SignUpCard;
