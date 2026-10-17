import { AlarmClock, Droplets, Ghost, Moon, ShieldCheck, Sunrise } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { BadgeIconKey } from '../../lib/api';

export const BADGE_ICONS: Record<BadgeIconKey, LucideIcon> = {
  mask: Ghost,
  alarm: AlarmClock,
  moon: Moon,
  droplet: Droplets,
  sunrise: Sunrise,
  shield: ShieldCheck,
};
