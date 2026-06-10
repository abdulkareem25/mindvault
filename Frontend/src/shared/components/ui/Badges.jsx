/* ── Category badges ── */
const CAT = {
  coding: { bg: 'bg-coding-bg', text: 'text-coding-fg', label: 'Coding' },
  deen:   { bg: 'bg-deen-bg',   text: 'text-deen-fg',   label: 'Deen'   },
  admin:  { bg: 'bg-admin-bg',  text: 'text-admin-fg',  label: 'Admin'  },
  life:   { bg: 'bg-life-bg',   text: 'text-life-fg',   label: 'Life'   },
};

/* ── Type badges ── */
const TYPE_STYLE = {
  decision:   'bg-cinder text-[#e8855e]',
  preference: 'bg-divide  text-mist',
  learning:   'bg-coding-bg text-coding-fg',
  goal:       'bg-life-bg   text-life-fg',
  fact:       'bg-fade       text-smoke',
};

export function CategoryBadge({ category, size = 'md' }) {
  const c = CAT[category] || CAT.life;
  return (
    <span
      className={`inline-flex items-center font-sans font-medium rounded-full capitalize select-none
        ${c.bg} ${c.text}
        ${size === 'sm' ? 'text-11 px-2 py-0.5' : 'text-11 px-2.5 py-0.5'}`}
    >
      {c.label}
    </span>
  );
}

export function TypeBadge({ type }) {
  return (
    <span
      className={`inline-flex items-center font-sans text-11 font-medium
        rounded-full px-2.5 py-0.5 capitalize select-none
        ${TYPE_STYLE[type] || TYPE_STYLE.fact}`}
    >
      {type}
    </span>
  );
}
