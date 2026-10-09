import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import AssessmentForm from './AssessmentForm';
import { SAMPLE_PATIENT } from './schema';

describe('AssessmentForm', () => {
  it('loads the sample patient and submits parsed values', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <MantineProvider>
        <AssessmentForm onSave={onSave} />
      </MantineProvider>,
    );

    await user.click(screen.getByRole('button', { name: /load sample patient/i }));
    await user.click(screen.getByRole('button', { name: /save assessment/i }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1), { timeout: 2000 });
    expect(onSave).toHaveBeenCalledWith({
      ...SAMPLE_PATIENT,
      barthelIndex: 80,
      medicationCount: 3,
    });
    expect(await screen.findByText(/assessment saved successfully/i)).toBeInTheDocument();
  });
});
