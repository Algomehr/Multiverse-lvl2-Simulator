
import React from 'react';

const messages = [
  "Igniting the primeval atom...",
  "Stretching the fabric of spacetime...",
  "Cooling the quark-gluon plasma...",
  "Calibrating fundamental forces...",
  "Awaiting cosmic inflation...",
  "Forming the first protons and neutrons...",
  "Rendering the cosmic microwave background...",
  "Assembling the first galaxies...",
];

export const LoadingAnimation: React.FC = () => {
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);


  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-50">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-50"></div>
        <div className="absolute inset-4 bg-purple-500 rounded-full animate-ping opacity-50 delay-100"></div>
        <div className="absolute inset-8 bg-pink-500 rounded-full animate-ping opacity-50 delay-200"></div>
        <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-2xl shadow-white animate-pulse"></div>
        </div>
      </div>
      <p className="mt-12 text-xl font-semibold text-gray-300 animate-pulse transition-all duration-500">{message}</p>
    </div>
  );
};
