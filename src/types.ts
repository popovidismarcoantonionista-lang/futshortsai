export interface ThumbnailSuggestion {
  text: string;
  layoutDescription: string;
  suggestedColors: string[];
}

export interface SocialDescriptions {
  shorts: string;
  tiktok: string;
  reels: string;
}

export interface AIReviewReport {
  whySelected: string;
  emotionDetected: string;
  retentionPotential: string;
  sharingPotential: string;
}

export interface VideoClip {
  id: string;
  title: string;
  category: "gol" | "quase gol" | "assistência" | "cartão" | "entrevista" | "coletiva" | "polêmica" | "provocação" | "bastidores" | "análise tática" | "notícias urgentes";
  duration: number; // e.g. 30, 45, 60, 90 seconds
  scores: {
    viral: number;
    retention: number;
    engagement: number;
    ctr: number;
  };
  timestamps: {
    start: string; // e.g. "01:23"
    end: string;   // e.g. "01:53"
  };
  vibe: string;
  titles: string[]; // 10 generated titles
  descriptions: SocialDescriptions;
  hashtags: string[];
  thumbnail: ThumbnailSuggestion;
  report: AIReviewReport;
  mockVideoUrl: string; // Used for local preview in simple HTML5 player
}

export interface MatchAnalysis {
  id: string;
  videoName: string;
  videoSourceType: "upload" | "url";
  videoUrl?: string;
  uploadedAt: string;
  status: "idle" | "processing" | "completed" | "failed";
  matchInfo: {
    teams: string;
    highlightsCount: number;
    summary: string;
  };
  clips: VideoClip[];
}

export interface UserSubscription {
  id: string;
  email: string;
  plan: "Free" | "Pro" | "Copinha" | "Champions";
  status: "active" | "cancelled" | "past_due";
  price: string;
  renewalDate: string;
}

export interface PaymentReceipt {
  id: string;
  userEmail: string;
  amount: number;
  status: "approved" | "pending" | "failed";
  paymentMethod: "Pix" | "CreditCard";
  date: string;
}

export interface ServerLog {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error";
  component: "AI Engine" | "Transcription" | "Queue Manager" | "Video Clipper" | "Billing";
  message: string;
}

export interface SaaSMetrics {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  processedSeconds: number;
  clipsGenerated: number;
}
