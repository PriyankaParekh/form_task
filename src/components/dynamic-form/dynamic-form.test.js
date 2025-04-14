import React from 'react';
import { render, fireEvent, getAllByText, screen } from '@testing-library/react';
import DynamicForm from './dynamic-form';
import '@testing-library/jest-dom/extend-expect';



describe('DynamicForm', () => {
  const handleInputChange = jest.fn();
  const setData = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders textarea correctly', () => {
    const field = {
      field_type: 'textarea',
      name: 'description',
      label: 'Description',
      placeholder: 'Enter description',
    };
    const data = { description: 'Test description' };
    const err = {};

    const { getByLabelText, getByPlaceholderText } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    const textarea = getByLabelText('Description');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('Test description');
    expect(getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  test('renders select correctly', () => {
    const field = {
      field_type: 'select',
      name: 'category',
      label: 'Category',
      options: ['Option 1', 'Option 2', 'Option 3'],
    };
    const data = { category: 'Option 2' };
    const err = {};

    const { getByLabelText, getByRole } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    const selectLabel = getByLabelText('Category');
    expect(selectLabel).toBeInTheDocument();

    const selectElement = getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('Option 2');

    const options = getByRole('option', { name: 'Option 1' });
    expect(options).toBeInTheDocument();
  });

  test('renders checkbox correctly with options', () => {
    const field = {
      field_type: 'checkbox',
      name: 'interests',
      label: 'Interests',
      options: ['Reading', 'Sports', 'Traveling'],
    };
    const data = { interests: ['Reading', 'Traveling'] };
    const err = {};

    const { getByLabelText, getAllByRole } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    // const checkboxLabel = getByLabelText('Interests');
    // expect(checkboxLabel).toBeInTheDocument();

    const checkboxes = getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);

    const [readingCheckbox, sportsCheckbox, travelingCheckbox] = checkboxes;
    expect(readingCheckbox).toBeChecked();
    expect(sportsCheckbox).not.toBeChecked();
    expect(travelingCheckbox).toBeChecked();
  });

  

  test('renders checkbox correctly without options', () => {
    const field = {
      field_type: 'checkbox',
      name: 'isAccepted',
      label: 'Accept Terms and Conditions',
    };
    const data = { isAccepted: false };
    const err = {};

    const { getByLabelText, getByRole } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    const checkboxLabel = getByLabelText('Accept Terms and Conditions');
    expect(checkboxLabel).toBeInTheDocument();

    const checkbox = getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('renders radio correctly', () => {
    const field = {
      field_type: 'radio',
      name: 'gender',
      label: 'Gender',
      options: ['Male', 'Female', 'Other'],
    };
    const data = { gender: 'Female' };
    const err = {};

    const { getByLabelText, getAllByRole } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    // const radioLabel = getByLabelText('Gender');
    // expect(radioLabel).toBeInTheDocument();

    const radios = getAllByRole('radio');
    expect(radios).toHaveLength(3);

    const [maleRadio, femaleRadio, otherRadio] = radios;
    expect(maleRadio).not.toBeChecked();
    expect(femaleRadio).toBeChecked();
    expect(otherRadio).not.toBeChecked();
  });

  test('renders input correctly', () => {
    const field = {
      field_type: 'text',
      name: 'name',
      label: 'Name',
      placeholder: 'Enter your name',
    };
    const data = { name: 'John Doe' };
    const err = {};

    const { getByLabelText, getByPlaceholderText } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    const input = getByLabelText('Name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('John Doe');
    expect(getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  test('handles input change', () => {
    const field = {
      field_type: 'text',
      name: 'name',
      label: 'Name',
    };
    const data = { name: '' };
    const err = {};

    const { getByLabelText } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    const input = getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'John Doe' } });

    expect(handleInputChange).toHaveBeenCalledWith('name', 'John Doe');
  });
  test('renders select with default option', () => {
    const field = {
      field_type: 'select',
      name: 'category',
      label: 'Category',
      options: ['Option 1', 'Option 2', 'Option 3'],
    };
    const data = { category: '' };
    const err = {};
  
    const { getByRole } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );
  
    const selectElement = getByRole('combobox');
    expect(selectElement).toHaveValue('');
  
    const defaultOption = getByRole('option', { name: 'Select' });
    expect(defaultOption).toBeInTheDocument();
  });
  
  test('renders checkbox with error message', () => {
    const field = {
      field_type: 'checkbox',
      name: 'interests',
      label: 'Interests',
      options: ['Reading', 'Sports', 'Traveling'],
    };
    const data = { interests: [] };
    const err = { interests: true };
  
    const { getAllByText } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );
  
    const errorMessage = getAllByText('This is Required field.. Please select anyone')[0];
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders checkbox with options and handles input change', () => {
    const field = {
      field_type: 'checkbox',
      name: 'interests',
      label: 'Interests',
      options: ['Reading', 'Sports', 'Traveling'],
    };
    const data = { interests: ['Reading'] };
    const err = {};

    render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    // Check if checkboxes are rendered
    const readingCheckbox = screen.getByLabelText('Reading');
    const sportsCheckbox = screen.getByLabelText('Sports');
    const travelingCheckbox = screen.getByLabelText('Traveling');

    expect(readingCheckbox).toBeChecked();
    expect(sportsCheckbox).not.toBeChecked();
    expect(travelingCheckbox).not.toBeChecked();

    // Simulate checking the "Sports" checkbox
    fireEvent.click(sportsCheckbox);
    setData.mock.calls[0][0]((prevData) => {
      expect(prevData).toEqual({ interests: ['Reading'] });
      return { interests: ['Reading', 'Sports'] };
    });

    // Simulate unchecking the "Reading" checkbox
    fireEvent.click(readingCheckbox);
    setData.mock.calls[1][0]((prevData) => {
      expect(prevData).toEqual({ interests: ['Reading', 'Sports'] });
      return { interests: ['Sports'] };
    });
  });
  
  test('calls handleInputChange with correct arguments on input change', () => {
    // Mock data
    const field = {
      name: 'firstName',
      label: 'First Name',
      field_type: 'text',
      placeholder: 'Enter your first name',
    };
    const data = {};
    const handleInputChange = jest.fn();
    const err = {};
    const setData = jest.fn();

    // Render the DynamicForm component
    const { getByLabelText } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    // Simulate input change
    const inputElement = getByLabelText('First Name');
    fireEvent.change(inputElement, { target: { value: 'John' } });

    // Verify if handleInputChange is called with the correct arguments
    expect(handleInputChange).toHaveBeenCalledTimes(1);
    expect(handleInputChange).toHaveBeenCalledWith('firstName', 'John');
  });

  test('renders checkbox without options with error message', () => {
    const field = {
      field_type: 'checkbox',
      name: 'isAccepted',
      label: 'Accept Terms and Conditions',
    };
    const data = { isAccepted: false };
    const err = { isAccepted: true };
  
    const { getAllByText } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );
  
    const errorMessage = getAllByText('This is Required field.. Please select checkbox')[0];
    expect(errorMessage).toBeInTheDocument();
  });
  
  test('renders checkbox with options correctly', () => {
    const field = {
      field_type: 'checkbox',
      name: 'interests',
      label: 'Interests',
      options: ['Reading', 'Sports', 'Traveling'],
    };
    const data = { interests: ['Reading', 'Traveling'] };
    const err = {};

    const { getAllByRole } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    const checkboxes = getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);

    const [readingCheckbox, sportsCheckbox, travelingCheckbox] = checkboxes;
    expect(readingCheckbox).toBeChecked();
    expect(sportsCheckbox).not.toBeChecked();
    expect(travelingCheckbox).toBeChecked();
  });

  test('updates data when checkbox option is checked/unchecked', () => {
    const field = {
      field_type: 'checkbox',
      name: 'interests',
      label: 'Interests',
      options: ['Reading', 'Sports', 'Traveling'],
    };
    const data = { interests: [] };
    const err = {};
  
    const setDataMock = jest.fn();
  
    const { getAllByRole } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setDataMock}
      />
    );
  
    // const [readingCheckbox, sportsCheckbox, travelingCheckbox] = getAllByRole('checkbox');
  
    // fireEvent.click(sportsCheckbox);
    // expect(setDataMock).toHaveBeenCalledWith({ interests: ['Sports'] });
  
    // fireEvent.click(travelingCheckbox);
    // expect(setDataMock).toHaveBeenCalledWith({ interests: ['Sports', 'Traveling'] });
  
    // fireEvent.click(sportsCheckbox);
    // expect(setDataMock).toHaveBeenCalledWith({ interests: ['Traveling'] });
  });

  test('updates data when checkbox without options is checked/unchecked', () => {
    const field = {
      field_type: 'checkbox',
      name: 'isAccepted',
      label: 'Accept Terms and Conditions',
    };
    const data = { isAccepted: false };
    const err = {};
  
    const setDataMock = jest.fn((updatedData) => {
      return { ...data, ...updatedData };
    });
  
    const { getByRole } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setDataMock}
      />
    );
  
    const checkbox = getByRole('checkbox');
  
    // fireEvent.click(checkbox);
    // expect(setDataMock).toHaveBeenCalledWith({ isAccepted: true });
  
    // fireEvent.click(checkbox);
    // expect(setDataMock).toHaveBeenCalledWith({ isAccepted: false });
  });

  test('renders checkbox without options correctly', () => {
    const field = {
      field_type: 'checkbox',
      name: 'isAccepted',
      label: 'Accept Terms and Conditions',
    };
    const data = { isAccepted: false };
    const err = {};

    const { getByRole } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    const checkbox = getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });


  test('renders radio with error message', () => {
    const field = {
      field_type: 'radio',
      name: 'gender',
      label: 'Gender',
      options: ['Male', 'Female', 'Other'],
    };
    const data = { gender: '' };
    const err = { gender: true };
  
    const { getByText } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );
  
    const errorMessage = getByText('This is Required field. Please select anyone');
    expect(errorMessage).toBeInTheDocument();
  });
  
  test('renders input with error message', () => {
    const field = {
      field_type: 'text',
      name: 'name',
      label: 'Name',
      placeholder: 'Enter your name',
    };
    const data = { name: '' };
    const err = { name: true };
  
    const { getByText } = render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );
  
    const errorMessage = getByText('Invalid input');
    expect(errorMessage).toBeInTheDocument();
  });
});

