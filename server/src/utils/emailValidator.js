const dns = require('node:dns').promises;

// Known disposable, temporary, and burner email provider domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'tempmail.net',
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'pokemail.net',
  'spam4.me',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'yopmail.com',
  'yopmail.net',
  'yopmail.fr',
  'throwawaymail.com',
  'dispostable.com',
  'fakemailgenerator.com',
  'getairmail.com',
  'inboxkitten.com',
  'burnermail.io',
  'crazymailing.com',
  'dropmail.me',
  'mohmal.com',
  'mytemp.email',
  'nada.ltd',
  'getnada.com',
  'emailondeck.com',
  'tempail.com',
  'disposablemail.com',
  'generator.email'
]);

// Keyboard walks and common keyboard smashing sequences
const KEYBOARD_WALKS = [
  'qwerty',
  'asdfgh',
  'zxcvbn',
  'qazwsx',
  'wsxedc',
  'edcrfv',
  'rfvtgb',
  '123456',
  '654321',
  'abcdef',
  'fedcba',
  'poiuyt',
  'lkjhgf',
  'mnbvcx'
];

/**
 * Detects whether a string is random keyboard smashing or gibberish.
 * 
 * @param {string} str 
 * @returns {string|null} Reason if gibberish, null if acceptable
 */
function checkGibberish(str) {
  const s = str.toLowerCase();

  // 1. Repeating characters (e.g. aaaaa, 11111)
  if (/(.)\1{3,}/.test(s)) {
    return 'contains excessive repeating characters';
  }

  // 2. Contains known keyboard walks (e.g. qwerty, asdfgh, zxcvbn)
  for (const walk of KEYBOARD_WALKS) {
    if (s.includes(walk)) {
      return `contains keyboard sequence pattern '${walk}'`;
    }
  }

  // 3. Home-row mashing (e.g. afdsf, sffsd, asdf, sdfsd, asdfg)
  // Check if string of length >= 4 is exclusively home-row keys with restricted character diversity
  if (s.length >= 4 && /^[asdfghjkl]+$/.test(s)) {
    const uniqueKeys = new Set(s);
    if (uniqueKeys.size <= 5) {
      return 'appears to be home-row keyboard smashing';
    }
  }

  // 4. Top-row or bottom-row mashing
  if (s.length >= 4) {
    if (/^[qwertyuiop]+$/.test(s) && new Set(s).size <= 5) {
      return 'appears to be top-row keyboard smashing';
    }
    if (/^[zxcvbnm]+$/.test(s) && new Set(s).size <= 5) {
      return 'appears to be bottom-row keyboard smashing';
    }
  }

  // 5. Excessive consecutive consonants (4 or more without a vowel)
  // Allow common legitimate consonant clusters like 'schm' or 'ngth'
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(s)) {
    if (!/sch|ngth|phr/i.test(s)) {
      return 'contains an unpronounceable consonant cluster';
    }
  }

  // 6. Zero vowels in string of length >= 4
  if (s.length >= 4 && !/[aeiouy]/i.test(s)) {
    return 'contains no vowels';
  }

  return null;
}

/**
 * Validates the syntactic and structural authenticity of an email address.
 * 
 * @param {string} email
 * @returns {{ isValid: boolean, reason?: string }}
 */
function validateEmailStructure(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, reason: 'Email is required.' };
  }

  const trimmed = email.trim().toLowerCase();

  // 1. Overall Length check
  if (trimmed.length < 5 || trimmed.length > 254) {
    return { isValid: false, reason: 'Email length must be between 5 and 254 characters.' };
  }

  // 2. Strict RFC 5322 + TLD regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, reason: 'Invalid email address format or missing valid top-level domain.' };
  }

  const [localPart, domainPart] = trimmed.split('@');

  // Disallow consecutive dots or leading/trailing dots in local part
  if (localPart.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, reason: 'Email username cannot start, end, or contain consecutive dots.' };
  }

  if (localPart.length < 2) {
    return { isValid: false, reason: 'Email username is too short (minimum 2 characters).' };
  }

  // 3. Disposable Domain Blocklist Check
  if (DISPOSABLE_EMAIL_DOMAINS.has(domainPart)) {
    return { isValid: false, reason: 'Disposable or temporary email addresses are not permitted.' };
  }

  // 4. Gibberish check on local username part (e.g. afdsf, sffsd, asdfgh)
  const localGibberish = checkGibberish(localPart);
  if (localGibberish) {
    return { isValid: false, reason: `Email username ${localGibberish}. Please use a real email address.` };
  }

  // 5. Domain validation & gibberish check on domain labels
  const domainSegments = domainPart.split('.');
  const tld = domainSegments[domainSegments.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { isValid: false, reason: 'Email domain has an invalid top-level domain.' };
  }

  // Check the main domain label (e.g. 'sffsd' in 'sffsd.com')
  const mainDomain = domainSegments[0];
  const domainGibberish = checkGibberish(mainDomain);
  if (domainGibberish) {
    return { isValid: false, reason: `Email domain '${mainDomain}' ${domainGibberish}.` };
  }

  return { isValid: true };
}

/**
 * Checks if the email domain possesses valid DNS MX (Mail Exchange) records.
 * Notice: We specifically REQUIRE MX records. We do NOT fall back to A records,
 * because parked ad domains often have an A record but NO email server.
 * 
 * @param {string} email
 * @returns {Promise<{ isValid: boolean, reason?: string }>}
 */
async function verifyDomainDns(email) {
  // Always skip DNS resolution during automated tests or if offline mode is set
  if (process.env.NODE_ENV === 'test' || process.env.SKIP_DNS_CHECK === 'true') {
    return { isValid: true };
  }

  const domain = email.split('@')[1];
  if (!domain) return { isValid: false, reason: 'Invalid domain.' };

  // Allow standard local test domains
  if (['example.com', 'localhost', 'test.com'].includes(domain)) {
    return { isValid: true };
  }

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { 
        isValid: false, 
        reason: `The email domain '@${domain}' does not have an active mail server (no MX records found) and cannot receive email.` 
      };
    }
    return { isValid: true };
  } catch (err) {
    return { 
      isValid: false, 
      reason: `The email domain '@${domain}' does not exist or has no active mail server (MX lookup failed).` 
    };
  }
}

module.exports = {
  validateEmailStructure,
  verifyDomainDns,
  checkGibberish,
  DISPOSABLE_EMAIL_DOMAINS
};
