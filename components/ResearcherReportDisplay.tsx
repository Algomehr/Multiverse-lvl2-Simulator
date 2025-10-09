import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { ReportSectionCard } from './ReportSectionCard';
import { 
    DocumentTextIcon, 
    CalculatorIcon, 
    ForcesIcon, 
    AtomIcon, 
    GalaxyIcon, 
    StarIcon, 
    ScaleIcon, 
    LightbulbIcon 
} from './icons';

interface ResearcherReportDisplayProps {
  markdown: string;
}

interface ParsedSection {
    title: string;
    content: string;
}

interface ParsedReport {
    title: string;
    abstractContent: string;
    sections: ParsedSection[];
}

// This utility parses the structured markdown from Gemini into a more usable object.
const parseResearcherMarkdown = (markdown: string): ParsedReport => {
  if (!markdown) {
    return { title: '', abstractContent: '', sections: [] };
  }

  // Split the entire markdown into parts based on level 1 and 2 headings
  const parts = markdown.split(/(?=^# |^## )/m);

  let title = 'Untitled Universe';
  let abstractContent = '';
  const sections: ParsedSection[] = [];

  parts.forEach(part => {
    const trimmedPart = part.trim();
    if (trimmedPart.startsWith('# ')) {
      const lines = trimmedPart.split('\n');
      title = lines[0].replace('# ', '').trim();
    } else if (trimmedPart.startsWith('## ')) {
      const lines = trimmedPart.split('\n');
      const sectionTitle = lines[0].replace('## ', '').trim();
      const sectionContent = lines.slice(1).join('\n').trim();
      
      if (sectionTitle.toLowerCase() === 'abstract') {
        abstractContent = sectionContent;
      } else {
        sections.push({ title: sectionTitle, content: sectionContent });
      }
    }
  });

  return { title, abstractContent, sections };
};

// A mapping from keywords in section titles to icons and grid classes
const sectionConfig: { [key: string]: { icon: React.ReactNode; gridClass: string; } } = {
    'parameters': { icon: <CalculatorIcon />, gridClass: 'lg:col-span-3' },
    'forces': { icon: <ForcesIcon />, gridClass: 'lg:col-span-6' },
    'particle': { icon: <AtomIcon />, gridClass: 'lg:col-span-4' },
    'cosmology': { icon: <GalaxyIcon />, gridClass: 'lg:col-span-6' },
    'astrophysics': { icon: <StarIcon />, gridClass: 'lg:col-span-2' },
    'comparison': { icon: <ScaleIcon />, gridClass: 'lg:col-span-3' },
    'predictions': { icon: <LightbulbIcon />, gridClass: 'lg:col-span-6' },
};

const getSectionConfig = (title: string) => {
    const lowerTitle = title.toLowerCase();
    const key = Object.keys(sectionConfig).find(k => lowerTitle.includes(k));
    return key ? sectionConfig[key] : { icon: <DocumentTextIcon />, gridClass: 'lg:col-span-3' };
};

export const ResearcherReportDisplay: React.FC<ResearcherReportDisplayProps> = ({ markdown }) => {
    const { title, abstractContent, sections } = useMemo(() => parseResearcherMarkdown(markdown), [markdown]);

    return (
        <div className="w-full space-y-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 break-words">
                {title}
            </h1>
            
            {abstractContent && (
                 <ReportSectionCard title="Abstract" icon={<DocumentTextIcon />} gridClass="lg:col-span-6">
                    <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                        {abstractContent}
                    </ReactMarkdown>
                 </ReportSectionCard>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                {sections.map((section, index) => {
                    const config = getSectionConfig(section.title);
                    return (
                        <ReportSectionCard key={index} title={section.title} icon={config.icon} gridClass={config.gridClass}>
                            <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                                {section.content}
                            </ReactMarkdown>
                        </ReportSectionCard>
                    );
                })}
            </div>
        </div>
    );
};