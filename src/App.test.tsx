import { render, screen } from '@testing-library/react';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import * as React from 'react';
import App from './App';

describe('<App>', () => {
  beforeEach(() => {
    chai.use(chaiDom);
  });

  it('renders hello', () => {
    render(<App />);
    expect(document.body).contain(
      screen.getByRole('heading', { name: /hello/i }),
    );
  });
});
