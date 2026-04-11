interface CompanyPillProps {
  company: string;
  frequency?: number;
}

export default function CompanyPill({ company, frequency }: CompanyPillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-[7px] py-[2px] bg-transparent border border-[color:var(--border-main)] text-[color:var(--text-main)] text-[11px] whitespace-nowrap overflow-hidden leading-tight font-bold brutalist-no-radius uppercase">
      <span>{company}</span>
      {frequency !== undefined && (
        <span className="opacity-50 font-mono text-[9px] border-l border-[color:var(--border-main)] pl-1.5 h-full flex items-center">
          {frequency}
        </span>
      )}
    </span>
  );
}
