import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, GraduationCap } from 'lucide-react';

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  type: 'work' | 'education';
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description, type, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 pb-12 border-l border-white/20 last:border-0 last:pb-0"
    >
      <div className="absolute left-[-10px] top-0 p-1 bg-black border border-blue-500 rounded-full">
        {type === 'work' ? (
          <Briefcase className="w-3 h-3 text-blue-500" />
        ) : (
          <GraduationCap className="w-3 h-3 text-blue-500" />
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
        <span className="text-blue-500 font-mono text-sm font-bold flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          {year}
        </span>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      <p className="text-gray-400 leading-relaxed max-w-2xl">
        {description}
      </p>
    </motion.div>
  );
};

export default TimelineItem;
