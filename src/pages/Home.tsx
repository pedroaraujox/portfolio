import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Database, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Layout>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Pedro Henrique <span className="text-blue-500">Araújo Silva</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Analista de Suporte & Desenvolvedor em formação.
              Transformando problemas em soluções tecnológicas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/projetos"
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all flex items-center gap-2 group"
              >
                Ver Projetos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contato"
                className="px-8 py-3 border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-all"
              >
                Entrar em Contato
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
              <Server className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Infraestrutura</h3>
              <p className="text-gray-400">Gestão e manutenção de redes e servidores com foco em estabilidade.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
              <Code className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Desenvolvimento</h3>
              <p className="text-gray-400">Criação de soluções web modernas utilizando React e Node.js.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
              <Database className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Banco de Dados</h3>
              <p className="text-gray-400">Modelagem e administração de dados para garantir integridade.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
