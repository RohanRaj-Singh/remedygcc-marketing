"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";

interface NotificationItem {
  notificationId: string;
  claimId: string;
  claimNumber?: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/employee-access/notifications/unread-count");
      if (res.ok) {
        const data = await res.json();
        if (data.success) setUnread(data.count ?? 0);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30_000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const togglePanel = useCallback(async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (!nextOpen) return;

    setLoading(true);
    try {
      const res = await fetch("/api/employee-access/notifications?limit=20");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItems(data.notifications ?? []);
          setUnread(data.unreadCount ?? 0);
        }
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [open]);

  const markRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/employee-access/notifications/${id}/read`, { method: "POST" });
      setUnread((u) => Math.max(0, u - 1));
    } catch {
      /* ignore */
    }
  }, []);

  const markAll = useCallback(async () => {
    try {
      await fetch("/api/employee-access/notifications/read-all", { method: "POST" });
      setUnread(0);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      /* ignore */
    }
  }, []);

  const handleItemClick = useCallback(
    async (n: NotificationItem) => {
      if (!n.read) await markRead(n.notificationId);
      setOpen(false);
      router.push(`/reimbursement/employee/claims/${n.claimId}`);
    },
    [markRead, router],
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={togglePanel}
        aria-label="Notifications"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm border border-gray-100 transition hover:border-primary/30 hover:text-primary"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[90vw] overflow-hidden rounded-xl bg-white shadow-xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="font-satoshi text-sm font-bold text-primary">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="inline-flex items-center gap-1 font-satoshi text-xs font-bold text-primary hover:text-primary/70"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <p className="px-4 py-8 text-center font-satoshi text-xs text-gray-400">Loading…</p>
            )}
            {!loading && items.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-6 w-6 text-gray-300" />
                <p className="mt-2 font-satoshi text-xs text-gray-400">No notifications</p>
              </div>
            )}
            {items.map((n) => (
              <button
                key={n.notificationId}
                type="button"
                onClick={() => handleItemClick(n)}
                className={`flex w-full flex-col gap-0.5 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 ${
                  n.read ? "opacity-70" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <p className="font-satoshi text-sm font-bold text-gray-900">{n.title}</p>
                  <span className="ml-auto shrink-0 font-satoshi text-[11px] text-gray-400">
                    {formatTime(n.createdAt)}
                  </span>
                </div>
                <p className="font-satoshi text-xs text-gray-600">{n.body}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
