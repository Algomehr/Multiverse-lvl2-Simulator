
export enum SimulationMode {
  Narrative = "Narrative",
  Researcher = "Researcher",
}

export interface PhysicalConstant {
  id: string;
  name: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export type PhysicalConstants = Record<string, PhysicalConstant>;

export interface ChartData {
  radar: { subject: string; value: number }[];
  composition: { name: string; value: number }[];
  expansion: { time: string; value: number }[];
  stability: { x: number; y: number; z: number}[];
}

export interface SimulationReport {
  reportMarkdown: string;
  chartData: ChartData;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
