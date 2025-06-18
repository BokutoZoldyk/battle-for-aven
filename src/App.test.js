// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Battle for Aven title on the home screen', () => {
  render(<App />);
  const title = screen.getByText(/battle for aven/i);
  expect(title).toBeInTheDocument();
});

test('shows menu options', () => {
  render(<App />);
  expect(screen.getByText(/single player/i)).toBeInTheDocument();
  expect(screen.getByText(/multiplayer/i)).toBeInTheDocument();
  expect(screen.getByText(/rules/i)).toBeInTheDocument();
});
