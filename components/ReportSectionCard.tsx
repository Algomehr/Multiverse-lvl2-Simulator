import React from 'react';

interface ReportSectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  gridClass?: string;
}

export const ReportSectionCard: React.FC<ReportSectionCardProps> = ({ title, icon, children, gridClass = 'lg:col-span-6' }) => {
  return (
    <div className={`p-[1px] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg h-full ${gridClass}`}>
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-[15px] p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-purple-400 flex-shrink-0">{icon}</div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {title}
          </h3>
        </div>
        <div className="prose prose-invert prose-base max-w-none prose-p:my-2 prose-p:text-slate-300 prose-headings:text-indigo-300 prose-strong:text-indigo-200 prose-table:w-full prose-thead:border-b prose-thead:border-slate-600 prose-th:text-left prose-th:font-semibold prose-th:text-indigo-300 prose-td:p-2 prose-td:border-b prose-td:border-slate-800 prose-li:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
};