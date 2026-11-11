import { describe, it, expect } from 'vitest';
import { CreateAccountDto } from './create-account.dto.js';
import { LoginDto } from './login.dto.js';
import { UserType } from '../enums/user-type.enum.js';

describe('DTOs com Validações Específicas', () => {
  const validCpf = '529.982.247-25';

  describe('CreateAccountDto.create', () => {
    it('deve criar DTO com sucesso para usuário COMMON válido', () => {
      const dto = CreateAccountDto.create({
        name: 'Maria Silva',
        email: 'Maria@Example.com',
        password: 'senhaSegura123',
        cpf: validCpf,
        type: 'COMMON',
      });

      expect(dto).not.toBeNull();
      expect(dto?.name).toBe('Maria Silva');
      expect(dto?.email).toBe('maria@example.com'); // normalizado para minúsculas
      expect(dto?.cpf).toBe('52998224725'); // normalizado para dígitos
      expect(dto?.type).toBe(UserType.COMMON);
      expect(dto?.oab).toBeNull();
    });

    it('deve criar DTO com sucesso para usuário LAWYER com OAB válida', () => {
      const dto = CreateAccountDto.create({
        name: 'Dr. Lucas Santos',
        email: 'lucas@oab.org.br',
        password: 'senhaSegura123',
        cpf: validCpf,
        oab: 'ba 12345',
        type: 'LAWYER',
      });

      expect(dto).not.toBeNull();
      expect(dto?.type).toBe(UserType.LAWYER);
      expect(dto?.oab).toBe('BA12345'); // normalizado
    });

    it('deve retornar null se LAWYER for informado sem OAB ou com OAB inválida', () => {
      const dtoSemOab = CreateAccountDto.create({
        name: 'Dr. Lucas Santos',
        email: 'lucas@oab.org.br',
        password: 'senhaSegura123',
        cpf: validCpf,
        type: 'LAWYER',
      });
      expect(dtoSemOab).toBeNull();

      const dtoOabInvalida = CreateAccountDto.create({
        name: 'Dr. Lucas Santos',
        email: 'lucas@oab.org.br',
        password: 'senhaSegura123',
        cpf: validCpf,
        oab: '12345',
        type: 'LAWYER',
      });
      expect(dtoOabInvalida).toBeNull();
    });

    it('deve retornar null se CPF for inválido', () => {
      const dto = CreateAccountDto.create({
        name: 'Maria Silva',
        email: 'maria@example.com',
        password: 'senhaSegura123',
        cpf: '111.111.111-11',
        type: 'COMMON',
      });

      expect(dto).toBeNull();
    });

    it('deve retornar null se e-mail for inválido', () => {
      const dto = CreateAccountDto.create({
        name: 'Maria Silva',
        email: 'email-invalido',
        password: 'senhaSegura123',
        cpf: validCpf,
        type: 'COMMON',
      });

      expect(dto).toBeNull();
    });

    it('deve retornar null se senha tiver menos de 8 caracteres', () => {
      const dto = CreateAccountDto.create({
        name: 'Maria Silva',
        email: 'maria@example.com',
        password: '12345',
        cpf: validCpf,
        type: 'COMMON',
      });

      expect(dto).toBeNull();
    });

    it('deve retornar null se tipo de usuário for desconhecido', () => {
      const dto = CreateAccountDto.create({
        name: 'Maria Silva',
        email: 'maria@example.com',
        password: 'senhaSegura123',
        cpf: validCpf,
        type: 'ADMIN',
      });

      expect(dto).toBeNull();
    });
  });

  describe('LoginDto.create', () => {
    it('deve criar LoginDto para credenciais válidas', () => {
      const dto = LoginDto.create({
        email: 'Usuario@Dominio.COM',
        password: 'senha123Qualquer',
      });

      expect(dto).not.toBeNull();
      expect(dto?.email).toBe('usuario@dominio.com');
      expect(dto?.password).toBe('senha123Qualquer');
    });

    it('deve retornar null se o e-mail for inválido', () => {
      const dto = LoginDto.create({
        email: 'invalido',
        password: 'senha123Qualquer',
      });

      expect(dto).toBeNull();
    });

    it('deve retornar null se a senha for vazia', () => {
      const dto = LoginDto.create({
        email: 'usuario@dominio.com',
        password: '',
      });

      expect(dto).toBeNull();
    });
  });
});
