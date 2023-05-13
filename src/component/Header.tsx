import clsx from "clsx";
import { PrimaryLink } from "./PrimaryLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./Button";
import { useBuyCredits } from "~/hooks";

export function Header() {
  const session = useSession();

  const { buyCredits } = useBuyCredits();

  const isLoggedIn = !!session.data;

  return (
    <header
      className={clsx(
        "container flex ",
        "items-center justify-between",
        "mx-auto px-4",
        "h-16"
      )}
    >
      <PrimaryLink href="/">Logo</PrimaryLink>
      <ul>
        <li>
          <PrimaryLink href="/generate">Generate</PrimaryLink>
        </li>
      </ul>
      <ul className="flex gap-4">
        {isLoggedIn ? (
          <>
            <li>
              <Button onClick={() => buyCredits().catch(console.log)}>
                Buy credits
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                onClick={() => signOut().catch(console.error)}
              >
                Sign out
              </Button>
            </li>
          </>
        ) : (
          <li>
            <Button onClick={() => signIn().catch(console.error)}>Login</Button>
          </li>
        )}
      </ul>
    </header>
  );
}
