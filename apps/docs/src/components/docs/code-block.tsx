type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  return (
    <pre
      aria-label={`${language} example`}
      className="overflow-x-auto rounded-lg border border-border bg-secondary p-4 text-sm text-secondary-foreground"
    >
      <code>{code}</code>
    </pre>
  );
}
