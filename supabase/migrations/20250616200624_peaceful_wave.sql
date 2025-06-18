/*
  # Insert sample clientes

  1. Sample Data
    - Create sample clients for testing
*/

-- Insert sample clients
INSERT INTO clientes (nome, email, telefone, data_nascimento, genero, modalidade, objetivo, status) VALUES 
(
  'João Silva',
  'joao.silva@email.com',
  '(11) 99999-1111',
  '1990-05-15',
  'MASCULINO',
  'Musculação',
  'Ganho de massa muscular',
  'ATIVO'
),
(
  'Maria Santos',
  'maria.santos@email.com',
  '(11) 99999-2222',
  '1985-08-22',
  'FEMININO',
  'Crossfit',
  'Perda de peso e condicionamento',
  'ATIVO'
),
(
  'Pedro Oliveira',
  'pedro.oliveira@email.com',
  '(11) 99999-3333',
  '1992-12-10',
  'MASCULINO',
  'Natação',
  'Melhora da resistência cardiovascular',
  'ATIVO'
),
(
  'Ana Costa',
  'ana.costa@email.com',
  '(11) 99999-4444',
  '1988-03-18',
  'FEMININO',
  'Pilates',
  'Fortalecimento do core e flexibilidade',
  'ATIVO'
),
(
  'Carlos Mendes',
  'carlos.mendes@email.com',
  '(11) 99999-5555',
  '1995-11-07',
  'MASCULINO',
  'Funcional',
  'Condicionamento geral',
  'ATIVO'
)
ON CONFLICT (email) DO NOTHING;