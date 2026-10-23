"use client";

// Absende-Knopf mit Rückfrage, für Aktionen, die sich nicht rückgängig machen lassen.
export default function ConfirmSubmit({
  message,
  children,
  className = "dash-btn-quiet",
  name,
  value,
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
  name?: string;
  value?: string;
}) {
  return (
    <button
      type="submit"
      name={name}
      value={value}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
