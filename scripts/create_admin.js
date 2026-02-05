import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carrega variáveis de ambiente do arquivo .env
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (ou VITE_SUPABASE_ANON_KEY) são obrigatórios no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('Erro: ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos no .env')
    process.exit(1)
  }

  console.log(`Tentando criar usuário: ${email}`)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Erro ao criar usuário:', error.message)
  } else {
    console.log('Usuário criado com sucesso:', data.user?.email)
  }
}

createAdmin()
