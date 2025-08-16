import { describe, it, expect } from 'vitest';

describe('Vite Setup', () => {
  it('should be working correctly', () => {
    expect(true).toBe(true);
  });
  
  it('should have access to DOM globals', () => {
    expect(window).toBeDefined();
    expect(document).toBeDefined();
  });
});
