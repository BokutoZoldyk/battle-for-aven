import React from 'react';
import { render, screen } from '@testing-library/react';
import FactionSelect from '../FactionSelect';

test('shows all factions regardless of player count', () => {
  render(<FactionSelect players={2} onBack={() => {}} onSelect={() => {}} />);
  expect(screen.getByText('The Amethyst Enclave')).toBeInTheDocument();
  expect(screen.getByText('The Farheed Commonwealth')).toBeInTheDocument();
  // 6 faction buttons + back button
  const buttons = screen.getAllByRole('button');
  expect(buttons).toHaveLength(7);
});
