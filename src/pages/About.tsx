import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import TimelineItem from '../components/ui/Timeline';
import { motion } from 'framer-motion';
import { User, Target, Zap, BookOpen, Terminal, Briefcase, Code, Rocket, Cpu, Network } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

const About: React.FC = () => {
  const { content } = useSiteContent('sobre');
  
  // Default data (fallback)
  const defaultTimeline = [
    {
      year: '2024 - Atual',
      title: 'Analista de Suporte Júnior & Estudante de ADS',
      description: 'Atualmente atuando como Analista de Suporte, resolvendo incidentes, configurando redes e otimizando processos. Paralelamente, cursando Análise e Desenvolvimento de Sistemas para aprofundar conhecimentos em engenharia de software.',
      type: 'work'
    },
    {
      year: '2023',
      title: 'Cursos Alura & Aperfeiçoamento',
      description: 'Foco intenso em cursos de programação, front-end (React, HTML, CSS) e lógica de programação na plataforma Alura, expandindo o leque de habilidades para além da infraestrutura.',
      type: 'education'
    },
    {
      year: '2022',
      title: 'Formação SENAC',
      description: 'Base técnica sólida adquirida no SENAC, com foco em manutenção de computadores, redes e infraestrutura de TI.',
      type: 'education'
    },
    {
      year: 'Início',
      title: 'Descoberta da Tecnologia',
      description: 'O início da paixão por tecnologia, desmontando computadores antigos, configurando redes domésticas e buscando entender como as coisas funcionam por dentro.',
      type: 'education'
    }
  ];

  const defaultQualities = [
    { icon: 'Target', title: 'Analítico', desc: 'Capacidade de analisar problemas complexos e encontrar a causa raiz.' },
    { icon: 'Zap', title: 'Proativo', desc: 'Antecipação de problemas e busca constante por melhorias nos processos.' },
    { icon: 'BookOpen', title: 'Aprendizado Contínuo', desc: 'Paixão por aprender novas tecnologias e metodologias.' },
    { icon: 'Terminal', title: 'Organizado', desc: 'Gestão eficiente de tarefas e documentação detalhada.' },
  ];

  const [hero, setHero] = useState({ title: 'Sobre Pedro Henrique', description: 'De entusiasta de hardware a Analista de Suporte e Desenvolvedor. Minha jornada é movida pela curiosidade e vontade de resolver problemas.' });
  const [timelineData, setTimelineData] = useState<any[]>(defaultTimeline);
  const [qualities, setQualities] = useState<any[]>(defaultQualities);

  useEffect(() => {
    if (content.length > 0) {
      const heroData = content.find(c => c.section_name === 'hero');
      const timelineDataDB = content.find(c => c.section_name === 'timeline');
      const qualitiesDataDB = content.find(c => c.section_name === 'qualities');

      if (heroData?.content_data) setHero(heroData.content_data);
      if (timelineDataDB?.content_data) setTimelineData(timelineDataDB.content_data);
      if (qualitiesDataDB?.content_data) setQualities(qualitiesDataDB.content_data);
    }
  }, [content]);

  const getIcon = (name: string) => {
    switch(name) {
      case 'Target': return <Target className="w-6 h-6 text-blue-500" />;
      case 'Zap': return <Zap className="w-6 h-6 text-blue-500" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-blue-500" />;
      case 'Terminal': return <Terminal className="w-6 h-6 text-blue-500" />;
      default: return <Target className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white pt-20 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-blue-500 p-1">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">{hero.title}</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {hero.description}
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {/* Story Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-500" />
                Minha Trajetória
              </h2>
              <div className="pl-2">
                {timelineData.map((item, index) => (
                  <TimelineItem key={index} {...item} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Skills & Expectations Column */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-500" />
                  Qualidades
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {qualities.map((q, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors">
                      <div className="mb-3">{getIcon(q.icon || 'Target')}</div>
                      <h3 className="font-bold mb-1">{q.title}</h3>
                      <p className="text-sm text-gray-400">{q.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-blue-500" />
                  Expectativas & Interesses
                </h2>
                <div className="p-6 bg-gradient-to-br from-blue-900/20 to-black rounded-2xl border border-blue-500/20">
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Meu objetivo é crescer continuamente na área de tecnologia, unindo meus conhecimentos de 
                    <strong className="text-white"> infraestrutura</strong> e <strong className="text-white"> redes </strong> 
                    com o poder do <strong className="text-white">desenvolvimento de software</strong>.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20 flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> Automação
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20 flex items-center gap-1">
                      <Code className="w-3 h-3" /> Full Stack
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20 flex items-center gap-1">
                      <Network className="w-3 h-3" /> Redes
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
