import { Request, Response, NextFunction } from 'express';
import { getFirestore } from '../config/firebase';
import { chat } from '../services/ai/typhoon.service';

const MAX_QUESTION_LENGTH = 1000;
const MIN_QUESTION_LENGTH = 1;

function sanitize(input: string): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export async function chatHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { question } = req.body;

    if (!req.userId) {
      console.warn('[chat.controller] no userId in request');
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const userId = req.userId;
    if (!question || typeof question !== 'string') {
      console.warn(`[chat.controller] invalid question body="${JSON.stringify(req.body)}"`);
      return res.status(400).json({ success: false, error: 'question required' });
    }

    const cleanQuestion = sanitize(question);

    if (cleanQuestion.length < MIN_QUESTION_LENGTH) {
      return res.status(400).json({ success: false, error: 'question cannot be empty' });
    }
    if (cleanQuestion.length > MAX_QUESTION_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `question exceeds maximum length of ${MAX_QUESTION_LENGTH} characters`,
      });
    }

    console.log(`[chat.controller] chat userId=${userId} question="${cleanQuestion.slice(0, 80)}..."`);
    const answer = await chat(userId, cleanQuestion);
    console.log(`[chat.controller] chat success userId=${userId} answerLength=${answer.length}`);

    try {
      const db = getFirestore();
      await db.collection('chatHistory').add({
        user_id: userId,
        question: cleanQuestion,
        answer,
        created_at: new Date().toISOString(),
      });
      console.log('[chat.controller] chat history saved to Firestore');
    } catch (dbErr) {
      console.error('[chat.controller] Failed to save chat history:', dbErr);
    }

    res.json({ success: true, data: { answer } });
  } catch (err) {
    console.error(`[chat.controller] chat error:`, (err as Error).message);
    next(err);
  }
}
