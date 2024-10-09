import { Dispatch, SetStateAction, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { SignInFlow } from "@/src/features/auth/types";

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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { signIn } = useAuthActions();

  const onProviderSignIn = (value: "google" | "github") => {
    setPending(true);
    void signIn(value).then(() => setPending(true));
  };

  const onSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !password || !confirmPassword || !name) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setPending(true);
      await signIn("password", { email, password, name, flow: "signUp" });
    } catch {
      setError("Something went wrong.");
    } finally {
      setPending(false);
      router.push("/");
    }
  };

  return (
    <Card className={"h-full w-full border-0 p-8"}>
      <CardHeader className={"px-0 pt-0"}>
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your Email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div
          className={
            "mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-xs text-destructive"
          }
        >
          <TriangleAlert className={"size-4"} />
          <p>{error}</p>
        </div>
      )}
      <CardContent className={"space-y-5 px-0 pb-0"}>
        <form className={"space-y-2.5"} action={onSubmit}>
          <Input
            disabled={pending}
            placeholder={"Full name"}
            name={"name"}
            type={"text"}
            required
          />
          <Input
            disabled={pending}
            placeholder={"Email"}
            name={"email"}
            type={"email"}
            required
          />
          <Input
            disabled={pending}
            placeholder={"Password"}
            name={"password"}
            type={"password"}
            required
          />
          <Input
            disabled={pending}
            placeholder={"Confirm password"}
            type={"password"}
            name={"confirmPassword"}
            required
          />
          <Button
            type={"submit"}
            size={"lg"}
            disabled={pending}
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
