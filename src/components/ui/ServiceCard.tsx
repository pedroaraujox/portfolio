import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  // Dynamically get the icon component
  // @ts-ignore
  const IconComponent = Icons[service.icon_name] || Icons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-blue-500/50 hover:bg-zinc-900 transition-all duration-300 group"
    >
      <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <IconComponent className="w-7 h-7 text-blue-500" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
        {service.title}
      </h3>
      
      <p className="text-gray-400 leading-relaxed">
        {service.description}
      </p>
    </motion.div>
  );
};

export default ServiceCard;
