interface StructuredDataProps {
  id: string;
  data: object;
}

export function StructuredData({ id, data }: StructuredDataProps) {
  return (
    // React preserves direct body scripts when recovering document hydration.
    // A container lets recovery and navigation remove the schema with its page.
    <div hidden>
      <script
        id={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
      />
    </div>
  );
}
