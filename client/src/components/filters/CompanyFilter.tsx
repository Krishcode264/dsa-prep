import React, { useState, useMemo } from 'react';
import CollapsibleSection from './CollapsibleSection';
import CompanyChip from './CompanyChip';

interface Company {
  id: number;
  name: string;
}

interface CompanyFilterProps {
  companies: Company[];
  selectedCompanies: string[];
  onToggle: (name: string) => void;
}

const CompanyFilter = React.memo(({ companies, selectedCompanies, onToggle }: CompanyFilterProps) => {
  const [search, setSearch] = useState('');

  const visibleCompanies = useMemo(() => {
    return companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [companies, search]);

  return (
    <CollapsibleSection title="Companies" defaultOpen={true}>
      <div className="mb-3 mt-1">
        <input
          type="text"
          placeholder="Search companies..."
          className="w-full bg-[color:var(--surface)] border border-[color:var(--border-subtle)] px-3 py-1.5 text-xs outline-none focus:border-[color:var(--border-main)] text-[color:var(--text-main)] focus:bg-[color:var(--surface-hover)]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-56 overflow-y-auto custom-scrollbar pr-1 pb-1">
        <div className="flex flex-wrap gap-2">
          {visibleCompanies.map(c => (
            <CompanyChip 
              key={c.id} 
              company={c.name} 
              selected={selectedCompanies.includes(c.name)} 
              onClick={() => onToggle(c.name)} 
            />
          ))}
          {visibleCompanies.length === 0 && (
            <span className="text-xs text-[color:var(--text-muted)] italic">No companies found</span>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
});

export default CompanyFilter;
