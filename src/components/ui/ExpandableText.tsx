import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableTextProps {
  content: string;
  limit?: number;
  className?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ content, limit = 300, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Se o conteúdo for menor que o limite, exibe normalmente
  if (!content || content.length <= limit) {
    return <p className={`whitespace-pre-wrap ${className}`}>{content}</p>;
  }

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <motion.div 
        initial={false}
        animate={{ height: 'auto' }}
        className="relative"
      >
        <p className="whitespace-pre-wrap leading-relaxed text-gray-300">
          {isExpanded ? content : `${content.slice(0, limit)}...`}
        </p>
      </motion.div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 text-blue-400 hover:text-blue-300 font-medium text-sm focus:outline-none transition-colors flex items-center gap-1"
      >
        {isExpanded ? 'Ver menos' : 'Ver mais'}
      </button>
    </div>
  );
};

export default ExpandableText;
