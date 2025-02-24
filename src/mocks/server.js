import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// PUBLIC_INTERFACE
export const server = setupServer(...handlers);