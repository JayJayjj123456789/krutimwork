import { Request, Response, NextFunction } from 'express';
import { requireSupabase } from '../config/supabase';
import { chat } from '../services/ai/typhoon.service';

export async function chatHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, question } = req.body;
    if (!userId || !question) {
      return res.status(400).json({ success: false, error: 'userId and question required' });
    }

    const answer = await chat(userId, question);

    const supabase = requireSupabase();
    await supabase.from('chat_history').insert({ user_id: userId, question, answer });

    res.json({ success: true, data: { answer } });
  } catch (err) {
    next(err);
  }
}
