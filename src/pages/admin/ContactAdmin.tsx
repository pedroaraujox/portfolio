import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { useSiteContent } from '../../hooks/useSiteContent';
import { useContactMessages } from '../../hooks/useContactMessages';
import { Save, Loader2, Mail, Check, Clock } from 'lucide-react';

const ContactAdmin: React.FC = () => {
  const { content } = useSiteContent('contato');
  const { messages, loading: messagesLoading } = useContactMessages();
  const [loading, setLoading] = useState(false);
  
  const [contactInfo, setContactInfo] = useState({
    email: '',
    linkedin: '',
    phone: ''
  });

  useEffect(() => {
    if (content.length > 0) {
      const info = content.find(c => c.section_name === 'info');
      if (info?.content_data) setContactInfo(info.content_data);
    }
  }, [content]);

  const handleSaveInfo = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          page_name: 'contato',
          section_name: 'info',
          content_data: contactInfo
        }, { onConflict: 'page_name,section_name' });

      if (error) throw error;
      alert('Informações atualizadas!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
  };

  return (
    <AdminLayout title="Gerenciar Contato">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact Info Editor */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-4">Informações de Contato</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input 
                  value={contactInfo.email}
                  onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
                <input 
                  value={contactInfo.linkedin}
                  onChange={e => setContactInfo({...contactInfo, linkedin: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Telefone / WhatsApp</label>
                <input 
                  value={contactInfo.phone}
                  onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <button
                onClick={handleSaveInfo}
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                Salvar Informações
              </button>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 h-[600px] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Mensagens Recebidas
            </h3>
            
            {messagesLoading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-center">Nenhuma mensagem.</p>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`p-4 rounded border ${msg.is_read ? 'bg-black/20 border-white/5' : 'bg-blue-900/10 border-blue-500/30'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white">{msg.sender_name}</h4>
                        <p className="text-xs text-blue-400">{msg.sender_email}</p>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 whitespace-pre-wrap">{msg.message}</p>
                    {!msg.is_read && (
                      <button 
                        onClick={() => markAsRead(msg.id)}
                        className="text-xs flex items-center gap-1 text-green-400 hover:text-green-300"
                      >
                        <Check className="w-3 h-3" /> Marcar como lida
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default ContactAdmin;
