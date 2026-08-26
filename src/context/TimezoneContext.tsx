import React, { createContext, useContext, useState, useEffect } from 'react';

export type TimeFormat = '12h' | '24h';

export interface TimezoneOption {
  id: string;
  label: string;
  city: string;
  offset: string;
  zone: string;
}

export const SUPPORTED_TIMEZONES: TimezoneOption[] = [
  { id: 'IST', label: 'India Standard Time (IST)', city: 'New Delhi / Mumbai', offset: '+05:30', zone: 'Asia/Kolkata' },
  { id: 'UTC', label: 'Coordinated Universal Time (UTC)', city: 'UTC / GMT Standard', offset: '+00:00', zone: 'UTC' },
  { id: 'EST', label: 'Eastern Time (US / Canada - EST/EDT)', city: 'New York / Toronto', offset: '-04:00', zone: 'America/New_York' },
  { id: 'CST', label: 'Central Time (US - CST/CDT)', city: 'Chicago / Dallas', offset: '-05:00', zone: 'America/Chicago' },
  { id: 'PST', label: 'Pacific Time (US - PST/PDT)', city: 'San Francisco / Seattle', offset: '-07:00', zone: 'America/Los_Angeles' },
  { id: 'GMT', label: 'British Summer / GMT Time', city: 'London / Edinburgh', offset: '+01:00', zone: 'Europe/London' },
  { id: 'CET', label: 'Central European Time (CET/CEST)', city: 'Frankfurt / Paris / Berlin', offset: '+02:00', zone: 'Europe/Berlin' },
  { id: 'GST', label: 'Gulf Standard Time (GST)', city: 'Dubai / Abu Dhabi', offset: '+04:00', zone: 'Asia/Dubai' },
  { id: 'SGT', label: 'Singapore & Malaysia Time (SGT)', city: 'Singapore / Kuala Lumpur', offset: '+08:00', zone: 'Asia/Singapore' },
  { id: 'JST', label: 'Japan Standard Time (JST)', city: 'Tokyo / Osaka', offset: '+09:00', zone: 'Asia/Tokyo' },
  { id: 'AEST', label: 'Australian Eastern Time (AEST)', city: 'Sydney / Melbourne', offset: '+10:00', zone: 'Australia/Sydney' }
];

interface TimezoneContextType {
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
  timezone: string;
  setTimezone: (zoneId: string) => void;
  selectedZone: TimezoneOption;
  currentTime: string;
  formatTime: (dateInput: Date | string | number, customFormat?: TimeFormat, targetZone?: string) => string;
  formatDateTime: (dateInput: Date | string | number, targetZone?: string) => string;
  convertTime: (timeString: string, fromZone: string, toZone: string) => string;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

export const TimezoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>(() => {
    const saved = localStorage.getItem('pm_time_format');
    return (saved === '12h' || saved === '24h') ? saved : '12h';
  });

  const [timezone, setTimezoneState] = useState<string>(() => {
    const saved = localStorage.getItem('pm_timezone');
    return saved || 'IST';
  });

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const setTimeFormat = (fmt: TimeFormat) => {
    setTimeFormatState(fmt);
    localStorage.setItem('pm_time_format', fmt);
  };

  const setTimezone = (zoneId: string) => {
    setTimezoneState(zoneId);
    localStorage.setItem('pm_timezone', zoneId);
  };

  const selectedZone = SUPPORTED_TIMEZONES.find((z) => z.id === timezone) || SUPPORTED_TIMEZONES[0];

  const formatTime = (
    dateInput: Date | string | number,
    customFormat?: TimeFormat,
    targetZoneId?: string
  ): string => {
    try {
      const date = typeof dateInput === 'string' || typeof dateInput === 'number'
        ? new Date(dateInput)
        : dateInput;

      if (isNaN(date.getTime())) {
        return typeof dateInput === 'string' ? dateInput : 'Invalid Time';
      }

      const activeFmt = customFormat || timeFormat;
      const zoneObj = targetZoneId
        ? (SUPPORTED_TIMEZONES.find((z) => z.id === targetZoneId) || selectedZone)
        : selectedZone;

      const hour12 = activeFmt === '12h';

      const timeStr = date.toLocaleTimeString('en-US', {
        timeZone: zoneObj.zone,
        hour: '2-digit',
        minute: '2-digit',
        second: undefined,
        hour12
      });

      return `${timeStr} ${zoneObj.id}`;
    } catch {
      return String(dateInput);
    }
  };

  const formatDateTime = (
    dateInput: Date | string | number,
    targetZoneId?: string
  ): string => {
    try {
      const date = typeof dateInput === 'string' || typeof dateInput === 'number'
        ? new Date(dateInput)
        : dateInput;

      if (isNaN(date.getTime())) {
        return typeof dateInput === 'string' ? dateInput : 'Invalid Date';
      }

      const zoneObj = targetZoneId
        ? (SUPPORTED_TIMEZONES.find((z) => z.id === targetZoneId) || selectedZone)
        : selectedZone;

      const dateStr = date.toLocaleDateString('en-US', {
        timeZone: zoneObj.zone,
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const timeStr = formatTime(date, timeFormat, zoneObj.id);
      return `${dateStr}, ${timeStr}`;
    } catch {
      return String(dateInput);
    }
  };

  const convertTime = (timeString: string, fromZoneId: string, toZoneId: string): string => {
    try {
      const fromZone = SUPPORTED_TIMEZONES.find((z) => z.id === fromZoneId) || SUPPORTED_TIMEZONES[0];
      const toZone = SUPPORTED_TIMEZONES.find((z) => z.id === toZoneId) || SUPPORTED_TIMEZONES[1];

      const today = new Date().toISOString().split('T')[0];
      const parsedDate = new Date(`${today} ${timeString.replace(/[A-Z]{3,4}/g, '').trim()}`);

      if (isNaN(parsedDate.getTime())) return timeString;

      return formatTime(parsedDate, timeFormat, toZone.id);
    } catch {
      return timeString;
    }
  };

  const currentTime = formatTime(currentDate, timeFormat, selectedZone.id);

  return (
    <TimezoneContext.Provider
      value={{
        timeFormat,
        setTimeFormat,
        timezone,
        setTimezone,
        selectedZone,
        currentTime,
        formatTime,
        formatDateTime,
        convertTime
      }}
    >
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = (): TimezoneContextType => {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
};
