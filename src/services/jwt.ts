import Jwt from 'jsonwebtoken'
import Errors from 'http-errors'

import app from '../app'
import config from '../configs'
import { IUser } from '../../types/express'
import { MESSAGES } from './i18n/types'
interface IData {
  id: string
  role: string
  email?: string
  mobile?: string
}

enum KEY_TYPES {
  valid = 'valid',
  blocked = 'blocked'
}

const { algorithm, allow_renew, cache_prefix, key, expiration, renew_threshold } = config.jwt

// Creates JWT Token
export function create(data: object | IData | Buffer, expiresIn = expiration): string {
  const secretKey: Jwt.Secret = key
  const options: Jwt.SignOptions = { expiresIn, algorithm }
  const token: string = Jwt.sign(data, secretKey, options)
  // app.get('redis').set(`${cache_prefix}${token}`, KEY_TYPES.valid)
  return token
}

// Creates Non Expire JWT Token (Caching is temporarily disabled)
export function createNonExpire(data: string | IData | Buffer): string {
  const token: string = Jwt.sign(data, key, { algorithm })
  app.get('redis').set(`${cache_prefix}${token}`, KEY_TYPES.valid)
  return token
}

// Decode Given Token from Request Headers ['authorization]
export function decode(token: string) {
  return Jwt.decode(token)
}

// Blocks JWT Token from cache
export function block(token: string | undefined): void {
  if (!token) throw new Error('Token is undefined.')
  const decoded: IUser = Jwt.decode(token) as IUser
  const key = `${cache_prefix}${token}`
  if (decoded?.exp) {
    const expiration: number = decoded.exp - Date.now()
    app.get('redis').multi().set(key, KEY_TYPES.blocked).expire(key, expiration).exec()
  } else {
    app.get('redis').del(key)
  }
}

// Renew JWT Token when is going to be expired
export function renew(token: string | undefined, expire?: number): string {
  if (!token) throw new Error('Token is undefined.')
  if (!allow_renew) throw new Error('Renewing tokens is not allowed.')

  const now: number = Math.floor(Date.now() / 1000)
  const decoded: IUser = Jwt.decode(token) as IUser
  if (!decoded.exp) return token
  if (decoded.exp - now > renew_threshold) return token

  block(token)
  if (decoded.iat) delete decoded.iat
  if (decoded.exp) delete decoded.exp
  return create(decoded, expire || expiration)
}

// Checks the validity of JWT Token
export async function isValid(token: string): Promise<IUser | boolean> {
  try {
    const key = `${cache_prefix}${token}`
    const value: string | null = await app.get('redis').get(key)
    const decoded: IUser = Jwt.decode(token) as IUser

    const now = Math.floor(Date.now() / 1000)
    if (!decoded.exp) return decoded                        // token is non-expired type
    if (decoded.exp < now) return false                     // token is expired
    if (!value || value !== KEY_TYPES.valid) return false   // token is revoked

    return decoded
  } catch (err) {
    console.log(' >>> JWT Token isValid error: ', err)
    throw new Errors.Unauthorized(MESSAGES.INVALID_ACCESS_TOKEN)
  }
}

/**
 * Generate an access token
 * @param    {string}     userId        User Id
 * @param    {string}     role          User Role
 * @param    {string}     email         User Email
 * @param    {string}     mobile        User Mobile
 * @param    {boolean}    rememberMe    if `true` it will generate non-expire token
 * @return   {string}     returns authorization token for header
 */
export function createToken(userId: string, role: string, rememberMe: boolean, email?: string, mobile?: string): string {
  const jwtObject = { id: userId, email, mobile, role, iat: Math.floor(Date.now() / 1000) }
  const accessToken = rememberMe ? createNonExpire(jwtObject) : create(jwtObject)
  return `Bearer ${accessToken}`
}
