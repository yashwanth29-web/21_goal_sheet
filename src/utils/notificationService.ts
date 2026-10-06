/**
 * Web Notification & PWA Push Reminder Service
 * Features:
 * 1. 100 Unique Non-Repeating Telugu-English (Tanglish) Hype Notifications
 * 2. Per-Goal Slot Triggering: Reminds users right when their scheduled goal period starts.
 * 3. Morning Briefing & Evening Wrap-up Streak Protection.
 * 4. Instant Friend Request Alerts.
 * 5. Automatic Cheat Day Suppression.
 */

import type { Goal, StatusRecordsMap } from '../types';
import { getSmartTanglishNotification } from './tanglishNotificationMessages';

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
          '🔥 Goal Tracker Alerts On Bro!',
          'Prathi goal slot time ki neeku high-energy Telugu-English reminders vasthayi! Let’s crush the streak! 🎯'
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

  sendNotification(title: string, body: string, _icon = '/icon-192.png'): void {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      console.warn('Cannot send notification: permission not granted or unsupported', Notification.permission);
      return;
    }

    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then((registration) => {
            registration.showNotification(title, {
              body,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              vibrate: [200, 100, 200],
              tag: 'daily-goal-alert-' + Date.now(),
            } as any);
          })
          .catch(() => {
            new Notification(title, {
              body,
              icon: '/icon-192.png',
            });
          });
      } else {
        new Notification(title, {
          body,
          icon: '/icon-192.png',
        });
      }
    } catch (err) {
      console.warn('Notification dispatch error, trying fallback:', err);
      try {
        new Notification(title, { body, icon: '/icon-192.png' });
      } catch (_e) {
        // ignore
      }
    }
  },

  /**
   * Helper: Parse slot start time into minutes from midnight (0..1439)
   * Handles "06:00 AM - 07:00 AM", "6:00 AM", "14:30", etc.
   */
  parseSlotStartMinutes(timeSlotStr: string): number | null {
    if (!timeSlotStr || typeof timeSlotStr !== 'string') return null;
    const firstPart = timeSlotStr.split('-')[0].trim();
    
    // Match "HH:MM AM/PM" or "HH:MM"
    const match = firstPart.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
    if (!match) return null;

    let hour = parseInt(match[1], 10);
    const minute = match[2] ? parseInt(match[2], 10) : 0;
    const meridian = match[3]?.toUpperCase();

    if (meridian === 'PM' && hour < 12) hour += 12;
    if (meridian === 'AM' && hour === 12) hour = 0;

    return hour * 60 + minute;
  },

  /**
   * Automated Daily & Per-Slot Notification Dispatcher
   * - Checks active goal slots and triggers Telugu-English notifications when slot starts.
   * - Sends morning kickstart and evening wrap-up.
   * - Completely skips on Cheat Days.
   */
  checkAndSendDailyNotifications(
    todayKey: string,
    isCheatDay: boolean,
    slots: Goal[],
    statusRecords: StatusRecordsMap
  ): void {
    if (!this.isEnabled()) return;

    // 1. If today is a cheat day / holiday, suppress notifications
    if (isCheatDay) {
      return;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentHour = now.getHours();

    // 2. Per-Goal Slot Trigger Check
    slots.forEach((slot, index) => {
      const taskName = slot.workGoal || slot.goalTitle || `Goal Slot ${index + 1}`;
      const timeSlot = slot.time || (slot as any).timeSlot || 'Scheduled Time';
      const slotMinutes = this.parseSlotStartMinutes(timeSlot);

      if (slotMinutes !== null) {
        // Trigger if current time is within [slotMinutes - 5, slotMinutes + 35] window and not yet triggered today
        const slotKey = `notif_sent_${todayKey}_slot_${slot.id}`;
        const isTriggerWindow = currentMinutes >= slotMinutes - 5 && currentMinutes <= slotMinutes + 35;

        if (isTriggerWindow && !localStorage.getItem(slotKey)) {
          localStorage.setItem(slotKey, 'true');
          const notif = getSmartTanglishNotification(taskName, timeSlot);
          this.sendNotification(notif.title, notif.body);
        }
      }
    });

    // 3. Morning Kickoff Briefing (06:00 - 09:30) if not sent
    const lastMorningDate = localStorage.getItem('last_morning_notif_date');
    if (currentHour >= 6 && currentHour < 10 && lastMorningDate !== todayKey) {
      localStorage.setItem('last_morning_notif_date', todayKey);
      const firstSlot = slots[0];
      const taskName = firstSlot?.workGoal || firstSlot?.goalTitle || 'Today Goals';
      const notif = getSmartTanglishNotification(taskName, firstSlot?.time || (firstSlot as any)?.timeSlot || 'Morning', 'morning');
      this.sendNotification(notif.title, notif.body);
    }

    // 4. Evening Wrap-Up & Streak Lock (20:00 - 23:59)
    const lastEveningDate = localStorage.getItem('last_evening_notif_date');
    if (currentHour >= 20 && lastEveningDate !== todayKey) {
      localStorage.setItem('last_evening_notif_date', todayKey);
      let completed = 0;
      slots.forEach((s) => {
        const key = `${todayKey}_${s.id}`;
        if (statusRecords[key]?.status === 'completed') completed++;
      });

      const totalGoals = slots.length;
      if (completed === totalGoals && totalGoals > 0) {
        this.sendNotification(
          '🔥 Thaggedhe Le! 100% Goals Completed Today! 🏆',
          `Rey macha, all ${totalGoals}/${totalGoals} goals complete chesav! Nuvvu true champion bro, streak locked! 🔥`
        );
      } else {
        const lastSlot = slots.find((s) => statusRecords[`${todayKey}_${s.id}`]?.status !== 'completed') || slots[0];
        const taskName = lastSlot?.workGoal || lastSlot?.goalTitle || 'Daily Goals';
        const notif = getSmartTanglishNotification(taskName, 'Night', 'night');
        this.sendNotification(notif.title, notif.body);
      }
    }
  },

  /**
   * Instant Friend Request Notification Trigger
   */
  notifyFriendRequestReceived(senderName: string): void {
    if (!this.isEnabled()) return;
    this.sendNotification(
      '🔔 Kotta Friend Request Vachindi!',
      `🔥 Rey macha, ${senderName} neeku friend request pampadu! Leaderboard lo connect ayyi competition modalu pettu! 🏆`
    );
  },

  /**
   * Instant Friend Request Accepted Notification Trigger
   */
  notifyFriendRequestAccepted(friendName: string): void {
    if (!this.isEnabled()) return;
    this.sendNotification(
      '🎉 Friend Request Accepted!',
      `🔥 Super bro! ${friendName} mee friend request accept chesadu! Ippudu iddaru kalisi daily goals track cheskondi! 🎯`
    );
  },
};
