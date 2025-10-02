
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SendIcon, SparklesIcon } from './icons';

interface ChatProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
}

export const Chat: React.FC<ChatProps> = ({ chatHistory, onSendMessage, isStreaming }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="mt-8 flex flex-col h-[500px] bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-white" /></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-gray-300 rounded-bl-none'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isStreaming && chatHistory.length > 0 && chatHistory[chatHistory.length -1].role === 'user' && (
             <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="max-w-md p-3 rounded-lg bg-slate-700 text-gray-300 rounded-bl-none">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-slate-700">
        <div className="flex items-center bg-slate-800 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your universe..."
            disabled={isStreaming}
            className="w-full bg-transparent p-3 focus:outline-none"
          />
          <button type="submit" disabled={isStreaming || !input.trim()} className="p-3 text-indigo-400 hover:text-indigo-300 disabled:text-slate-500 disabled:cursor-not-allowed transition">
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};
