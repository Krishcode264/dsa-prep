import React, { useState, useMemo } from 'react';
import CollapsibleSection from './CollapsibleSection';
import TopicChip from './TopicChip';

interface TopicFilterProps {
  topics: string[];
  selectedTopics: string[];
  topicMatch: 'ALL' | 'ANY';
  onToggle: (topic: string) => void;
  onMatchChange: (mode: 'ALL' | 'ANY') => void;
}

const TopicFilter = React.memo(({ 
  topics, 
  selectedTopics, 
  topicMatch, 
  onToggle, 
  onMatchChange 
}: TopicFilterProps) => {
  const [search, setSearch] = useState('');

  const visibleTopics = useMemo(() => {
    return topics.filter(t => t.toLowerCase().includes(search.toLowerCase()));
  }, [topics, search]);

  return (
    <CollapsibleSection title="Topics" defaultOpen={true}>
      <div className="flex items-center justify-between mb-3 mt-1">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full bg-[color:var(--surface)] border border-[color:var(--border-subtle)] px-3 py-1.5 text-xs outline-none focus:border-[color:var(--border-main)] text-[color:var(--text-main)] focus:bg-[color:var(--surface-hover)]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      {selectedTopics.length > 0 && (
        <div className="flex bg-[color:var(--surface-active)] border border-[color:var(--border-main)] p-1 mb-3 shrink-0 gap-1">
          <button 
            onClick={() => onMatchChange('ALL')}
            className={`flex-1 text-[10px] uppercase tracking-widest py-1 font-bold transition-all border ${topicMatch === 'ALL' ? 'bg-[color:var(--surface)] text-[color:var(--text-main)] border-[color:var(--border-main)]' : 'text-[color:var(--text-muted)] border-transparent hover:text-[color:var(--text-main)]'}`}
          >
            Match All
          </button>
          <button 
            onClick={() => onMatchChange('ANY')}
            className={`flex-1 text-[10px] uppercase tracking-widest py-1 font-bold transition-all border ${topicMatch === 'ANY' ? 'bg-[color:var(--surface)] text-[color:var(--text-main)] border-[color:var(--border-main)]' : 'text-[color:var(--text-muted)] border-transparent hover:text-[color:var(--text-main)]'}`}
          >
            Match Any
          </button>
        </div>
      )}

      <div className="max-h-56 overflow-y-auto custom-scrollbar pr-1 pb-1">
        <div className="flex flex-wrap gap-2">
          {visibleTopics.map(t => (
            <TopicChip 
              key={t} 
              topic={t} 
              selected={selectedTopics.includes(t)} 
              onClick={() => onToggle(t)} 
            />
          ))}
          {visibleTopics.length === 0 && (
            <span className="text-xs text-[color:var(--text-muted)] italic">No topics found</span>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
});

export default TopicFilter;
