import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zcrkgsozqtiglfiforzp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjcmtnc296cXRpZ2xmaWZvcnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODM3NjYsImV4cCI6MjA4NTY1OTc2Nn0.NFX8l5crl1-fwdb_L6pCrVu9Czby1rKwiM4yXtVxzv0'
const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  const email = 'admin@portfolio.com'
  const password = '#web56st#'

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
