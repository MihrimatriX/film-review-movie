import Image from "next/image";
import Link from "next/link";
import type { UserProfile } from "@/lib/types";

type Section = "profile" | "favorites" | "rated";

export function UserSidebar({
  profile,
  active,
  labels,
}: {
  profile: UserProfile;
  active: Section;
  labels: {
    changeAvatar: string;
    accountDetails: string;
    profile: string;
    favoriteMovies: string;
    ratedMovies: string;
    others: string;
    changePasswordShort: string;
    logOut: string;
  };
}) {
  const link = (key: Section, href: string, label: string) => (
    <li className={active === key ? "text-[var(--cv-accent)]" : ""}>
      <Link href={href} className="hover:text-[var(--cv-accent)]">
        {label}
      </Link>
    </li>
  );

  return (
    <div className="rounded border border-[var(--cv-border)] bg-[var(--cv-deep)] p-4 md:-mt-24 md:pt-6">
      <div className="text-center">
        <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-[var(--cv-border)]">
          <Image
            src={profile.avatar}
            alt=""
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
        <button
          type="button"
          className="mt-3 inline-block rounded bg-[var(--cv-red)] px-4 py-2 text-xs font-bold uppercase text-[var(--cv-on-red)]"
        >
          {labels.changeAvatar}
        </button>
      </div>
      <div className="mt-6 border-t border-[var(--cv-border)] pt-4">
        <p className="text-xs font-bold uppercase text-[var(--cv-muted)]">
          {labels.accountDetails}
        </p>
        <ul className="mt-2 space-y-2 text-sm text-[var(--cv-heading)]">
          {link("profile", "/community/profile", labels.profile)}
          {link("favorites", "/community/favorites", labels.favoriteMovies)}
          {link("rated", "/community/rated", labels.ratedMovies)}
        </ul>
      </div>
      <div className="mt-4 border-t border-[var(--cv-border)] pt-4">
        <p className="text-xs font-bold uppercase text-[var(--cv-muted)]">
          {labels.others}
        </p>
        <ul className="mt-2 space-y-2 text-sm text-[var(--cv-muted)]">
          <li>
            <span className="cursor-default opacity-80">
              {labels.changePasswordShort}
            </span>
          </li>
          <li>
            <span className="cursor-default opacity-80">{labels.logOut}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
