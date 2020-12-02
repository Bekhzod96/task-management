import {
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
describe('User Repository', () => {
  let userRepository;
  const mockCredentions = { username: 'Test', password: 'password' };
  beforeEach(async () => {
    const mudule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await mudule.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('signup', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });
    it('successfullt signup user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentions)).resolves.not.toThrow();
    });

    it('throws a confilic exception as username already exists ', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentions)).resolves;
    });
    it('throws a confilic exception as username already exists ', () => {
      save.mockRejectedValue({ code: '122325' });
      expect(userRepository.signUp(mockCredentions)).resolves;
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'TestUsername';
      user.validatePassword = jest.fn();
    });
    it('returns the username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);
      const result = await userRepository.validateUserPassword(mockCredentions);
      expect(result).toEqual('TestUsername');
    });

    it('returns null as usr cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockCredentions);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null as in password invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);
      const result = await userRepository.validateUserPassword(mockCredentions);
      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await userRepository.hashPassword(
        'testPassword',
        'testSalt',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).toEqual('testHash');
    });
  });
});
