import { describe, it, expect } from 'vitest';
import {
  isValidName,
  isValidEmail,
  isValidPassword,
  isValidCpf,
  normalizeCpf,
  isValidOab,
  normalizeOab,
} from './validators.js';

describe('Validators', () => {
  describe('isValidName', () => {
    it('deve aceitar nomes válidos', () => {
      expect(isValidName('Maria Silva')).toBe(true);
      expect(isValidName('José')).toBe(true);
      expect(isValidName('   Beatriz Santos   ')).toBe(true);
    });

    it('deve rejeitar nomes inválidos', () => {
      expect(isValidName('')).toBe(false);
      expect(isValidName('   ')).toBe(false);
      expect(isValidName('A')).toBe(false);
      expect(isValidName(null)).toBe(false);
      expect(isValidName(undefined)).toBe(false);
      expect(isValidName(123)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('deve aceitar e-mails em formato válido', () => {
      expect(isValidEmail('usuario@dominio.com')).toBe(true);
      expect(isValidEmail('nome.sobrenome+alias@empresa.com.br')).toBe(true);
      expect(isValidEmail('   teste@email.org   ')).toBe(true);
    });

    it('deve rejeitar e-mails inválidos', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalido')).toBe(false);
      expect(isValidEmail('usuario@')).toBe(false);
      expect(isValidEmail('@dominio.com')).toBe(false);
      expect(isValidEmail('usuario@dominio')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('deve aceitar senhas com 8 ou mais caracteres', () => {
      expect(isValidPassword('12345678')).toBe(true);
      expect(isValidPassword('senhaSuperSegura123!')).toBe(true);
    });

    it('deve rejeitar senhas com menos de 8 caracteres ou tipos incorretos', () => {
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword('1234567')).toBe(false);
      expect(isValidPassword(null)).toBe(false);
      expect(isValidPassword(undefined)).toBe(false);
      expect(isValidPassword(12345678)).toBe(false);
    });
  });

  describe('isValidCpf e normalizeCpf', () => {
    // CPFs válidos para teste
    const validCpfFormatado = '529.982.247-25';
    const validCpfNumerico = '52998224725';

    it('deve validar CPF com e sem pontuação', () => {
      expect(isValidCpf(validCpfFormatado)).toBe(true);
      expect(isValidCpf(validCpfNumerico)).toBe(true);
    });

    it('deve normalizar o CPF removendo pontos e traços', () => {
      expect(normalizeCpf(validCpfFormatado)).toBe('52998224725');
    });

    it('deve rejeitar CPFs com dígitos repetidos conhecidos', () => {
      expect(isValidCpf('111.111.111-11')).toBe(false);
      expect(isValidCpf('00000000000')).toBe(false);
      expect(isValidCpf('999.999.999-99')).toBe(false);
    });

    it('deve rejeitar CPFs com dígitos verificadores inválidos ou tamanho incorreto', () => {
      expect(isValidCpf('123.456.789-00')).toBe(false);
      expect(isValidCpf('1234567890')).toBe(false);
      expect(isValidCpf('123456789012')).toBe(false);
      expect(isValidCpf('abc')).toBe(false);
      expect(isValidCpf(null)).toBe(false);
      expect(isValidCpf(undefined)).toBe(false);
    });
  });

  describe('isValidOab e normalizeOab', () => {
    it('deve aceitar formatos válidos de OAB', () => {
      expect(isValidOab('BA12345')).toBe(true);
      expect(isValidOab('SP-123456')).toBe(true);
      expect(isValidOab('12345/RJ')).toBe(true);
      expect(isValidOab('mg 9999')).toBe(true);
    });

    it('deve rejeitar OABs inválidas', () => {
      expect(isValidOab('')).toBe(false);
      expect(isValidOab('12345')).toBe(false);
      expect(isValidOab('XX12345')).toBe(false); // XX não é estado brasileiro
      expect(isValidOab('BA')).toBe(false);
      expect(isValidOab(null)).toBe(false);
      expect(isValidOab(undefined)).toBe(false);
    });

    it('deve normalizar o formato da OAB para UF+Número em maiúsculas', () => {
      expect(normalizeOab('ba 12345')).toBe('BA12345');
      expect(normalizeOab('12345/sp')).toBe('SP12345');
      expect(normalizeOab('RJ-987654')).toBe('RJ987654');
    });
  });
});
