import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { getAuth } from '../config/firebase';

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyC3sPjZsLXf9gNiWSVzdAkZ4aaWoFl2r4E';
const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts`;

export async function signupHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email and password required' });
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, error: 'email and password must be strings' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'password must be at least 6 characters' });
    }

    const userRecord = await getAuth().createUser({ email, password });
    const userId = userRecord.uid;

    const tokenResp = await axios.post(`${FIREBASE_AUTH_URL}:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    });

    const idToken = tokenResp.data.idToken;

    console.log(`[auth.controller] signup success email=${email} userId=${userId}`);
    res.status(201).json({
      success: true,
      data: { userId, email, token: idToken },
    });
  } catch (err: any) {
    const message = err?.errorInfo?.message || err?.response?.data?.error?.message || (err as Error).message;
    console.error('[auth.controller] signup error:', message);
    res.status(400).json({ success: false, error: message });
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email and password required' });
    }

    const tokenResp = await axios.post(`${FIREBASE_AUTH_URL}:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    });

    const { idToken, localId, email: respEmail } = tokenResp.data;
    const userId = localId;
    console.log(`[auth.controller] login success email=${email} userId=${userId}`);

    res.json({
      success: true,
      data: { userId, email: respEmail || email, token: idToken },
    });
  } catch (err: any) {
    const message = err?.response?.data?.error?.message || (err as Error).message;
    console.error('[auth.controller] login error:', message);
    res.status(401).json({ success: false, error: message });
  }
}
