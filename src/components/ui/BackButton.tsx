"use client";

interface Props {
  label?: string;
  className?: string;
  href?: string;
}

export function BackButton({ label = "← Back", className = "", href = "/#projects" }: Props) {
  return (
    <a
      href={href}
      className={`glass-pill inline-block cursor-pointer text-highlight/80 hover:text-highlight ${className}`}
    >
      {label}
    </a>
  );
}
