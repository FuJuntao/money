import { render, screen } from '@testing-library/react';
import * as React from 'react';
import App from './App';

describe('<App>', () => {
  it('renders hello', () => {
    render(<App />);
    screen.getByRole('heading', { name: /hello/i });
  });
});
