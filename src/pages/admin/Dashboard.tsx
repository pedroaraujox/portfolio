import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { FolderKanban, Wrench, MessageSquare, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    messages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: servicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
      const { count: messagesCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });

      setStats({
        projects: projectsCount || 0,
        services: servicesCount || 0,
        messages: messagesCount || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Projetos', value: stats.projects, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Serviços', value: stats.services, icon: Wrench, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Mensagens', value: stats.messages, icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="p-6 bg-zinc-900 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className="text-2xl font-bold">{card.value}</span>
            </div>
            <h3 className="text-gray-400">{card.title}</h3>
          </div>
        ))}
      </div>

      <div className="p-6 bg-zinc-900 rounded-xl border border-white/10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          Atividades Recentes
        </h3>
        <p className="text-gray-500">Nenhuma atividade recente registrada.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
