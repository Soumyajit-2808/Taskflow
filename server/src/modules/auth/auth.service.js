const bcrypt = require('bcrypt');
const authRepository = require('./auth.repository');
const { signToken } = require('../../utils/jwt');
const { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } = require('../../utils/errors');
const { validateEmailStructure, verifyDomainDns } = require('../../utils/emailValidator');
const env = require('../../config/env');

class AuthService {
  constructor(repo = authRepository) {
    this.repo = repo;
  }

  async register({ email, password, fullName, avatarUrl }) {
    // 1. Validate structure and gibberish heuristics
    const structResult = validateEmailStructure(email);
    if (!structResult.isValid) {
      throw new BadRequestError(structResult.reason || 'Invalid email address.');
    }

    // 2. Verify domain has active mail exchange (MX) DNS records
    const dnsResult = await verifyDomainDns(email);
    if (!dnsResult.isValid) {
      throw new BadRequestError(dnsResult.reason || 'The provided email domain is not valid or cannot receive mail.');
    }

    // 3. Check if user already exists
    const existingUser = await this.repo.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('A user with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
    const user = await this.repo.createUser({
      email,
      passwordHash,
      fullName,
      avatarUrl
    });

    const token = signToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at
      },
      token
    };
  }

  async login({ email, password }) {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = signToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at
      },
      token
    };
  }

  async getMe(userId) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
}

module.exports = new AuthService();

