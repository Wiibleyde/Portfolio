import React from 'react';

interface TerminalHeaderPanelProps {
    title?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const TerminalHeaderPanel: React.FC<TerminalHeaderPanelProps> = ({ title = 'wiibleyde@stream: twitch-chat', className = '', style, children }) => {
    return (
        <div className={`bg-black/60 border border-gray-700 rounded-xl shadow-lg flex flex-col ${className}`} style={style}>
            {/* Terminal header */}
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 rounded-t-md flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm font-mono ml-4">{title}</span>
                </div>
            </div>
            {/* Content */}
            <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
        </div>
    );
};

export default TerminalHeaderPanel;
