// FIX: The SimulationMode type was imported but not exported, causing errors in other files.
// It is now defined and exported as an enum within this file to resolve the issue.
export enum SimulationMode {
  Narrative = 'Narrative',
  Researcher = 'Researcher',
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

// New types for the Galaxy Formation Simulator
export interface GalaxyVisualizationParameters {
  particleCount: number;
  coreColor: string;
  armColor: string;
  dustColor: string; // Color for dust lanes, e.g., a dark reddish-brown
  colorDispersion: number; // Factor from 0 to 1 for how much particle colors should vary
  spiralTightness: number;
  coreSize: number;
  armCount: number;
  ellipticity: number;
}

export interface GalaxyFormationData {
  galaxyType: 'Spiral' | 'Elliptical' | 'Irregular';
  description: string;
  starFormationRate: string;
  size: string;
  visualizationParameters: GalaxyVisualizationParameters;
}

// New types for the Chemical Evolution Simulator
export interface ChemicalElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  isStable: boolean;
  description: string;
}

export interface ChemicalEvolutionData {
  report: string;
  elements: ChemicalElement[];
}

// New types for the Dynamic Timeline Simulator
export interface TimelineEpoch {
  name: string;
  timeRange: string;
  description: string;
  temperature: string;
  universeSize: string;
  dominantProcess: string;
}

export interface DynamicTimelineData {
  summary: string;
  epochs: TimelineEpoch[];
}

// New types for the 3D Stellar Evolution Simulator
export interface StellarStage3D {
  name: string;
  duration: string;
  temperature: string;
  description: string;
  // Visualization specific
  color: string; // Hex color code for the star's main body
  relativeSize: number; // A relative size factor
  emissivity: number; // Brightness/Glow factor (0 to 1)
  surfaceTexture: 'smooth' | 'turbulent' | 'crystalline' | 'nebular' | 'blackhole'; // Describes the surface look
  coronaColor: string; // Hex color for the outer glow/corona
  coronaSize: number; // Relative size of the corona
}

export interface StellarEvolutionData3D {
  initialMass: number;
  finalFate: string;
  stages: StellarStage3D[];
}