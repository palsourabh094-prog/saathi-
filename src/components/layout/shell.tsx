"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { NetworkIndicator } from "@/components/layout/network-indicator";
import { useSaathi } from "@/lib/store";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function Shell({
  nav,
  roleLabel,
  userName,
  children,
}: {
  nav: NavItem[];
  roleLabel: string;
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const demoMode = useSaathi((s) => s.demoMode);
  const toggleDemoMode = useSaathi((s) => s.toggleDemoMode);
  const setRole = useSaathi((s) => s.setRole);
  const resetDemo = useSaathi((s) => s.resetDemo);

  const isActive = (href: string) =>
    href === "/farmer" ? pathname === href || pathname === "/farmer" : pathname.startsWith(href);

  const switchRole = () => {
    resetDemo();
    setRole(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Sidebar — desktop / tablet */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-charcoal-900 text-paper lg:flex">
        <div className="px-6 pt-7 pb-6">
          <Brand light />
        </div>
        <div className="mx-6 mb-5 rounded-xl bg-charcoal-800/80 px-4 py-3">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-charcoal-400 uppercase">
            {roleLabel}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-paper">{userName}</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-agri-700/90 text-paper shadow-sm"
                    : "text-charcoal-300 hover:bg-charcoal-800 hover:text-paper"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <button
            onClick={switchRole}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-charcoal-400 transition-colors hover:bg-charcoal-800 hover:text-paper"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Switch role
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-paper-line bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <NetworkIndicator />
      </header>

      {/* Desktop top bar */}
      <div className="sticky top-0 z-30 hidden items-center justify-between border-b border-paper-line bg-paper/80 px-8 py-3.5 backdrop-blur lg:flex">
        <div />
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDemoMode}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-wide transition-colors ${
              demoMode
                ? "border-charcoal-900 bg-charcoal-900 text-paper"
                : "border-charcoal-300 bg-white/70 text-charcoal-700 hover:border-charcoal-400"
            }`}
            title="Toggle demo controls"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${demoMode ? "bg-amber-400" : "bg-charcoal-300"}`} />
            DEMO MODE {demoMode ? "ON" : "OFF"}
          </button>
          <NetworkIndicator />
        </div>
      </div>

      {/* Content */}
      <main className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pt-8 lg:pb-12">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-line bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {nav.slice(0, 4).map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 text-[10px] font-semibold ${
                  active ? "text-agri-700" : "text-charcoal-400"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={switchRole}
            className="flex flex-col items-center gap-1 px-3 py-2.5 text-[10px] font-semibold text-charcoal-400"
          >
            <LogOut className="h-5 w-5" />
            Exit
          </button>
        </div>
      </nav>

      {/* Mobile demo toggle */}
      <button
        onClick={toggleDemoMode}
        className={`fixed bottom-20 right-4 z-40 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wide shadow-lift transition-colors lg:hidden ${
          demoMode ? "bg-charcoal-900 text-paper" : "bg-white/90 text-charcoal-600 border border-paper-line"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${demoMode ? "bg-amber-400" : "bg-charcoal-300"}`} />
        {demoMode ? "DEMO ON" : "DEMO"}
      </button>
    </div>
  );
}
