import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zcrkgsozqtiglfiforzp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjcmtnc296cXRpZ2xmaWZvcnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODM3NjYsImV4cCI6MjA4NTY1OTc2Nn0.NFX8l5crl1-fwdb_L6pCrVu9Czby1rKwiM4yXtVxzv0'
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
