const ITEMS = [
  "BATCH-VERIFIED",
  "≥99% PURITY",
  "HPLC + MS TESTED",
  "COA PER LOT",
  "USA COLD-CHAIN",
  "LYOPHILIZED",
  "RESEARCH GRADE",
  "24H DISPATCH",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative border-y border-line bg-culture py-3.5">
      <div className="mask-fade-x flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap">
          {row.map((t, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-ink">
                {t}
              </span>
              <span className="text-ink/50">✕</span>
            </span>
          ))}
        </div>
        <div
          className="flex shrink-0 animate-marquee items-center whitespace-nowrap"
          aria-hidden="true"
        >
          {row.map((t, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-ink">
                {t}
              </span>
              <span className="text-ink/50">✕</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
