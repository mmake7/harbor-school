// Day 2+ jsonwebtoken·bcryptjs 설치 후 활성화
// 패턴: today-room/lib/auth.ts + harbor-community/api/auth.js
//   - JWT 7일 만료
//   - bcrypt rounds=10
//   - 비밀번호: 8~100자 + 영문/숫자/특수 중 2종 이상
//   - 세션 revoke 추적: tr_auth_sessions의 token_hash(SHA-256) 비교
//
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

export type JwtPayload = { uid: string; email: string };

export async function hashPassword(_pw: string): Promise<string> {
  throw new Error("Day 2+ bcryptjs 설치 후 활성화");
}

export async function verifyPassword(_pw: string, _hash: string): Promise<boolean> {
  throw new Error("Day 2+ bcryptjs 설치 후 활성화");
}

export function signToken(_payload: JwtPayload): string {
  throw new Error("Day 2+ jsonwebtoken 설치 후 활성화");
}

export function verifyJwt(_token: string): JwtPayload | null {
  throw new Error("Day 2+ jsonwebtoken 설치 후 활성화");
}
