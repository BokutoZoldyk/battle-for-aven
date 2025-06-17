// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Battle for Aven title on the home screen', () => {
  render(<App />);
  const title = screen.getByText(/battle for aven/i);
  expect(title).toBeInTheDocument();
});

test('has PLAY buttons for 4, 5, and 6 players', () => {
  render(<App />);
  expect(screen.getByText(/4 player 10×10/i)).toBeInTheDocument();
  expect(screen.getByText(/5 player 12×12/i)).toBeInTheDocument();
  expect(screen.getByText(/6 player 14×14/i)).toBeInTheDocument();
});
