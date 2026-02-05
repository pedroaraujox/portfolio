import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { useSiteContent } from '../../hooks/useSiteContent';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import ImageUploader from '../../components/ui/ImageUploader';

const AboutAdmin: React.FC = () => {
  const { content, loading: contentLoading } = useSiteContent('sobre');
  const [loading, setLoading] = useState(false);
  
  // Local state for form fields
  const [hero, setHero] = useState({ title: '', description: '', photo_url: '' });
  const [timeline, setTimeline] = useState<any[]>([]);
  const [qualities, setQualities] = useState<any[]>([]);

  useEffect(() => {
    if (!contentLoading && content.length > 0) {
      const heroData = content.find(c => c.section_name === 'hero');
      const timelineData = content.find(c => c.section_name === 'timeline');
      const qualitiesData = content.find(c => c.section_name === 'qualities');

      if (heroData?.content_data) setHero(heroData.content_data);
      if (timelineData?.content_data) setTimeline(timelineData.content_data);
      if (qualitiesData?.content_data) setQualities(qualitiesData.content_data);
    }
  }, [content, contentLoading]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = [
        { page_name: 'sobre', section_name: 'hero', content_data: hero },
        { page_name: 'sobre', section_name: 'timeline', content_data: timeline },
        { page_name: 'sobre', section_name: 'qualities', content_data: qualities }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_content')
          .upsert(update, { onConflict: 'page_name,section_name' });
        if (error) throw error;
      }
      
      alert('Conteúdo atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Erro ao atualizar conteúdo.');
    } finally {
      setLoading(false);
    }
  };

  const addTimelineItem = () => {
    setTimeline([...timeline, { year: '', title: '', description: '', type: 'education' }]);
  };

  const removeTimelineItem = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const updateTimelineItem = (index: number, field: string, value: string) => {
    const newTimeline = [...timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setTimeline(newTimeline);
  };

  const handleImageSelected = async (file: Blob) => {
    try {
      // Create a unique filename
      const fileName = `about-hero-${Date.now()}.jpg`;
      
      // Upload to Supabase Storage (assuming 'portfolio' bucket exists)
      const { data, error } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg'
        });

      if (error) {
        throw error;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName);

      setHero(prev => ({ ...prev, photo_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem. Verifique se o bucket "portfolio" existe no Supabase.');
    }
  };

  const handleImageRemoved = () => {
    setHero(prev => ({ ...prev, photo_url: '' }));
  };

  if (contentLoading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <AdminLayout title="Gerenciar Sobre Mim">
      <div className="space-y-8 max-w-4xl">
        
        {/* Hero Section */}
        <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4">Cabeçalho</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <ImageUploader 
                currentImage={hero.photo_url}
                onImageSelected={handleImageSelected}
                onImageRemoved={handleImageRemoved}
              />
            </div>
            <div className="space-y-4 flex-grow">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Título</label>
                <input 
                  type="text" 
                  value={hero.title} 
                  onChange={e => setHero({...hero, title: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                <textarea 
                  value={hero.description} 
                  onChange={e => setHero({...hero, description: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white h-24"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-zinc-900 p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Linha do Tempo</h3>
            <button onClick={addTimelineItem} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <Plus size={16} /> Adicionar
            </button>
          </div>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="bg-black/50 p-4 rounded border border-white/5 relative">
                <button 
                  onClick={() => removeTimelineItem(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <input 
                    placeholder="Ano"
                    value={item.year}
                    onChange={e => updateTimelineItem(idx, 'year', e.target.value)}
                    className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-white"
                  />
                  <select 
                    value={item.type}
                    onChange={e => updateTimelineItem(idx, 'type', e.target.value)}
                    className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-white"
                  >
                    <option value="work">Trabalho</option>
                    <option value="education">Educação</option>
                  </select>
                </div>
                <input 
                  placeholder="Título"
                  value={item.title}
                  onChange={e => updateTimelineItem(idx, 'title', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1 text-white mb-2"
                />
                <textarea 
                  placeholder="Descrição"
                  value={item.description}
                  onChange={e => updateTimelineItem(idx, 'description', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded px-2 py-1 text-white h-20"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save />}
            Salvar Alterações
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutAdmin;
