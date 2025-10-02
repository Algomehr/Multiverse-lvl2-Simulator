
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { SimulationReport, ChatMessage } from '../types';
import { CosmicRadarChart } from './charts/CosmicRadarChart';
import { CosmicCompositionChart } from './charts/CosmicCompositionChart';
import { ExpansionHistoryChart } from './charts/ExpansionHistoryChart';
import { NuclearStabilityChart } from './charts/NuclearStabilityChart';
import { Chat } from './Chat';

interface ReportDisplayProps {
  report: SimulationReport;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
}

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-center text-indigo-300">{title}</h3>
    {children}
  </div>
);

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, chatHistory, onSendMessage, isStreaming }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 prose prose-invert prose-lg max-w-none prose-h1:text-indigo-400 prose-h2:text-purple-400 prose-strong:text-indigo-300 prose-a:text-indigo-400 hover:prose-a:text-indigo-300">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {report.reportMarkdown}
        </ReactMarkdown>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Cosmic Characteristics"><CosmicRadarChart data={report.chartData.radar} /></ChartCard>
        <ChartCard title="Cosmic Composition"><CosmicCompositionChart data={report.chartData.composition} /></ChartCard>
        <ChartCard title="Universe Expansion History"><ExpansionHistoryChart data={report.chartData.expansion} /></ChartCard>
        <ChartCard title="Valley of Nuclear Stability"><NuclearStabilityChart data={report.chartData.stability} /></ChartCard>
      </div>
        
      <div>
        <h2 className="text-3xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          Converse with your Creation
        </h2>
        <Chat chatHistory={chatHistory} onSendMessage={onSendMessage} isStreaming={isStreaming} />
      </div>
    </div>
  );
};
