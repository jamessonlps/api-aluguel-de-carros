import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect!', 401);
    }
    
    const passwordMatch = await compare(password, user.password);
    
    if (!passwordMatch) {
      throw new AppError('Email or password incorrect!', 401);
    }

    const token = sign({}, 'e1a97faeeefa228b70559fefdfe3b914', {
      subject: user.id,
      expiresIn: '1d'
    });

    return { 
      user: { 
        name: user.name, 
        email: user.email 
      },
      token 
    };
  }
}

export { AuthenticateUserUseCase }