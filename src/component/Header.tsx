import clsx from "clsx";
import { PrimaryLink } from "./PrimaryLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./Button";
import { useBuyCredits } from "~/hooks";
import { api } from "~/utils/api";

export function Header() {
  const session = useSession();

  const { buyCredits } = useBuyCredits();

  const isLoggedIn = !!session.data;

  const credits = api.user.getCredits.useQuery();

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
      <ul className="flex gap-4">
        <li>
          <PrimaryLink href="/generate">Generate</PrimaryLink>
        </li>
        <li>
          <PrimaryLink href="/community">Community</PrimaryLink>
        </li>

        {isLoggedIn && (
          <li>
            <PrimaryLink href="/collection">Collection</PrimaryLink>
          </li>
        )}
      </ul>
      <ul className="flex gap-4">
        {isLoggedIn ? (
          <>
            <div className="flex items-center">
              Credits remaining: {credits.data}
            </div>
            <li>
              <Button
                onClick={() => {
                  buyCredits().catch(console.log);
                }}
              >
                Buy credits
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                onClick={() => {
                  signOut().catch(console.error);
                }}
              >
                Sign out
              </Button>
            </li>
          </>
        ) : (
          <li>
            <Button
              onClick={() => {
                signIn().catch(console.error);
              }}
            >
              Login
            </Button>
          </li>
        )}
      </ul>
    </header>
  );
}
