import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('User authentication', () => {

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('Should be able to authenticate an existing user', async() => {
    const user: ICreateUserDTO = {
      driver_license: 'asdf53243',
      email: 'email@test.com',
      name: 'New user',
      password: '123456',
    };

    await createUserUseCase.execute(user);

    const authResult = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(authResult).toHaveProperty('token');
  });
  
  it('Should not be able to authenticate an non existing user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@email.com',
        password: '123456'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  
  it('Should not be able to authenticate an user with wrong password', async() => {
    expect(async() => {
      const user: ICreateUserDTO = {
        driver_license: 'asdf53243',
        email: 'email@test.com',
        name: 'New user',
        password: '123456',
      };
  
      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: '123456789'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  
})