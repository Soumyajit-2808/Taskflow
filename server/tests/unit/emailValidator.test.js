const { validateEmailStructure, verifyDomainDns } = require('../../src/utils/emailValidator');

describe('Email Validator (Unit)', () => {
  describe('Valid Emails', () => {
    const validEmails = [
      'developer@example.com',
      'jane.doe@company.org',
      'user_123@gmail.com',
      'alex@startup.io',
      'contact@agency.co.uk',
      'first.last+tag@sub.domain.dev'
    ];

    validEmails.forEach((email) => {
      it(`should accept valid email: ${email}`, () => {
        const result = validateEmailStructure(email);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Disposable & Burner Emails', () => {
    const disposableEmails = [
      'user@mailinator.com',
      'test@tempmail.com',
      'tester@10minutemail.com',
      'scam@guerrillamail.com',
      'bot@yopmail.com',
      'anon@sharklasers.com',
      'burner@throwawaymail.com'
    ];

    disposableEmails.forEach((email) => {
      it(`should reject disposable burner email: ${email}`, () => {
        const result = validateEmailStructure(email);
        expect(result.isValid).toBe(false);
        expect(result.reason).toMatch(/disposable|temporary/i);
      });
    });
  });

  describe('Gibberish & Keyboard Smashing', () => {
    it('should reject keyboard walk sequences (e.g. asdfgh, qwerty)', () => {
      expect(validateEmailStructure('asdfgh@gmail.com').isValid).toBe(false);
      expect(validateEmailStructure('qwerty1234@yahoo.com').isValid).toBe(false);
    });

    it('should reject repeated characters (e.g. aaaaaa@, 111111@)', () => {
      expect(validateEmailStructure('aaaaaaa@gmail.com').isValid).toBe(false);
      expect(validateEmailStructure('1111111@outlook.com').isValid).toBe(false);
    });

    it('should reject excessive consecutive consonants (e.g. qwrtypsdf@)', () => {
      expect(validateEmailStructure('bcdfghjkl@gmail.com').isValid).toBe(false);
    });
  });

  describe('Malformed Syntax & Invalid TLDs', () => {
    it('should reject missing @ or missing TLD', () => {
      expect(validateEmailStructure('not-an-email').isValid).toBe(false);
      expect(validateEmailStructure('user@domain').isValid).toBe(false);
    });

    it('should reject numeric or single-letter TLDs', () => {
      expect(validateEmailStructure('user@domain.123').isValid).toBe(false);
      expect(validateEmailStructure('user@domain.x').isValid).toBe(false);
    });

    it('should reject consecutive dots in username', () => {
      expect(validateEmailStructure('user..name@gmail.com').isValid).toBe(false);
      expect(validateEmailStructure('.username@gmail.com').isValid).toBe(false);
    });

    it('should reject single-character usernames', () => {
      expect(validateEmailStructure('a@gmail.com').isValid).toBe(false);
    });
  });

  describe('verifyDomainDns in test mode', () => {
    it('should bypass DNS check in test mode', async () => {
      const result = await verifyDomainDns('anything@nonexistent-domain-xyz.com');
      expect(result.isValid).toBe(true);
    });
  });
});

