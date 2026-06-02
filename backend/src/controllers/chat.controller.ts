import { Request, Response, NextFunction } from 'express';
import { requireSupabase } from '../config/supabase';
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
    const { userId, question } = req.body;

    if (userId === undefined || userId === null) {
      return res.status(400).json({ success: false, error: 'userId required' });
    }
    if (typeof userId !== 'number' && typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'userId must be a number or string' });
    }
    if (!question || typeof question !== 'string') {
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

    const answer = await chat(userId, cleanQuestion);

    const supabase = requireSupabase();
    const { error: dbErr } = await supabase
      .from('chat_history')
      .insert({ user_id: userId, question: cleanQuestion, answer });
    if (dbErr) {
      console.error('Failed to save chat history:', dbErr);
    }

    res.json({ success: true, data: { answer } });
  } catch (err) {
    next(err);
  }
}
