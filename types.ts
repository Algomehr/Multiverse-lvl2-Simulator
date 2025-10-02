export enum SimulationMode {
  Narrative = "Narrative",
  Researcher = "Researcher",
}

export interface PhysicalConstant {
  id: string;
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

// New types for the Stellar Evolution Simulator
export interface StellarStage {
  name: string;
  duration: string;
  temperature: string;
  description: string;
  color: string; // Hex color code for visualization
  relativeSize: number; // A relative size factor for visualization
}

export interface StellarEvolutionData {
  initialMass: number;
  finalFate: string;
  stages: StellarStage[];
}