import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { celebritySortSelectOptions } from "@/lib/listing-sort-ui";

type Props = {
  locale: Locale;
  formAction: string;
  countryOptions: string[];
  defaults: {
    q: string;
    sort: string;
    country: string;
    gender: string;
    minAge: string;
    maxAge: string;
    pageSize?: string;
  };
};

export function CelebrityListingSidebar({
  locale,
  formAction,
  countryOptions,
  defaults,
}: Props) {
  const L = t(locale).listings;
  const tb = t(locale).topBar;
  const sortOpts = celebritySortSelectOptions(tb);

  return (
    <aside className="space-y-6">
      <div className="rounded border border-[var(--cv-border)] bg-[var(--cv-card)] p-4">
        <h4 className="border-b border-[var(--cv-accent)] pb-2 font-[family-name:var(--font-dosis)] font-bold uppercase text-[var(--cv-heading)]">
          {L.filterHeading}
        </h4>
        <form method="get" action={formAction} className="mt-4 space-y-3">
          <input type="hidden" name="page" value="1" />
          {defaults.pageSize ? (
            <input type="hidden" name="pageSize" value={defaults.pageSize} />
          ) : null}
          <div>
            <label className="text-xs text-[var(--cv-muted)]">
              {L.celebName}
            </label>
            <input
              name="q"
              type="search"
              defaultValue={defaults.q}
              placeholder={L.keywordPlaceholder}
              className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--cv-muted)]">
              {L.quickSort}
            </label>
            <select
              name="sort"
              defaultValue={defaults.sort}
              className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
            >
              {sortOpts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--cv-muted)]">
              {L.celebCountry}
            </label>
            <select
              name="country"
              defaultValue={defaults.country}
              className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
            >
              <option value="">{L.celebCountryAll}</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--cv-muted)]">
              {L.celebGender}
            </label>
            <select
              name="gender"
              defaultValue={defaults.gender}
              className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-3 py-2 text-sm text-[var(--cv-heading)]"
            >
              <option value="">{L.celebGenderAny}</option>
              <option value="1">{L.celebGenderFemale}</option>
              <option value="2">{L.celebGenderMale}</option>
              <option value="3">{L.celebGenderNb}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--cv-muted)]">
                {L.celebMinAge}
              </label>
              <input
                name="minAge"
                type="number"
                min={0}
                max={120}
                placeholder="—"
                defaultValue={defaults.minAge}
                className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-2 py-2 text-sm text-[var(--cv-heading)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--cv-muted)]">
                {L.celebMaxAge}
              </label>
              <input
                name="maxAge"
                type="number"
                min={0}
                max={120}
                placeholder="—"
                defaultValue={defaults.maxAge}
                className="mt-1 w-full rounded border border-[var(--cv-border-strong)] bg-[var(--cv-input)] px-2 py-2 text-sm text-[var(--cv-heading)]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded bg-[var(--cv-red)] py-2 text-sm font-bold uppercase text-[var(--cv-on-red)]"
          >
            {L.apply}
          </button>
        </form>
      </div>
      <div className="rounded border border-[var(--cv-border)] bg-[var(--cv-deep)] p-4 text-sm leading-relaxed text-[var(--cv-muted)]">
        {L.celebAsideHint}
      </div>
    </aside>
  );
}
