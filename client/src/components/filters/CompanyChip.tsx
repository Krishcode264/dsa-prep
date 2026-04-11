import { getCompanyBgColor, getCompanyTextColor } from '../../utils/companyColor';

interface CompanyChipProps {
  company: string;
  selected: boolean;
  onClick: () => void;
}

export default function CompanyChip({ company, selected, onClick }: CompanyChipProps) {
  const badgeBg = getCompanyBgColor(company);
  const badgeText = getCompanyTextColor(company);
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1 text-xs transition-colors border ${
        selected 
        ? 'bg-[color:var(--surface-active)] border-[color:var(--border-main)] text-[color:var(--text-main)] font-bold' 
        : 'bg-[color:var(--surface)] border-[color:var(--border-subtle)] text-[color:var(--text-muted)] hover:border-[color:var(--border-main)] hover:text-[color:var(--text-main)]'
      }`}
    >
      <span 
        className="w-[14px] h-[14px] flex items-center justify-center text-[9px] font-extrabold leading-none border border-[color:var(--border-main)]"
        style={{ backgroundColor: badgeBg, color: badgeText }}
      >
        {company[0].toUpperCase()}
      </span>
      {company}
    </button>
  );
}
