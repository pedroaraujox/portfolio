import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Lightbulb, CheckCircle, BookOpen, AlertCircle } from 'lucide-react';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header with Image */}
            <div className="relative h-48 sm:h-64 flex-shrink-0 bg-zinc-800">
              {project.image_url ? (
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-black flex items-center justify-center">
                  <Code className="w-16 h-16 text-white/20" />
                </div>
              )}
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              <div className="mb-8 border-b border-white/10 pb-8">
                <h2 className="text-3xl font-bold text-white mb-4">{project.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed">{project.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      O Problema
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{project.problem}</p>
                  </div>
                  
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-2">
                      <Lightbulb className="w-5 h-5" />
                      A Solução
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{project.solution}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-2">
                      <Code className="w-5 h-5" />
                      Tecnologias
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(',').map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      Resultado
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{project.result}</p>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-2">
                      <BookOpen className="w-5 h-5" />
                      Aprendizados
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{project.learnings}</p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
