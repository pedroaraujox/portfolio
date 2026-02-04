import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/ui/ServiceCard';
import { useServices } from '../hooks/useServices';
import { Loader2 } from 'lucide-react';

const Services: React.FC = () => {
  const { services, loading, error } = useServices();

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white pt-20 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Meus Serviços</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Soluções completas em TI, desde suporte e infraestrutura até desenvolvimento de software e automação.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 bg-red-900/10 p-4 rounded-lg">
              <p>Erro ao carregar serviços: {error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center text-gray-500 py-20 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-xl">Nenhum serviço cadastrado ainda.</p>
              <p className="mt-2 text-sm">Acesse o painel administrativo para adicionar serviços.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Services;
