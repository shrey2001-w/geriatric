import { describe, expect, it } from 'vitest';
import { assessmentSchema, SAMPLE_PATIENT } from './schema';

describe('assessmentSchema', () => {
  it('accepts a patient who turns exactly 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse({
      ...SAMPLE_PATIENT,
      dateOfBirth: '1966-08-07',
      assessmentDate: '2026-08-07',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a patient one day short of 60', () => {
    const result = assessmentSchema.safeParse({
      ...SAMPLE_PATIENT,
      dateOfBirth: '1966-08-08',
      assessmentDate: '2026-08-07',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'dateOfBirth')).toBe(true);
    }
  });

  it('rejects an invalid medical record number', () => {
    const result = assessmentSchema.safeParse({
      ...SAMPLE_PATIENT,
      mrn: '12345',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a Barthel Index that is not a multiple of 5', () => {
    const result = assessmentSchema.safeParse({
      ...SAMPLE_PATIENT,
      barthelIndex: 82,
    });

    expect(result.success).toBe(false);
  });

  it('requires pharmacist review for five or more medications', () => {
    const result = assessmentSchema.safeParse({
      ...SAMPLE_PATIENT,
      medicationCount: 5,
      pharmacistReviewRequested: false,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === 'pharmacistReviewRequested'),
      ).toBe(true);
    }
  });

  it('requires consent before saving', () => {
    const result = assessmentSchema.safeParse({
      ...SAMPLE_PATIENT,
      consentObtained: false,
    });

    expect(result.success).toBe(false);
  });

  it('requires the follow-up date to be after the assessment date', () => {
    const result = assessmentSchema.safeParse({
      ...SAMPLE_PATIENT,
      assessmentDate: '2026-08-07',
      followUpDate: '2026-08-07',
    });

    expect(result.success).toBe(false);
  });

  it('accepts valid sample patient data', () => {
    const result = assessmentSchema.safeParse(SAMPLE_PATIENT);

    expect(result.success).toBe(true);
  });
});
