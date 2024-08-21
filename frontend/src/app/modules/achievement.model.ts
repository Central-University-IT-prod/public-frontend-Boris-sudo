export interface Achievement {
  title: string;
  level: number;
  have_progress: number;
  need_progress: number[];
  about_text?: string;
  about: string;
  to_about: string[];
  img_path: string;
  color: string;
}
