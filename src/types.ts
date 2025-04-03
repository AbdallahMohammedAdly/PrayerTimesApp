export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  }
  
  export interface TimingsResponse {
    code: number;
    status: string;
    data: {
      timings: PrayerTimes;
      date: {
        readable: string;
        timestamp: string;
        hijri: {
          date: string;
          month: {
            en: string;
          };
          year: string;
        };
      };
    };
  }