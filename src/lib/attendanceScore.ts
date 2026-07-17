import type { Profile } from '../types';

// Below this many answered surveys, the score is too noisy to show
// (e.g. a single no-show would read as a 0%).
export const ATTENDANCE_SCORE_MIN_SURVEYS = 3;

export const shouldShowAttendanceScore = (profile: Pick<Profile, 'attendance_score' | 'attendance_survey_count'>) =>
  profile.attendance_score != null && (profile.attendance_survey_count ?? 0) >= ATTENDANCE_SCORE_MIN_SURVEYS;
