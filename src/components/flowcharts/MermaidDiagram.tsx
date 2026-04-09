import { useEffect, useRef, useState } from "react";

interface Props {
  chart: string;
}

export default function MermaidDiagram({ chart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis" },
          securityLevel: "loose",
        });

        const id = `mermaid-${Date.now()}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) {
          setSvg(rendered);
          setError("");
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Erro ao renderizar diagrama");
        }
      }
    };

    render();
    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <div className="text-sm text-destructive p-4 border border-destructive/30 rounded-lg">
        Erro no diagrama: {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto p-4 bg-white dark:bg-muted/30 rounded-lg border"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
