import { useFilters } from '../hooks/useFilters';
import { useCompanies, useTopics } from '../hooks/useReferenceData';
import CollapsibleSection from './filters/CollapsibleSection';
import CompanyFilter from './filters/CompanyFilter';
import TopicFilter from './filters/TopicFilter';

interface FilterPanelProps {
  filtersHook: ReturnType<typeof useFilters>;
}

export default function FilterPanel({ filtersHook }: FilterPanelProps) {
  const { filters, updateFilters, toggleCompany, toggleTopic, clearAll } = filtersHook;
  
  const { data: companies = [] } = useCompanies();
  const { data: topics = [] } = useTopics();
  
  const activeCount = 
    filters.companies.length + 
    filters.topics.length + 
    (filters.difficulty ? 1 : 0);

  return (
    <aside aria-label="Filters" className="bg-[color:var(--surface)] border-r border-[color:var(--border-main)] w-full md:w-72 lg:w-80 h-full flex flex-col text-[color:var(--text-main)] relative z-10 shrink-0">
      <div className="p-4 sm:p-6 pb-2 shrink-0 border-b border-[color:var(--border-main)]">
        {activeCount > 0 && (
          <div className="flex items-center justify-end mb-6">
            <span className="bg-[color:var(--surface-active)] text-[color:var(--text-main)] text-[10px] font-bold px-2 py-1 border border-[color:var(--border-main)] uppercase">
              {activeCount} active
            </span>
          </div>
        )}

        <div className="relative mb-4">
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-[color:var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Global search..."
            className="w-full pl-9 pr-3 py-2 bg-[color:var(--surface)] border border-[color:var(--border-main)] text-sm outline-none text-[color:var(--text-main)] placeholder-[color:var(--text-muted)] transition-colors focus:bg-[color:var(--surface-hover)]"
            value={filters.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar p-4 sm:p-6 pt-2 w-full">
        <CollapsibleSection title="Difficulty" defaultOpen={true}>
          <div className="flex flex-wrap gap-2 mt-2">
            {['EASY', 'MEDIUM', 'HARD'].map(diff => {
              const isActive = filters.difficulty === diff;
              const colors = isActive 
                ? 'bg-[color:var(--surface-active)] border-[color:var(--border-main)] text-[color:var(--text-main)]' 
                : 'border-[color:var(--border-subtle)] text-[color:var(--text-muted)] hover:border-[color:var(--border-main)] hover:text-[color:var(--text-main)]';

              return (
                <button
                  key={diff}
                  onClick={() => updateFilters({ difficulty: isActive ? undefined : diff })}
                  className={`px-4 py-1.5 text-xs font-bold border transition-colors ${colors}`}
                >
                  {diff}
                </button>
              )
            })}
          </div>
        </CollapsibleSection>

        <CompanyFilter 
          companies={companies}
          selectedCompanies={filters.companies}
          onToggle={toggleCompany}
        />

        <TopicFilter 
          topics={topics}
          selectedTopics={filters.topics}
          topicMatch={filters.topicMatch}
          onToggle={toggleTopic}
          onMatchChange={(mode) => updateFilters({ topicMatch: mode })}
        />
      </div>

      {activeCount > 0 && (
        <div className="p-4 sm:p-6 pt-2 shrink-0 border-t border-[color:var(--border-main)] bg-[color:var(--surface)] mt-auto w-full">
          <button
            onClick={clearAll}
            className="w-full py-2.5 bg-[color:var(--surface)] hover:bg-[color:var(--surface-hover)] border border-[color:var(--border-main)] text-[color:var(--text-main)] text-xs font-bold uppercase tracking-widest transition-all focus:outline-none"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </aside>
  );
}
