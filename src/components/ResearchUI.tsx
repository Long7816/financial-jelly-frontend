import { useRef, type ReactNode } from "react";
import { FlaskConical, type LucideIcon } from "lucide-react";

export function WorkspaceHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="workspace-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="workspace-actions">{actions}</div>}
    </div>
  );
}

export function MockStrip({
  children = "固定介面測試資料，不是即時行情或正式公告",
}: {
  children?: ReactNode;
}) {
  return (
    <div className="mock-strip" role="note">
      <FlaskConical size={15} />
      <strong>Demo Mock</strong>
      <span>{children}</span>
    </div>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  tone = "neutral",
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  note: string;
  tone?: "neutral" | "clay" | "amber";
}) {
  return (
    <article className={["workspace-metric", tone].join(" ")}>
      <span className="workspace-metric-icon">
        <Icon size={18} />
      </span>
      <div>
        <p>{label}</p>
        <strong className="mono">{value}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}

export function MiniTrend({
  values,
  direction,
}: {
  values: number[];
  direction: "up" | "down" | "neutral";
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 28 - ((value - min) / span) * 22;
      return [x, y].join(",");
    })
    .join(" ");
  return (
    <svg
      className={["mini-trend", direction].join(" ")}
      viewBox="0 0 100 32"
      aria-hidden="true"
      focusable="false"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SegmentedTabs<T extends string>({
  value,
  onChange,
  items,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  items: { value: T; label: string }[];
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="segmented-tabs" role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.value}
          ref={(node) => {
            refs.current[index] = node;
          }}
          role="tab"
          aria-selected={value === item.value}
          tabIndex={value === item.value ? 0 : -1}
          onClick={() => onChange(item.value)}
          onKeyDown={(event) => {
            let next: number | undefined;
            if (event.key === "ArrowRight") next = (index + 1) % items.length;
            if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = items.length - 1;
            if (next !== undefined) {
              event.preventDefault();
              onChange(items[next].value);
              refs.current[next]?.focus();
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
