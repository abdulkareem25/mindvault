// The small "KNOWLEDGE VAULT" style label above every section heading.
export function SectionLabel({ children }) {
  return (
    <p className="font-sans text-12 font-medium uppercase tracking-[0.8px] text-ember">
      {children}
    </p>
  );
}
