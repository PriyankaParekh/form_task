import React from 'react';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Details from './details';
import '@testing-library/jest-dom/extend-expect';


const mockFormData = {
  formData: {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
  },
};

const mockObj = {
  steps: [
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ],
  fields: {
    0: [
      { label: 'Name', name: 'name' },
    ],
    1: [
      { label: 'Age', name: 'age' },
    ],
    2: [
      { label: 'Email', name: 'email' },
    ],
  },
};

beforeEach(() => {
  localStorage.setItem('FormData', JSON.stringify(mockFormData));
  localStorage.setItem('FormSubmitted', 'true');
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('Details component', () => {
  test('renders form data correctly', () => {
    render(
      <Router>
        <Details obj={mockObj} />
      </Router>
    );

    expect(screen.getByText('YOUR INFORMATION')).toBeInTheDocument();
    expect(screen.getByText(`Step 1: Personal Information`)).toBeInTheDocument();
    expect(screen.getByText('Step 2: Additional Information')).toBeInTheDocument();
    expect(screen.getByText('Step 3: Preferences')).toBeInTheDocument();
  });

  test('renders "No form data available" message when no form data is present', () => {
    localStorage.removeItem('FormData');

    const { getByText } = render(
      <Router>
        <Details obj={mockObj} />
      </Router>
    );

    expect(getByText('No form data available.')).toBeInTheDocument();
  });

  test('navigates to the root path when "Submit Another Response?" button is clicked', () => {
    const { getByText } = render(
      <Router>
        <Details obj={mockObj} />
      </Router>
    );

    const submitAnotherResponseButton = getByText('Submit Another Response?');
    fireEvent.click(submitAnotherResponseButton);

    expect(window.location.pathname).toBe('/');
  });

  test('navigates to the thankyou path when "Back" button is clicked', () => {
    const { getByText } = render(
      <Router>
        <Details obj={mockObj} />
      </Router>
    );

    const backButton = getByText('Back');
    fireEvent.click(backButton);

    expect(window.location.pathname).toBe('/thankyou');
  });
});