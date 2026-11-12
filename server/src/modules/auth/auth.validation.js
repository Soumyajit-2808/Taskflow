const { z } = require('zod');
const { validateEmailStructure } = require('../../utils/emailValidator');

const emailField = z
  .string({ required_error: 'Email is required' })
  .max(255, 'Email cannot exceed 255 characters')
  .toLowerCase()
  .trim()
  .superRefine((val, ctx) => {
    const result = validateEmailStructure(val);
    if (!result.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.reason || 'Invalid email address'
      });
    }
  });

const registerSchema = {
  body: z.object({
    email: emailField,
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password cannot exceed 100 characters')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Password must contain at least one letter and one number'
      ),
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters')
      .trim(),
    avatarUrl: z.string().url('Invalid avatar URL').optional().nullable()
  })
};

const loginSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty')
  })
};

module.exports = {
  registerSchema,
  loginSchema
};

