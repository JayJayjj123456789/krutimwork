import { describe, it, expect } from 'vitest'
import { sanitizeForPrompt } from '../src/utils/sanitize'

describe('sanitizeForPrompt', () => {
  it('strips HTML tags', () => {
    expect(sanitizeForPrompt('<script>alert("xss")</script>hello')).toBe('alert("xss")hello')
  })

  it('strips control characters', () => {
    expect(sanitizeForPrompt('hello\x00world')).toBe('helloworld')
  })

  it('strips code blocks', () => {
    expect(sanitizeForPrompt('```code```')).toBe('code')
  })

  it('strips system/assistant prefixes', () => {
    expect(sanitizeForPrompt('system: do something')).toBe('do something')
    expect(sanitizeForPrompt('assistant: reply')).toBe('reply')
  })

  it('trims whitespace', () => {
    expect(sanitizeForPrompt('  hello  ')).toBe('hello')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeForPrompt(undefined as any)).toBe('')
    expect(sanitizeForPrompt(null as any)).toBe('')
  })

  it('caps at 2000 characters', () => {
    const long = 'a'.repeat(3000)
    expect(sanitizeForPrompt(long).length).toBe(2000)
  })
})
