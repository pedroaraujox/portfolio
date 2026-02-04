import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Project } from '../../types';
import { Plus, Edit, Trash2, X, Save, Loader2 } from 'lucide-react';

const ProjectsAdmin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentProject({
      title: '',
      description: '',
      image_url: '',
      problem: '',
      solution: '',
      technologies: '',
      result: '',
      learnings: '',
      is_active: true,
      display_order: projects.length + 1
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      if (currentProject.id) {
        await supabase
          .from('projects')
          .update(currentProject)
          .eq('id', currentProject.id);
      } else {
        await supabase
          .from('projects')
          .insert([currentProject]);
      }
      setIsEditing(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Erro ao salvar projeto');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <AdminLayout title="Gerenciar Projetos">
      {!isEditing ? (
        <>
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Projeto
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 bg-zinc-900 rounded-lg border border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{project.title}</h3>
                    <p className="text-sm text-gray-400 truncate max-w-md">{project.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {currentProject.id ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                <input
                  type="text"
                  value={currentProject.title || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Imagem URL</label>
                <input
                  type="text"
                  value={currentProject.image_url || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Descrição Curta</label>
              <textarea
                value={currentProject.description || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white h-20"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Problema</label>
                <textarea
                  value={currentProject.problem || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, problem: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Solução</label>
                <textarea
                  value={currentProject.solution || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, solution: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white h-32"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tecnologias (separadas por vírgula)</label>
              <input
                type="text"
                value={currentProject.technologies || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, technologies: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Resultado</label>
                <textarea
                  value={currentProject.result || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, result: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Aprendizados</label>
                <textarea
                  value={currentProject.learnings || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, learnings: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white h-32"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentProject.is_active}
                  onChange={(e) => setCurrentProject({ ...currentProject, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Ativo</span>
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={saveLoading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Projeto
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProjectsAdmin;