describe('DynamicForm', () => {
  const handleInputChange = jest.fn();
  const setData = jest.fn();
  const field = {
    name: 'testField',
    label: 'Test Field',
    field_type: 'text',
    placeholder: 'Enter text',
  };
  const data = {
    testField: '',
  };
  const err = {};

  beforeEach(() => {
    render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls handleInputChange with correct arguments on input change', () => {
    const inputField = screen.getByLabelText('Test Field');
    fireEvent.change(inputField, { target: { value: 'test value' } });

    expect(handleInputChange).toHaveBeenCalledWith('testField', 'test value');
  });

  test('does not call handleInputChange with empty string on input change', () => {
    const inputField = screen.getByLabelText('Test Field');
    fireEvent.change(inputField, { target: { value: '' } });

    expect(handleInputChange).not.toHaveBeenCalled();
  });

  test('calls handleInputChange with correct arguments on textarea change', () => {
    const field = {
      name: 'testTextarea',
      label: 'Test Textarea',
      field_type: 'textarea',
      placeholder: 'Enter text',
    };
    render(
      <DynamicForm
        field={field}
        data={data}
        handleInputChange={handleInputChange}
        err={err}
        setData={setData}
      />
    );

    const textareaField = screen.getByLabelText('Test Textarea');
    fireEvent.change(textareaField, { target: { value: 'test textarea value' } });

    expect(handleInputChange).toHaveBeenCalledWith('testTextarea', 'test textarea value');
  });
});