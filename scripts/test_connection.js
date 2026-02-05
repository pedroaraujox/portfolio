import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente faltando.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testando conexão com Supabase...')
  try {
    const { data, error } = await supabase.from('projects').select('*').limit(1)
    
    if (error) {
      console.error('ERRO Supabase:', error)
    } else {
      console.log('SUCESSO! Dados recebidos:', data)
    }
  } catch (err) {
    console.error('ERRO DE REDE/CÓDIGO:', err)
  }
}

testConnection()
