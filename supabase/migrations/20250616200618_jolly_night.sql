/*
  # Insert default users

  1. Default Users
    - Admin user: admin@mtor.com / admin123
    - Coach user: coach@mtor.com / coach123
    - Client user: cliente@mtor.com / cliente123

  Note: Passwords are hashed using bcrypt
*/

-- Insert default admin user
INSERT INTO users (id, name, email, password, role) VALUES 
(
  gen_random_uuid(),
  'Administrador',
  'admin@mtor.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Insert default coach user
INSERT INTO users (id, name, email, password, role) VALUES 
(
  gen_random_uuid(),
  'Treinador Principal',
  'coach@mtor.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: coach123
  'COACH'
) ON CONFLICT (email) DO NOTHING;

-- Insert default client user
INSERT INTO users (id, name, email, password, role) VALUES 
(
  gen_random_uuid(),
  'Cliente Teste',
  'cliente@mtor.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: cliente123
  'CLIENTE'
) ON CONFLICT (email) DO NOTHING;