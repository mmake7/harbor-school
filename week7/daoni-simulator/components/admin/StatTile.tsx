type Props = {
  label: string;
  value: string;
  hint?: string;
  icon?: string;
};

export function StatTile({ label, value, hint, icon }: Props) {
  return (
    <div className="bg-base border-[0.5px] border-border rounded-lg p-4">
      <div className="flex items-center gap-2 text-xs text-muted">
        {icon && <i className={`ti ${icon}`} />}
        {label}
      </div>
      <div className="text-2xl font-bold text-ink mt-2 font-mono">{value}</div>
      {hint && <div className="text-xs text-muted-light mt-1">{hint}</div>}
    </div>
  );
}
