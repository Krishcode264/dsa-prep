interface TopicPillProps {
  topic: string;
}

export default function TopicPill({ topic }: TopicPillProps) {
  return (
    <span className="inline-flex items-center px-[7px] py-[2px] bg-transparent border border-[color:var(--border-main)] text-[color:var(--text-main)] text-[11px] whitespace-nowrap overflow-hidden leading-tight font-bold brutalist-no-radius uppercase">
      {topic}
    </span>
  );
}
