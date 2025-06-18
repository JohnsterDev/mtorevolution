/*
  # Create clientes table

  1. New Tables
    - `clientes`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `email` (text, unique)
      - `telefone` (text)
      - `data_nascimento` (date)
      - `genero` (text)
      - `modalidade` (text)
      - `objetivo` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `clientes` table
    - Add policies for ADMIN and COACH access
*/

CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  telefone text NOT NULL,
  data_nascimento date NOT NULL,
  genero text NOT NULL CHECK (genero IN ('MASCULINO', 'FEMININO')),
  modalidade text NOT NULL,
  objetivo text NOT NULL,
  status text NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Policy for ADMIN and COACH to read all clientes
CREATE POLICY "Admin and Coach can read all clientes"
  ON clientes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'COACH')
    )
  );

-- Policy for ADMIN and COACH to insert clientes
CREATE POLICY "Admin and Coach can insert clientes"
  ON clientes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'COACH')
    )
  );

-- Policy for ADMIN and COACH to update clientes
CREATE POLICY "Admin and Coach can update clientes"
  ON clientes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'COACH')
    )
  );

-- Policy for ADMIN and COACH to delete clientes
CREATE POLICY "Admin and Coach can delete clientes"
  ON clientes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'COACH')
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_created_at ON clientes(created_at);