import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (ou VITE_SUPABASE_ANON_KEY) são necessárias.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDatabase() {
  console.log('Iniciando população do banco de dados (Seed)...')

  // 1. Criar um Serviço
  const servicesData = [
    {
      title: 'Suporte Técnico',
      description: 'Resolução rápida de problemas de hardware e software.',
      icon_name: 'Wrench',
      display_order: 1
    },
    {
      title: 'Desenvolvimento Web',
      description: 'Sites modernos e responsivos com React.',
      icon_name: 'Code',
      display_order: 2
    }
  ]

  const { data: services, error: servicesError } = await supabase
    .from('services')
    .insert(servicesData)
    .select()

  if (servicesError) {
    console.error('ERRO ao criar serviços:', servicesError)
  } else {
    console.log('Serviços criados:', services.length)
  }

  // 2. Criar um Projeto
  const projectsData = [
    {
      title: 'Portfólio Profissional',
      description: 'Site de portfólio desenvolvido com React e Supabase.',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
      problem: 'Necessidade de apresentar projetos de forma profissional.',
      solution: 'Desenvolvimento de uma plataforma SPA rápida e segura.',
      technologies: 'React, Tailwind, Supabase',
      result: 'Aumento na visibilidade profissional.',
      learnings: 'Integração completa de CMS headless.',
      display_order: 1
    }
  ]

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .insert(projectsData)
    .select()

  if (projectsError) {
    console.error('ERRO ao criar projetos:', projectsError)
  } else {
    console.log('Projetos criados:', projects.length)
  }
}

seedDatabase()
