import { defaultMeetings } from '../data/mockMeetings';
import type { Meeting } from '../types';

const STORAGE_KEY = 'meetpilot-ai-meetings';

export const loadMeetings = (): Meeting[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultMeetings;
    return JSON.parse(raw) as Meeting[];
  } catch {
    return defaultMeetings;
  }
};

export const saveMeetings = (meetings: Meeting[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
};

export const resetMeetings = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMeetings));
  return defaultMeetings;
};
