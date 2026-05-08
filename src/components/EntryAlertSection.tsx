import { Link } from 'react-router-dom';
import type { MarathonEvent } from '../types';
import { getEventEntryDates, getEntryAlertDays } from '../utils/adminSettings';

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function DaysLabel({ days }: { days: number }) {
  if (days === 0) return <span className="text-xs font-bold text-red-500">本日まで</span>;
  if (days === 1) return <span className="text-xs font-bold text-red-500">残1日</span>;
  if (days <= 3) return <span className="text-xs font-bold text-red-500">残{days}日</span>;
  if (days <= 7) return <span className="text-xs font-bold text-orange-500">残{days}日</span>;
  return <span className="text-xs font-bold text-gray-500">残{days}日</span>;
}

function EntryCard({ event, days }: { event: MarathonEvent; days: number }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="flex-shrink-0 w-48 bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="text-xs text-gray-500 mb-1">{event.location}</div>
      <div className="text-sm font-bold text-navy-800 leading-snug mb-3 line-clamp-2">{event.name}</div>
      <DaysLabel days={days} />
    </Link>
  );
}

function AlertSection({ title, color, events }: {
  title: string;
  color: 'orange' | 'red';
  events: { event: MarathonEvent; days: number }[];
}) {
  if (events.length === 0) return null;
  const bg = color === 'orange' ? 'bg-orange-50' : 'bg-red-50';
  const text = color === 'orange' ? 'text-orange-600' : 'text-red-600';
  const border = color === 'orange' ? 'border-orange-200' : 'border-red-200';

  return (
    <div className={`rounded-2xl border ${border} ${bg} px-5 py-4`}>
      <div className={`text-sm font-black ${text} mb-3`}>{title}</div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {events.map(({ event, days }) => (
          <EntryCard key={event.id} event={event} days={days} />
        ))}
      </div>
    </div>
  );
}

export default function EntryAlertSection({ events }: { events: MarathonEvent[] }) {
  const entryDates = getEventEntryDates();
  const alertDays = getEntryAlertDays();

  const startingSoon: { event: MarathonEvent; days: number }[] = [];
  const endingSoon: { event: MarathonEvent; days: number }[] = [];

  for (const entry of entryDates) {
    const event = events.find((e) => e.id === entry.eventId);
    if (!event) continue;

    if (entry.entryStartDate) {
      const days = daysUntil(entry.entryStartDate);
      if (days >= 0 && days <= alertDays) {
        startingSoon.push({ event, days });
      }
    }
    if (entry.entryEndDate) {
      const days = daysUntil(entry.entryEndDate);
      if (days >= 0 && days <= alertDays) {
        endingSoon.push({ event, days });
      }
    }
  }

  startingSoon.sort((a, b) => a.days - b.days);
  endingSoon.sort((a, b) => a.days - b.days);

  if (startingSoon.length === 0 && endingSoon.length === 0) return null;

  return (
    <section className="bg-white py-6 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 space-y-4">
        <AlertSection title="⏰ もうすぐエントリー開始" color="orange" events={startingSoon} />
        <AlertSection title="🔴 もうすぐエントリー締切" color="red" events={endingSoon} />
      </div>
    </section>
  );
}
