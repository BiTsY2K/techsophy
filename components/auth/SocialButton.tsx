import { IconType } from "react-icons";
import { Button } from "@/components/ui/button";
import { DEFAULT_REDIRECT } from "@/lib/routes";
import { signIn } from "next-auth/react";

interface SocialButtonProps {
  children?: React.ReactNode;
  icon: IconType;
  provider: string;
}

export const SocialButton = ({ children, icon: ButtonIcon, provider }: SocialButtonProps) => {
  const socialSignIn = (provider: string) => {
    signIn(provider, {
      callbackUrl: DEFAULT_REDIRECT,
    });
  };

  return (
    <Button size={"lg"} variant="outline" className="gap-x-1.5 gap-y-1" onClick={() => socialSignIn(provider)}>
      <ButtonIcon className="h-4 w-4" />
      <span className="">{children}</span>
    </Button>
  );
};
