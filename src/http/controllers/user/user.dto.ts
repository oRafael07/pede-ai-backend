import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class FindByIdUserDto {
  @IsNotEmpty()
  @Length(5)
  userId: string
}

export class UpdateUserBodyDto {
  @IsString()
  @Length(5, 100)
  @IsOptional()
  name: string

  @IsEmail()
  @IsOptional()
  email: string
}

export class UpdateUserParamDto {
  @IsNotEmpty()
  @IsString()
  @Length(5)
  userId: string
}