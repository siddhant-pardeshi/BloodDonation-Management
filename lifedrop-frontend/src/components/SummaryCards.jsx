import React from 'react';
import { Users, Droplets, FileText, Tent } from 'lucide-react';
import './SummaryCards.css';

const cardsData = [
  {
    id: 'donors',
    title: 'Total Donors',
    value: '—',
    icon: Users,
    color: 'var(--color-primary)',
    bgColor: 'var(--color-primary-bg)',
    trend: '+12 this month',
    trendUp: true,
  },
  {
    id: 'units',
    title: 'Units Available',
    value: '—',
    icon: Droplets,
    color: 'var(--color-accent)',
    bgColor: 'var(--color-accent-bg)',
    trend: 'Across all groups',
    trendUp: true,
  },
  {
    id: 'requests',
    title: 'Pending Requests',
    value: '—',
    icon: FileText,
    color: 'var(--color-warning)',
    bgColor: 'var(--color-warning-bg)',
    trend: 'Needs attention',
    trendUp: false,
  },
  {
    id: 'camps',
    title: 'Active Camps',
    value: '—',
    icon: Tent,
    color: 'var(--color-success)',
    bgColor: 'var(--color-success-bg)',
    trend: 'Upcoming events',
    trendUp: true,
  },
];

export default function SummaryCards({ stats }) {
  const getCardValue = (id) => {
    if (!stats) return '—';
    switch (id) {
      case 'donors': return stats.totalDonors ?? '—';
      case 'units': return stats.totalUnitsAvailable ?? '—';
      case 'requests': return stats.pendingRequests ?? '—';
      case 'camps': return stats.activeCamps ?? '—';
      default: return '—';
    }
  };

  return (
    <div className="summary-cards">
      {cardsData.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="summary-card">
            <div className="card-header">
              <div
                className="card-icon"
                style={{ background: card.bgColor, color: card.color }}
              >
                <Icon size={24} />
              </div>
              <span
                className="card-trend"
                style={{
                  color: card.trendUp ? 'var(--color-success)' : 'var(--color-warning)',
                }}
              >
                {card.trend}
              </span>
            </div>
            <div className="card-value">{getCardValue(card.id)}</div>
            <div className="card-title">{card.title}</div>
          </div>
        );
      })}
    </div>
  );
}
