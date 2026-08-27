import { PageHero } from "@/components/PageHero";
import { UserSidebar } from "@/components/UserSidebar";
import { readUserData } from "@/lib/data-file";
import { getLocale, t } from "@/lib/i18n";

export const metadata = { title: "User profile" };

export default async function CommunityProfilePage() {
  const { profile } = await readUserData();
  const locale = await getLocale();
  const s = t(locale);
  const c = s.community;
  const userLabels = {
    changeAvatar: c.changeAvatar,
    accountDetails: c.accountDetails,
    profile: c.profile,
    favoriteMovies: s.footer.linkFavorites,
    ratedMovies: c.ratedTitle,
    others: c.others,
    changePasswordShort: c.changePasswordShort,
    logOut: c.logOut,
  };

  return (
    <>
      <PageHero
        title={`${profile.firstName} ${profile.lastName} — ${c.profile}`}
        crumbs={[{ label: s.crumbs.home, href: "/" }, { label: c.profile }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full shrink-0 lg:w-64">
            <UserSidebar
              profile={profile}
              active="profile"
              labels={userLabels}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-6">
              <h4 className="border-b border-[var(--cv-accent)] pb-2 font-[family-name:var(--font-dosis)] text-lg font-bold uppercase text-[var(--cv-heading)]">
                {c.profileDetails}
              </h4>
              <form className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-[var(--cv-muted)]">
                    {c.username}
                  </label>
                  <input
                    readOnly
                    defaultValue={profile.username}
                    className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--cv-muted)]">
                    {c.email}
                  </label>
                  <input
                    readOnly
                    defaultValue={profile.email}
                    className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--cv-muted)]">
                    {c.firstName}
                  </label>
                  <input
                    readOnly
                    defaultValue={profile.firstName}
                    className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--cv-muted)]">
                    {c.lastName}
                  </label>
                  <input
                    readOnly
                    defaultValue={profile.lastName}
                    className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--cv-muted)]">
                    {c.country}
                  </label>
                  <input
                    readOnly
                    defaultValue={profile.country}
                    className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--cv-muted)]">
                    {c.state}
                  </label>
                  <input
                    readOnly
                    defaultValue={profile.state}
                    className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
                  />
                </div>
              </form>
              <h4 className="mt-10 border-b border-[var(--cv-accent)] pb-2 font-[family-name:var(--font-dosis)] text-lg font-bold uppercase text-[var(--cv-heading)]">
                {c.changePassword}
              </h4>
              <p className="mt-4 text-sm text-[var(--cv-faint)]">
                {c.passwordNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
