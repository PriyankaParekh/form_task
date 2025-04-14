import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
 
// Mocking the ToastContainer from react-toastify
jest.mock('react-toastify', () => ({
  ToastContainer: jest.fn(() => <div>Mocked ToastContainer</div>),
}));
 
// Mocking the App component
jest.mock('./App', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked App</div>),
}));
 
describe('Root Application', () => {
  it('renders the ToastContainer and App components', async () => {
    const div = document.createElement('div');
    div.setAttribute('id', 'root');
    document.body.appendChild(div);
 
    // Using act to wrap the require call
    await act(async () => {
      require('./index'); // Adjust this path if needed
    });
 
    expect(screen.getByText('Mocked ToastContainer')).toBeInTheDocument();
    expect(screen.getByText('Mocked App')).toBeInTheDocument();
  });
});