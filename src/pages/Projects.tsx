import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import ProjectCard from '../components/ui/ProjectCard';
import ProjectModal from '../components/ui/ProjectModal';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types';
import { Loader2 } from 'lucide-react';

const Projects: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300); // Wait for animation
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white pt-20 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Projetos em Destaque</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Uma coleção de soluções tecnológicas desenvolvidas com foco em 
              inovação, performance e resolução de problemas reais.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 bg-red-900/10 p-4 rounded-lg">
              <p>Erro ao carregar projetos: {error}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-500 py-20 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-xl">Nenhum projeto cadastrado ainda.</p>
              <p className="mt-2 text-sm">Acesse o painel administrativo para adicionar projetos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={handleProjectClick}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </Layout>
  );
};

export default Projects;
