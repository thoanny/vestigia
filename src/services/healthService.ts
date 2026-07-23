import { Health } from '@capgo/capacitor-health';

export interface DailySteps {
  date: string | undefined;
  steps: number;
}

class HealthService {
  private initialized = false;
  private available = false;

  async init(): Promise<boolean> {
    if (this.initialized) return this.available;

    const { available, reason } = await Health.isAvailable();
    if (!available) {
      console.warn('Health API indisponible sur cet appareil :', reason);
      this.initialized = true;
      this.available = false;
      return false;
    }

    try {
      await Health.requestAuthorization({
        read: ['steps'],
        write: [],
      });
      this.available = true;
    } catch (err) {
      console.error('Autorisation Health refusée ou échouée :', err);
      this.available = false;
    }

    this.initialized = true;
    return this.available;
  }

  isAvailable(): boolean {
    return this.available;
  }

  async getStepsToday(): Promise<number> {
    if (!this.available) return 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const now = new Date();

    return this.getStepsBetween(startOfDay, now);
  }

  async getStepsWeek(): Promise<number> {
    if (!this.available) return 0;

    const today = new Date();

    const day = today.getDay(); // 0: dimanche, 1: lundi
    const diff = day === 0 ? -6 : 1 - day;

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() + diff);
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const now = new Date();

    return this.getStepsBetween(firstDayOfWeek, now);
  }

  async getStepsBetween(startDate: Date, endDate: Date): Promise<number> {
    if (!this.available) return 0;

    try {
      const { samples } = await Health.readSamples({
        dataType: 'steps',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 0,
      });

      return samples.reduce((total, sample) => total + sample.value, 0);
    } catch (err) {
      console.error('Erreur lors de la lecture des pas :', err);
      return 0;
    }
  }

  async getStepsHistory(days: number): Promise<DailySteps[]> {
    if (!this.available) return [];

    const result: DailySteps[] = [];

    for (let i = 0; i < days; i++) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const steps = await this.getStepsBetween(dayStart, dayEnd);

      result.push({
        date: new Intl.DateTimeFormat('sv-SE').format(dayStart),
        steps,
      });
    }

    return result.reverse();
  }
}

export const healthService = new HealthService();
