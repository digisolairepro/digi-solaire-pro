type LogoProps = {
  size?: "sm" | "md";
};

export default function Logo({ size = "md" }: LogoProps) {
  const tailleIcone = size === "sm" ? 22 : 28;
  const tailleTexte = size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2">
      <svg
        width={tailleIcone}
        height={tailleIcone}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="28" height="28" rx="7" fill="#eab308" />
        <circle cx="14" cy="14" r="5" fill="#0f172a" />
        <g stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round">
          <line x1="14" y1="4" x2="14" y2="6.5" />
          <line x1="14" y1="21.5" x2="14" y2="24" />
          <line x1="4" y1="14" x2="6.5" y2="14" />
          <line x1="21.5" y1="14" x2="24" y2="14" />
          <line x1="7.2" y1="7.2" x2="9" y2="9" />
          <line x1="19" y1="19" x2="20.8" y2="20.8" />
          <line x1="20.8" y1="7.2" x2="19" y2="9" />
          <line x1="9" y1="19" x2="7.2" y2="20.8" />
        </g>
      </svg>

      <span
        className={`${tailleTexte} font-bold tracking-tight leading-none whitespace-nowrap text-yellow-400`}
      >
        DIGI SOLAIRE PRO
      </span>
    </div>
  );
}