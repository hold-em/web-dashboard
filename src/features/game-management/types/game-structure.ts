export interface GameItem {
  id: string;
  type: 'game' | 'break';
  level?: number;
  sb?: number;
  bb?: number;
  entry?: number;
  duration?: number;
  breakDuration?: number;
}

export interface TemplateData {
  name: string;
  items: GameItem[];
}
