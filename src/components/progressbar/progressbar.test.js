import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ProgressBar from './progressbar';
import '@testing-library/jest-dom/extend-expect';

describe('ProgressBar Component', () => {
    afterEach(cleanup);
  test('renders without crashing', () => {
    render(<ProgressBar progressPercentage={50} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  test('sets the correct width based on progressPercentage prop', () => {
    const { rerender } = render(<ProgressBar progressPercentage={25} />);
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '25%' });

    rerender(<ProgressBar progressPercentage={75} />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '75%' });

    rerender(<ProgressBar progressPercentage={100} />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

});