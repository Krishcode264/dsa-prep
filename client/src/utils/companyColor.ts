// Stripped of hard-coded colors for Minimalist token themes

export function getCompanyPalette(_name: string) {
  return {
    bg: 'bg-[color:var(--surface-active)]',
    text: 'text-[color:var(--text-main)]',
    border: 'border-[color:var(--border-main)]'
  };
}

export function getCompanyBgColor(_name: string): string {
  return 'var(--surface-active)';
}

export function getCompanyTextColor(_name: string): string {
  return 'var(--text-main)';
}
