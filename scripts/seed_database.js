import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zcrkgsozqtiglfiforzp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjcmtnc296cXRpZ2xmaWZvcnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODM3NjYsImV4cCI6MjA4NTY1OTc2Nn0.NFX8l5crl1-fwdb_L6pCrVu9Czby1rKwiM4yXtVxzv0'
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
