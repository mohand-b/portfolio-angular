// Development environment configuration
// For local development with your backend API

const baseUrl = process.env['API_BASE_URL'] || 'http://localhost:3000';

export const environment = {
  production: false,
  baseUrl,
};
