import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class LoginSessionDtoBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class RegisterSessionDtoBody {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @Length(5, 100)
  password: string
}