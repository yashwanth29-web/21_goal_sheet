/**
 * Web Notification & PWA Push Reminder Service
 * Handles browser & Chrome installed app notifications for daily goals:
 * 1. Day Start / Morning: Overview of today's scheduled goals.
 * 2. Day End / Evening: Summary of completed goals vs target.
 * 3. Cheat Day / Holiday: Automatically suppresses all notifications on rest days.
 */

import type { Goal, StatusRecordsMap } from '../types';

export const notificationService = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      alert('Notifications are not supported by your browser.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem('goal_notifications_enabled', 'true');
        this.sendNotification(
          '🔔 Goal Tracker Alerts Active!',
          'You will receive morning goal briefings and evening progress summaries directly on your device!'
        );
        return true;
      }
      localStorage.setItem('goal_notifications_enabled', 'false');
      return false;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return false;
    }
  },

  isEnabled(): boolean {
    return this.isSupported() && Notification.permission === 'granted' && localStorage.getItem('goal_notifications_enabled') === 'true';
  },

  sendNotification(title: string, body: string, icon = '🎯'): void {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>' + icon + '</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>',
            tag: 'daily-goal-alert',
          });
        });
      } else {
        new Notification(title, {
          body,
          icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>' + icon + '</text></svg>',
        });
      }
    } catch (err) {
      console.warn('Notification dispatch notice:', err);
    }
  },

  /**
   * Automated Daily Notification Dispatcher:
   * - Checks current hour.
   * - Morning briefing (06:00 - 13:00): sends goal start overview if not yet sent today.
   * - Evening wrap-up (18:00 - 23:59): sends completed count summary if not yet sent today.
   * - IF CHEAT DAY: completely skips sending any notification.
   */
  checkAndSendDailyNotifications(
    todayKey: string,
    isCheatDay: boolean,
    slots: Goal[],
    statusRecords: StatusRecordsMap
  ): void {
    if (!this.isEnabled()) return;

    // 1. If today is a cheat day / holiday, DO NOT send notifications
    if (isCheatDay) {
      return;
    }

    const currentHour = new Date().getHours();
    const lastMorningDate = localStorage.getItem('last_morning_notif_date');
    const lastEveningDate = localStorage.getItem('last_evening_notif_date');

    // 2. Day Start / Morning Notification (06:00 - 13:59)
    if (currentHour >= 6 && currentHour < 14) {
      if (lastMorningDate !== todayKey) {
        localStorage.setItem('last_morning_notif_date', todayKey);

        const totalGoals = slots.length;
        if (totalGoals === 0) {
          this.sendNotification(
            '🌅 Good Morning!',
            'Open your Daily Goal Tracker to plan your routine and start building your streak!'
          );
        } else {
          const sampleGoalNames = slots
            .slice(0, 3)
            .map((s) => s.workGoal || s.goalTitle || 'Goal')
            .join(', ');
          const extra = slots.length > 3 ? ` and ${slots.length - 3} more` : '';

          this.sendNotification(
            `🌅 Morning Goal Briefing (${totalGoals} Scheduled)`,
            `Today's targets: ${sampleGoalNames}${extra}. Let's make today 100% consistent! 🎯`
          );
        }
      }
    }

    // 3. Day End / Evening Summary Notification (18:00 - 23:59)
    if (currentHour >= 18) {
      if (lastEveningDate !== todayKey) {
        localStorage.setItem('last_evening_notif_date', todayKey);

        let completed = 0;
        let partial = 0;
        let missed = 0;

        slots.forEach((s) => {
          const key = `${todayKey}_${s.id}`;
          const st = statusRecords[key]?.status;
          if (st === 'completed') completed++;
          else if (st === 'partial') partial++;
          else if (st === 'missed') missed++;
        });

        const totalGoals = slots.length;

        if (totalGoals > 0) {
          if (completed === totalGoals) {
            this.sendNotification(
              '🎉 100% Goals Completed Today!',
              `Outstanding consistency! You accomplished all ${totalGoals} of ${totalGoals} goals. Your streak is active! 🔥`,
              '🏆'
            );
          } else if (completed > 0) {
            const pct = Math.round(((completed + partial * 0.5) / totalGoals) * 100);
            this.sendNotification(
              `🌙 Evening Wrap-up: ${completed}/${totalGoals} Goals Completed (${pct}%)`,
              `You completed ${completed} goals today. Check off any remaining tasks to protect your streak! ⚡`,
              '📊'
            );
          } else {
            this.sendNotification(
              '🌙 Evening Check-in: Time to log today\'s progress!',
              `You have ${totalGoals} goals scheduled for today. Update your daily status before the day ends! 🎯`,
              '⏰'
            );
          }
        }
      }
    }
  },
};
