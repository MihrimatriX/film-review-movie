type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

function stripContext(node: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...node };
  delete rest["@context"];
  return rest;
}

export function JsonLd({ data }: { data: JsonLdValue }) {
  const payload = Array.isArray(data)
    ? {
        "@context": "https://schema.org",
        "@graph": data.map(stripContext),
      }
    : data["@context"]
      ? data
      : { "@context": "https://schema.org", ...data };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
