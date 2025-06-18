package com.mtor.evolution.dto;

import com.mtor.evolution.model.Cliente;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ClienteDto {

    private String id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter um formato válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    private String email;

    @NotBlank(message = "Telefone é obrigatório")
    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    private String telefone;

    @NotNull(message = "Data de nascimento é obrigatória")
    private LocalDate dataNascimento;

    @NotNull(message = "Gênero é obrigatório")
    private Cliente.Genero genero;

    @NotBlank(message = "Modalidade é obrigatória")
    @Size(max = 100, message = "Modalidade deve ter no máximo 100 caracteres")
    private String modalidade;

    @NotBlank(message = "Objetivo é obrigatório")
    @Size(max = 255, message = "Objetivo deve ter no máximo 255 caracteres")
    private String objetivo;

    private Cliente.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public ClienteDto() {}

    public ClienteDto(Cliente cliente) {
        this.id = cliente.getId().toString();
        this.nome = cliente.getNome();
        this.email = cliente.getEmail();
        this.telefone = cliente.getTelefone();
        this.dataNascimento = cliente.getDataNascimento();
        this.genero = cliente.getGenero();
        this.modalidade = cliente.getModalidade();
        this.objetivo = cliente.getObjetivo();
        this.status = cliente.getStatus();
        this.createdAt = cliente.getCreatedAt();
        this.updatedAt = cliente.getUpdatedAt();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public Cliente.Genero getGenero() { return genero; }
    public void setGenero(Cliente.Genero genero) { this.genero = genero; }

    public String getModalidade() { return modalidade; }
    public void setModalidade(String modalidade) { this.modalidade = modalidade; }

    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }

    public Cliente.Status getStatus() { return status; }
    public void setStatus(Cliente.Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "ClienteDto{" +
                "id='" + id + '\'' +
                ", nome='" + nome + '\'' +
                ", email='" + email + '\'' +
                ", modalidade='" + modalidade + '\'' +
                ", status=" + status +
                '}';
    }
}