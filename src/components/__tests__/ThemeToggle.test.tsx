import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

describe('ThemeToggle', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    // Reset localStorage mock before each test
    localStorage.clear();
    mockOnToggle.mockClear();
  });

  it('renders theme toggle button', () => {
    render(<ThemeToggle theme="light" onToggle={mockOnToggle} />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    render(<ThemeToggle theme="light" onToggle={mockOnToggle} />);
    const toggleButton = screen.getByRole('button');
    
    // Click the button
    fireEvent.click(toggleButton);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('displays correct icon based on theme', () => {
    const { rerender } = render(<ThemeToggle theme="light" onToggle={mockOnToggle} />);
    
    // Light theme should show moon icon
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
    
    // Dark theme should show sun icon
    rerender(<ThemeToggle theme="dark" onToggle={mockOnToggle} />);
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });
});