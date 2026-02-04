import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Service } from '../../types';
import { Plus, Edit, Trash2, X, Save, Loader2, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';

const ServicesAdmin: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    setServices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentService({
      title: '',
      description: '',
      icon_name: 'HelpCircle',
      is_active: true,
      display_order: services.length + 1
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      if (currentService.id) {
        await supabase
          .from('services')
          .update(currentService)
          .eq('id', currentService.id);
      } else {
        await supabase
          .from('services')
          .insert([currentService]);
      }
      setIsEditing(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Erro ao salvar serviço');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <AdminLayout title="Gerenciar Serviços">
      {!isEditing ? (
        <>
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Serviço
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {services.map((service) => (
                <div key={service.id} className="p-4 bg-zinc-900 rounded-lg border border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      {/* @ts-ignore */}
                      {React.createElement(Icons[service.icon_name] || Icons.HelpCircle, {
                        className: "w-5 h-5 text-blue-500"
                      })}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{service.title}</h3>
                      <p className="text-sm text-gray-400 truncate max-w-md">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
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
        <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {currentService.id ? 'Editar Serviço' : 'Novo Serviço'}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
              <input
                type="text"
                value={currentService.title || ''}
                onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Ícone (Lucide React)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentService.icon_name || ''}
                  onChange={(e) => setCurrentService({ ...currentService, icon_name: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white"
                  required
                />
                <div className="p-2 bg-black border border-white/10 rounded-lg flex items-center justify-center w-12">
                  {/* @ts-ignore */}
                  {React.createElement(Icons[currentService.icon_name] || Icons.HelpCircle, {
                    className: "w-5 h-5 text-blue-500"
                  })}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Ex: Wrench, Network, Code, Database, Cpu</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
              <textarea
                value={currentService.description || ''}
                onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white h-32"
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentService.is_active}
                  onChange={(e) => setCurrentService({ ...currentService, is_active: e.target.checked })}
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
                Salvar Serviço
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default ServicesAdmin;
