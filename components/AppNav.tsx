import Link from "next/link";
import { NAV_ITEMS } from "@/lib/entities";
import { LogoutButton } from "@/components/LogoutButton";

export function AppNav({ current }: { current?: string }) {
  return (
    <nav className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link
          href="/"
          className={
            current === undefined
              ? "font-medium text-neutral-900 underline"
              : "text-neutral-500 hover:text-neutral-900"
          }
        >
          Home
        </Link>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.slug}
            href={`/registro/${item.slug}`}
            className={
              current === item.slug
                ? "font-medium text-neutral-900 underline"
                : "text-neutral-500 hover:text-neutral-900"
            }
          >
            {item.label}
          </Link>
        ))}
      </div>
      <LogoutButton />
    </nav>
  );
}
