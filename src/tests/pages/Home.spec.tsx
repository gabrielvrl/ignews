import { render, screen } from '@testing-library/react';
import Home from '../../pages';

jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
});

jest.mock('next/router');

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{
      priceId: 'fake-price-id',
      amount: 'R$10,00'
    }} />);

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
  });
});