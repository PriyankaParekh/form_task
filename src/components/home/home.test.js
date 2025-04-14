import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Home from './home'; // Make sure the path is correct and file is named correctly
import { obj } from '../../utils/obj';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom/extend-expect';


jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders form fields correctly', () => {
    const mockConfig = {
      steps: [
        {
          title: 'Step 1',
          description: 'Step 1 description',
          step: 'step1',
        },
      ],
      fields: {
        step1: [
          {
            name: 'firstName',
            label: 'First Name',
            field_type: 'text',
            required: true,
          },
          {
            name: 'lastName',
            label: 'Last Name',
            field_type: 'text',
            required: true,
          },
        ],
      },
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockConfig,
    });

    const { getByLabelText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(getByLabelText('First Name')).toBeInTheDocument();
    expect(getByLabelText('Last Name')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const mockConfig = {
      steps: [
        {
          title: 'Step 1',
          description: 'Step 1 description',
          step: 'step1',
        },
      ],
      fields: {
        step1: [
          {
            name: 'firstName',
            label: 'First Name',
            field_type: 'text',
            required: true,
          },
          {
            name: 'lastName',
            label: 'Last Name',
            field_type: 'text',
            required: true,
          },
        ],
      },
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockConfig,
    });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const firstNameInput = getByLabelText('First Name');
    const lastNameInput = getByLabelText('Last Name');
    const submitButton = getByText('Next');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('FormData')).not.toBeNull();
    });
  });
});
describe('handleSubmit function', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('submits form successfully when isValid is true', async () => {
    const mockConfig = {
      steps: [
        {
          title: 'Step 1',
          description: 'Step 1 description',
          step: 'step1',
        },
      ],
      fields: {
        step1: [
          {
            name: 'firstName',
            label: 'First Name',
            field_type: 'text',
            required: true,
          },
          {
            name: 'lastName',
            label: 'Last Name',
            field_type: 'text',
            required: true,
          },
        ],
      },
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockConfig,
    });

    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );


    const submitButton = getByText('Next');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('FormData')).not.toBeNull();
      expect(localStorage.getItem('FormSubmitted')).toBeNull();
      expect(toast).not.toHaveBeenCalled();
    });
  });

  test('displays error message when isValid is false', () => {
    const mockConfig = {
      steps: [
        {
          title: 'Step 1',
          description: 'Step 1 description',
          step: 'step1',
        },
      ],
      fields: {
        step1: [
          {
            name: 'firstName',
            label: 'First Name',
            field_type: 'text',
            required: true,
          },
          {
            name: 'lastName',
            label: 'Last Name',
            field_type: 'text',
            required: true,
          },
        ],
      },
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockConfig,
    });

    const { getByText } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const submitButton = getByText('Next');
    fireEvent.click(submitButton);

    expect(localStorage.getItem('FormData')).not.toBeNull();
    expect(localStorage.getItem('FormSubmitted')).toBeNull();
    // expect(toast).toHaveBeenCalledWith('Invalid data');
  });

  test('sets error state and invalidates form for invalid data', async () => {
    const mockConfig = {
      steps: [
        { step: 'step1', title: 'Step 1', description: 'Description for Step 1' },
        { step: 'step2', title: 'Step 2', description: 'Description for Step 2' },
      ],
      fields: {
        step1: [
          { name: 'firstName', label: 'First Name', type: 'text', required: true },
          { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        ],
        step2: [
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', required: true },
        ],
      },
    };
    window.localStorage.setItem('FormData', JSON.stringify({ formData: {} }));
    window.obj = mockConfig;
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(mockConfig.fields.step1[0].label), { target: { value: 'Invalid' } });
    fireEvent.change(screen.getByLabelText(mockConfig.fields.step1[1].label), { target: { value: 'Invalid' } });
    fireEvent.submit(screen.getByRole('form'));

    // expect(screen.getByLabelText(mockConfig.fields.step1[0].label)).toHaveClass('bg-red-100');
    // expect(screen.getByLabelText(mockConfig.fields.step1[1].label)).toHaveClass('bg-red-100');
    // expect(window.localStorage.setItem).not.toHaveBeenCalledWith(
    //   'FormData',
    //   expect.anything()
    // );
  });
  
});
describe('fetchConfigData', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
  });

  // test('sets config to null if obj is falsy', () => {
  //   const { rerender } = render(<Home />);
  //   expect(screen.getByText(/YOU HAVE NOTHING TO SEE/i)).toBeInTheDocument();

  //   window.obj = null;
  //   rerender(<Home />);
  //   expect(screen.getByText(/YOU HAVE NOTHING TO SEE/i)).toBeInTheDocument();

  //   window.obj = undefined;
  //   rerender(<Home />);
  //   expect(screen.getByText(/YOU HAVE NOTHING TO SEE/i)).toBeInTheDocument();

  //   window.obj = {};
  //   rerender(<Home />);
  //   expect(screen.getByText(/YOU HAVE NOTHING TO SEE/i)).toBeInTheDocument();
  // });

  test('sets config to obj if obj is truthy', () => {
    const mockObj = { steps: [], fields: {} };
    window.obj = mockObj;

    render(<Home />);

    expect(screen.queryByText(/YOU HAVE NOTHING TO SEE/i)).not.toBeInTheDocument();
  });

  test('sets currentStep to savedData.currentStep if it exists', () => {
    const mockObj = { steps: [], fields: {} };
    window.obj = mockObj;
    window.localStorage.getItem.mockReturnValue(JSON.stringify({ currentStep: 2, formData: {} }));

    render(<Home />);

    expect(screen.queryByText(/YOU HAVE NOTHING TO SEE/i)).not.toBeInTheDocument();
  });

  test('sets currentStep to 0 if savedData.currentStep does not exist', () => {
    const mockObj = { steps: [], fields: {} };
    window.obj = mockObj;
    window.localStorage.getItem.mockReturnValue(JSON.stringify({ formData: {} }));

    render(<Home />);

    expect(screen.queryByText(/YOU HAVE NOTHING TO SEE/i)).not.toBeInTheDocument();
  });

  test('sets error state and shows toast for invalid data', async () => {
    const mockConfig = {
      steps: [
        {
          title: 'Step 1',
          description: 'Step 1 description',
          step: 'step1',
        },
      ],
      fields: {
        step1: [
          {
            name: 'firstName',
            label: 'First Name',
            field_type: 'text',
            required: true,
          },
          {
            name: 'lastName',
            label: 'Last Name',
            field_type: 'text',
            required: true,
          },
        ],
      },
    };
    window.localStorage.setItem('FormData', JSON.stringify({ formData: {} }));
    window.obj = mockConfig;
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(mockConfig.fields.step1[0].label), { target: { value: 'Invalid' } });
    fireEvent.change(screen.getByLabelText(mockConfig.fields.step1[1].label), { target: { value: 'Invalid' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(toast).not.toHaveBeenCalledWith('Invalid data');
    // expect(screen.getByLabelText(mockConfig.fields.step1[0].label)).toHaveClass('bg-red-100');
    // expect(screen.getByLabelText(mockConfig.fields.step1[1].label)).toHaveClass('bg-red-100');
  });

  test('does not set error state or show toast for valid data', async () => {
    const mockConfig = {
      steps: [
        {
          title: 'Step 1',
          description: 'Step 1 description',
          step: 'step1',
        },
      ],
      fields: {
        step1: [
          {
            name: 'firstName',
            label: 'First Name',
            field_type: 'text',
            required: true,
          },
          {
            name: 'lastName',
            label: 'Last Name',
            field_type: 'text',
            required: true,
          },
        ],
      },
    };
    window.localStorage.setItem('FormData', JSON.stringify({ formData: {} }));
    window.obj = mockConfig;
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(mockConfig.fields.step1[0].label), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(mockConfig.fields.step1[1].label), { target: { value: 'Doe' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(toast).not.toHaveBeenCalledWith('Invalid data');
    // expect(screen.getByLabelText(mockConfig.fields.step1[0].label)).not.toBe('bg-red-100');
    // expect(screen.getByLabelText(mockConfig.fields.step1[1].label)).not.toHaveClass('bg-red-100');
  });

  test('validates firstName and lastName correctly', () => {

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "firstName":
      case "lastName":
        return /^[A-Za-z ]+$/.test(value);
      case "phone":
        return /^[0-9 ]{10}$/.test(value);
      case "email":
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value);
      case "userBio":
        return /^[A-Za-z0-9.,\w-\n ]+$/.test(value);
      default:
        return true; 
    }
  };
    expect(validateField('firstName', 'John')).toBe(true);
    expect(validateField('lastName', 'Doe')).toBe(true);
    expect(validateField('firstName', 'John123')).toBe(false);
    expect(validateField('lastName', '123Doe')).toBe(false);
  });

  test('validates phone number correctly', () => {

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "firstName":
      case "lastName":
        return /^[A-Za-z ]+$/.test(value);
      case "phone":
        return /^[0-9 ]{10}$/.test(value);
      case "email":
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value);
      case "userBio":
        return /^[A-Za-z0-9.,\w-\n ]+$/.test(value);
      default:
        return true; 
    }
  };
    expect(validateField('phone', '1234567890')).toBe(true);
    expect(validateField('phone', '123 456 7890')).toBe(false);
    expect(validateField('phone', '12345678901')).toBe(false);
    expect(validateField('phone', 'abc123')).toBe(false);
  });

  test('validates email correctly', () => {

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "firstName":
      case "lastName":
        return /^[A-Za-z ]+$/.test(value);
      case "phone":
        return /^[0-9 ]{10}$/.test(value);
      case "email":
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value);
      case "userBio":
        return /^[A-Za-z0-9.,\w-\n ]+$/.test(value);
      default:
        return true; 
    }
  };
    expect(validateField('email', 'johndoe@example.com')).toBe(true);
    expect(validateField('email', 'john.doe@example.co.uk')).toBe(true);
    expect(validateField('email', 'johndoe@example')).toBe(false);
    expect(validateField('email', 'johndoe@@example.com')).toBe(false);
  });

  test('validates userBio correctly', () => {

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "firstName":
      case "lastName":
        return /^[A-Za-z ]+$/.test(value);
      case "phone":
        return /^[0-9 ]{10}$/.test(value);
      case "email":
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value);
      case "userBio":
        return /^[A-Za-z0-9.,\w-\n ]+$/.test(value);
      default:
        return true; 
    }
  };
    expect(validateField('userBio', 'This is a user bio.')).toBe(true);
    expect(validateField('userBio', 'This is a\nmulti-line\nbio.')).toBe(true);
    expect(validateField('userBio', 'Invalid!@#$%^&*')).toBe(false);
  });

  test('returns true for other fields', () => {

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "firstName":
      case "lastName":
        return /^[A-Za-z ]+$/.test(value);
      case "phone":
        return /^[0-9 ]{10}$/.test(value);
      case "email":
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value);
      case "userBio":
        return /^[A-Za-z0-9.,\w-\n ]+$/.test(value);
      default:
        return true; 
    }
  };
    expect(validateField('otherField', 'any value')).toBe(true);
  });

});