
import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ReportDisplay } from './components/ReportDisplay';
import { SimulationMode, PhysicalConstants, SimulationReport, ChatMessage } from './types';
import { INITIAL_CONSTANTS } from './constants';
import { generateUniverseReport, streamChatResponse } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<SimulationMode>(SimulationMode.Narrative);
  const [constants, setConstants] = useState<PhysicalConstants>(INITIAL_CONSTANTS);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationReport, setSimulationReport] = useState<SimulationReport | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSimulationReport(null);
    setChatHistory([]);
    try {
      const report = await generateUniverseReport(mode, constants);
      setSimulationReport(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during simulation.');
    } finally {
      setIsLoading(false);
    }
  }, [mode, constants]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!simulationReport) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setIsStreaming(true);

    let fullResponse = "";
    const modelMessageIndex = newHistory.length;
    
    setChatHistory(prev => [...prev, { role: 'model', content: "" }]);

    try {
        await streamChatResponse(mode, constants, simulationReport.reportMarkdown, newHistory, (chunk) => {
            fullResponse += chunk;
            setChatHistory(prev => {
                const updated = [...prev];
                updated[modelMessageIndex] = { role: 'model', content: fullResponse };
                return updated;
            });
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while communicating with the universe.';
        setChatHistory(prev => {
            const updated = [...prev];
            updated[modelMessageIndex] = { role: 'model', content: `Error: ${errorMessage}` };
            return updated;
        });
    } finally {
        setIsStreaming(false);
    }
  }, [chatHistory, simulationReport, mode, constants]);


  return (
    <div className="min-h-screen w-full relative">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
                    Multiverse Simulator
                </h1>
                <p className="mt-2 text-lg text-slate-300 max-w-3xl mx-auto">
                    Play Cosmic Engineer. Adjust the fundamental laws of physics and birth a new universe.
                </p>
            </header>

            {isLoading && <LoadingAnimation />}

            {!simulationReport && (
                <ControlPanel
                    constants={constants}
                    setConstants={setConstants}
                    mode={mode}
                    setMode={setMode}
                    onSimulate={handleSimulate}
                    isLoading={isLoading}
                />
            )}
            
            {error && (
                <div className="mt-8 text-center p-4 bg-red-900/50 border border-red-500 rounded-lg max-w-2xl">
                    <h3 className="text-xl font-bold text-red-300">Simulation Failed</h3>
                    <p className="text-red-400 mt-2">{error}</p>
                    <button onClick={() => setError(null)} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md">Try Again</button>
                </div>
            )}
            
            {simulationReport && !isLoading && (
              <>
                <ReportDisplay 
                    report={simulationReport} 
                    chatHistory={chatHistory} 
                    onSendMessage={handleSendMessage}
                    isStreaming={isStreaming}
                />
                 <button 
                    onClick={() => setSimulationReport(null)}
                    className="mt-8 px-8 py-3 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-lg shadow-lg transition transform hover:scale-105"
                >
                    Create a New Universe
                </button>
              </>
            )}
        </main>
    </div>
  );
};

export default App;
