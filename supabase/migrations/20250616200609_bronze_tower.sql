/*
  # Create protocolos table

  1. New Tables
    - `protocolos`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `descricao` (text)
      - `tipo` (text)
      - `nivel` (text)
      - `duracao_semanas` (integer)
      - `objetivo` (text)
      - `observacoes` (text)
      - `exercicios` (jsonb)
      - `anexos` (text[])
      - `links` (text[])
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `protocolos` table
    - Add policies for ADMIN and COACH access
*/

CREATE TABLE IF NOT EXISTS protocolos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('PRE_DEFINIDO', 'PERSONALIZADO')),
  nivel text NOT NULL CHECK (nivel IN ('INICIANTE', 'INTERMEDIARIO', 'AVANCADO')),
  duracao_semanas integer NOT NULL CHECK (duracao_semanas > 0),
  objetivo text NOT NULL,
  observacoes text,
  exercicios jsonb DEFAULT '[]'::jsonb,
  anexos text[] DEFAULT '{}',
  links text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE protocolos ENABLE ROW LEVEL SECURITY;

-- Policy for ADMIN and COACH to read all protocolos
CREATE POLICY "Admin and Coach can read all protocolos"
  ON protocolos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'COACH')
    )
  );

-- Policy for ADMIN and COACH to insert protocolos
CREATE POLICY "Admin and Coach can insert protocolos"
  ON protocolos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'COACH')
    )
  );

-- Policy for ADMIN and COACH to update protocolos
CREATE POLICY "Admin and Coach can update protocolos"
  ON protocolos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'COACH')
    )
  );

-- Policy for ADMIN and COACH to delete protocolos
CREATE POLICY "Admin and Coach can delete protocolos"
  ON protocolos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'COACH')
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_protocolos_updated_at
  BEFORE UPDATE ON protocolos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_protocolos_tipo ON protocolos(tipo);
CREATE INDEX IF NOT EXISTS idx_protocolos_nivel ON protocolos(nivel);
CREATE INDEX IF NOT EXISTS idx_protocolos_status ON protocolos(status);
CREATE INDEX IF NOT EXISTS idx_protocolos_created_at ON protocolos(created_at);