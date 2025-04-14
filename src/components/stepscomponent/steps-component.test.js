import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';
import StepsComponent from './steps-component';

describe('StepsComponent', () => {
  test('renders steps correctly', () => {
    const totalPages = 3;
    const currentPage = 2;
    const config = {
      steps: [
        { step: 'step1', title: 'Step 1: Personal Information', description: 'Please provide your personal information.' },
        { step: 'step2', title: 'Step 2: Additional Information', description: 'Please provide additional information about yourself.' },
        { step: 'step3', title: 'Step 3: Preferences', description: 'Please select your preferences.' }
      ],
      fields: {
        step1: [
          { name: 'firstName', label: 'First Name', field_type: 'text', default_value: 'John', placeholder: 'Enter First Name', regex: '/^[A-Za-z ]+$/', required: true },
          { name: 'lastName', label: 'Last Name', field_type: 'text', default_value: 'Doe', placeholder: 'Enter Last Name', regex: '/^[A-Za-z ]+$/', required: true }
        ],
        step2: [
          { name: 'userBio', label: 'User Bio', field_type: 'textarea', default_value: '', placeholder: 'Enter User Bio', regex: '/^[A-Za-z0-9.,\\w-\\n ]+$/', required: true }
        ],
        step3: [
          { name: 'gender', label: 'Gender', field_type: 'radio', options: ['Male', 'Female', 'Other'], default_value: 'Male', required: true },
          { name: 'interests', label: 'Interests', field_type: 'checkbox', options: ['Sports', 'Music', 'Travel'], default_value: [] }
        ]
      }
    };

    render(<StepsComponent currentPage={currentPage} totalPages={totalPages} config={config} />);

    // Test that steps are rendered
    const step1 = screen.getByText(/Step 1/);
    const step2 = screen.getByText(/Step 2/);
    const step3 = screen.getByText(/Step 3/);
    expect(step1).toBeInTheDocument();
    expect(step2).toBeInTheDocument();
    expect(step3).toBeInTheDocument();

    // Test that the current step is highlighted
    expect(step2).toHaveClass('steps');

  });
});

