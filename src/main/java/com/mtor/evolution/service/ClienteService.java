package com.mtor.evolution.service;

import com.mtor.evolution.dto.ClienteDto;
import com.mtor.evolution.model.Cliente;
import com.mtor.evolution.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Page<ClienteDto> findAll(Pageable pageable, String search) {
        Page<Cliente> clientes;
        
        if (search != null && !search.trim().isEmpty()) {
            clientes = clienteRepository.findBySearchTerm(search.trim(), pageable);
        } else {
            clientes = clienteRepository.findAll(pageable);
        }
        
        return clientes.map(ClienteDto::new);
    }

    public Optional<ClienteDto> findById(Long id) {
        return clienteRepository.findById(id).map(ClienteDto::new);
    }

    public ClienteDto save(ClienteDto clienteDto) {
        Cliente cliente = new Cliente();
        updateClienteFromDto(cliente, clienteDto);
        cliente = clienteRepository.save(cliente);
        return new ClienteDto(cliente);
    }

    public Optional<ClienteDto> update(Long id, ClienteDto clienteDto) {
        return clienteRepository.findById(id).map(cliente -> {
            updateClienteFromDto(cliente, clienteDto);
            cliente = clienteRepository.save(cliente);
            return new ClienteDto(cliente);
        });
    }

    public boolean delete(Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<ClienteDto> updateStatus(Long id, Cliente.Status status) {
        return clienteRepository.findById(id).map(cliente -> {
            cliente.setStatus(status);
            cliente = clienteRepository.save(cliente);
            return new ClienteDto(cliente);
        });
    }

    private void updateClienteFromDto(Cliente cliente, ClienteDto dto) {
        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setDataNascimento(dto.getDataNascimento());
        cliente.setGenero(dto.getGenero());
        cliente.setModalidade(dto.getModalidade());
        cliente.setObjetivo(dto.getObjetivo());
        if (dto.getStatus() != null) {
            cliente.setStatus(dto.getStatus());
        }
    }
}