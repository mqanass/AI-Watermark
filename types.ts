
export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
}

export interface UserState {
  credits: number;
  history: Asset[];
}

export type AppStage = 'animation' | 'tool';
