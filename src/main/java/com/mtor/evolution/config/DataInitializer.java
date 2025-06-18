package com.mtor.evolution.config;

import com.mtor.evolution.model.Cliente;
import com.mtor.evolution.model.User;
import com.mtor.evolution.repository.ClienteRepository;
import com.mtor.evolution.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Profile("!prod") // Only run in non-production environments
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if we're using Supabase (production database)
        boolean isSupabase = System.getenv("DATABASE_URL") != null && 
                           System.getenv("DATABASE_URL").contains("supabase");
        
        if (isSupabase) {
            System.out.println("🔗 Using Supabase database - skipping data initialization");
            System.out.println("📋 Default users should be created via Supabase migrations");
            return;
        }

        // Only initialize data if database is empty and not using Supabase
        if (userRepository.count() == 0) {
            createDefaultUsers();
            createDefaultClientes();
        }
    }

    private void createDefaultUsers() {
        try {
            if (!userRepository.existsByEmail("admin@mtor.com")) {
                User admin = new User();
                admin.setName("Administrador");
                admin.setEmail("admin@mtor.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
                System.out.println("✅ Admin user created: admin@mtor.com / admin123");
            }

            if (!userRepository.existsByEmail("coach@mtor.com")) {
                User coach = new User();
                coach.setName("Treinador Principal");
                coach.setEmail("coach@mtor.com");
                coach.setPassword(passwordEncoder.encode("coach123"));
                coach.setRole(User.Role.COACH);
                userRepository.save(coach);
                System.out.println("✅ Coach user created: coach@mtor.com / coach123");
            }

            if (!userRepository.existsByEmail("cliente@mtor.com")) {
                User cliente = new User();
                cliente.setName("Cliente Teste");
                cliente.setEmail("cliente@mtor.com");
                cliente.setPassword(passwordEncoder.encode("cliente123"));
                cliente.setRole(User.Role.CLIENTE);
                userRepository.save(cliente);
                System.out.println("✅ Client user created: cliente@mtor.com / cliente123");
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating default users: " + e.getMessage());
        }
    }

    private void createDefaultClientes() {
        try {
            if (clienteRepository.count() == 0) {
                // Create some sample clients
                Cliente cliente1 = new Cliente();
                cliente1.setNome("João Silva");
                cliente1.setEmail("joao.silva@email.com");
                cliente1.setTelefone("(11) 99999-1111");
                cliente1.setDataNascimento(LocalDate.of(1990, 5, 15));
                cliente1.setGenero(Cliente.Genero.MASCULINO);
                cliente1.setModalidade("Musculação");
                cliente1.setObjetivo("Ganho de massa muscular");
                cliente1.setStatus(Cliente.Status.ATIVO);
                clienteRepository.save(cliente1);

                Cliente cliente2 = new Cliente();
                cliente2.setNome("Maria Santos");
                cliente2.setEmail("maria.santos@email.com");
                cliente2.setTelefone("(11) 99999-2222");
                cliente2.setDataNascimento(LocalDate.of(1985, 8, 22));
                cliente2.setGenero(Cliente.Genero.FEMININO);
                cliente2.setModalidade("Crossfit");
                cliente2.setObjetivo("Perda de peso e condicionamento");
                cliente2.setStatus(Cliente.Status.ATIVO);
                clienteRepository.save(cliente2);

                Cliente cliente3 = new Cliente();
                cliente3.setNome("Pedro Oliveira");
                cliente3.setEmail("pedro.oliveira@email.com");
                cliente3.setTelefone("(11) 99999-3333");
                cliente3.setDataNascimento(LocalDate.of(1992, 12, 10));
                cliente3.setGenero(Cliente.Genero.MASCULINO);
                cliente3.setModalidade("Natação");
                cliente3.setObjetivo("Melhora da resistência cardiovascular");
                cliente3.setStatus(Cliente.Status.ATIVO);
                clienteRepository.save(cliente3);

                System.out.println("✅ Sample clients created");
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating sample clients: " + e.getMessage());
        }
    }
}