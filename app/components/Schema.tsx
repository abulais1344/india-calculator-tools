'use client';

interface SchemaProps {
  schema: Record<string, any>;
}

/**
 * Component to inject JSON-LD schema into page
 */
export default function Schema({ schema }: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      suppressHydrationWarning
    />
  );
}
