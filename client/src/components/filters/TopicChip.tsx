interface TopicChipProps {
  topic: string;
  selected: boolean;
  onClick: () => void;
}

export default function TopicChip({ topic, selected, onClick }: TopicChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs transition-colors border ${
        selected 
        ? 'bg-[color:var(--surface-active)] border-[color:var(--border-main)] text-[color:var(--text-main)] font-bold' 
        : 'bg-[color:var(--surface)] border-[color:var(--border-subtle)] text-[color:var(--text-muted)] hover:border-[color:var(--border-main)] hover:text-[color:var(--text-main)]'
      }`}
    >
      {topic}
    </button>
  );
}
