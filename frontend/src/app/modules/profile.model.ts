export interface Profile {
  avatar_id?: number;
  available_avatars?: number[];

  background_id?: number;
  available_backgrounds?: number[];

  level?: number;
  money?: number;
  streak_days?: number;
  habits_complete?: number;

  freeze_count?: number;
}
