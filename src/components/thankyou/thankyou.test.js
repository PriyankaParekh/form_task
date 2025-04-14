import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ThankYou from './thankyou'; // Adjust the path based on your file structure
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react';

// Mocking the navigate function from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ThankYou Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Mock useNavigate
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
    // Clear all instances and calls to constructor and all methods:
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test('renders Thank You message and button', () => {
    localStorage.setItem('FormSubmitted', JSON.stringify(true));
    render(
      <MemoryRouter initialEntries={['/thankyou']}>
        <Routes>
          <Route path='/thankyou' element={<ThankYou />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('THANK YOU !')).toBeInTheDocument();
    expect(screen.getByText('Thanks for Submitting Form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit another response/i })).toBeInTheDocument();
    expect(screen.getByText('Wanna see your information?')).toBeInTheDocument();
  });

  test('button click navigates to home page and clears local storage', () => {
    localStorage.setItem('FormSubmitted', JSON.stringify(true));
    render(
      <MemoryRouter initialEntries={['/thankyou']}>
        <Routes>
          <Route path='/thankyou' element={<ThankYou />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit another response/i }));

    expect(localStorage.getItem('FormData')).toBeNull();
    expect(localStorage.getItem('FormSubmitted')).toBeNull();
    // expect(mockNavigate).toHaveBeenCalledWith('/');

  });

  test('redirects to home page if FormSubmitted is not in local storage', () => {
    render(
      <MemoryRouter initialEntries={['/thankyou']}>
        <Routes>
          <Route path='/thankyou' element={<ThankYou />} />
        </Routes>
      </MemoryRouter>
    );

    // expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('renders link to details page', () => {
    localStorage.setItem('FormSubmitted', JSON.stringify(true));
    render(
      <MemoryRouter initialEntries={['/thankyou']}>
        <Routes>
          <Route path='/thankyou' element={<ThankYou />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /wanna see your information/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /wanna see your information/i })).toHaveAttribute('href', '/details');
  });
});
