import { rest } from 'msw';
import { API_BASE_URL } from '../config/api.config';

// PUBLIC_INTERFACE
export const handlers = [
  // Get all products
  rest.get(`${API_BASE_URL}/products`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: 'Test Product 1',
          description: 'Test Description 1',
          price: 99.99,
          category: 'Test Category',
          image: 'test-image-1.jpg'
        },
        {
          id: 2,
          name: 'Test Product 2',
          description: 'Test Description 2',
          price: 149.99,
          category: 'Test Category',
          image: 'test-image-2.jpg'
        }
      ])
    );
  }),

  // Get single product
  rest.get(`${API_BASE_URL}/products/:id`, (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        name: `Test Product ${id}`,
        description: `Test Description ${id}`,
        price: 99.99,
        category: 'Test Category',
        image: `test-image-${id}.jpg`
      })
    );
  })
];