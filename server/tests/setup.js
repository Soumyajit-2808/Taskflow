process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_123456789_abcdef';
process.env.BCRYPT_SALT_ROUNDS = '4'; // Faster salt rounds for unit tests
process.env.PORT = '5001';

// Suppress normal operational error logs during test runs
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

