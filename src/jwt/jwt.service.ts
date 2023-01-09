import { Injectable } from '@nestjs/common'
import { sign } from 'jsonwebtoken'

@Injectable()
export class JwtService {
  sign(payload: string | object | Buffer, expireIn?: string | number | undefined) {
    return sign(payload, process.env.JWT_SECRET, {
      expiresIn: expireIn ? expireIn : undefined,
      algorithm: 'HS512'
    })
  }
}