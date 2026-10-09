import { z } from 'zod';

export const MOBILITY = ['independent', 'cane', 'walker', 'wheelchair', 'bedbound'] as const;

export const assessmentSchema = z
  .object({
    mrn: z
      .string()
      .trim()
      .regex(/^MRN-\d{6}$/, {
        error: 'Must look like MRN-004821',
      }),

    patientName: z
      .string()
      .trim()
      .min(2, { error: 'Patient name must be at least 2 characters' })
      .max(60, { error: 'Patient name cannot exceed 60 characters' }),

    dateOfBirth: z.iso.date({
      error: 'Date of birth is required',
    }),

    assessmentDate: z.iso.date({
      error: 'Assessment date is required',
    }),

    mobility: z.enum(MOBILITY, {
      error: 'Select a mobility status',
    }),

    barthelIndex: z
      .number({ error: 'Barthel Index score is required' })
      .int({ error: 'Barthel Index must be a whole number' })
      .min(0, { error: 'Barthel Index ranges from 0 to 100' })
      .max(100, { error: 'Barthel Index ranges from 0 to 100' })
      .multipleOf(5, {
        error: 'Barthel Index is scored in steps of 5',
      }),

    medicationCount: z
      .number({ error: 'Enter the number of regular medications' })
      .int({ error: 'Medication count must be a whole number' })
      .min(0, { error: 'Medication count cannot be negative' })
      .max(30, { error: 'Enter 30 or fewer' }),

    pharmacistReviewRequested: z.boolean(),

    followUpDate: z.iso.date({
      error: 'Next review date is required',
    }),

    consentObtained: z.literal(true, {
      error: 'Consent must be obtained before the assessment can be saved',
    }),
  })
  .refine(
    (data) => {
      const birthDate = data.dateOfBirth;
      const assessmentDate = data.assessmentDate;

      if (!birthDate || !assessmentDate) return true;

      const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number);
      const [assessmentYear, assessmentMonth, assessmentDay] = assessmentDate
        .split('-')
        .map(Number);

      let age = assessmentYear - birthYear;

      const birthdayHasNotOccurred =
        assessmentMonth < birthMonth ||
        (assessmentMonth === birthMonth && assessmentDay < birthDay);

      if (birthdayHasNotOccurred) age -= 1;

      return age >= 60;
    },
    {
      error: 'This pathway is for patients aged 60 and over',
      path: ['dateOfBirth'],
    },
  )
  .refine(
    (data) => !data.followUpDate || !data.assessmentDate || data.followUpDate > data.assessmentDate,
    {
      error: 'Next review must be after the assessment date',
      path: ['followUpDate'],
    },
  )
  .refine((data) => data.medicationCount < 5 || data.pharmacistReviewRequested === true, {
    error: 'Five or more medications is polypharmacy: a pharmacist review is required',
    path: ['pharmacistReviewRequested'],
  });

export type Assessment = z.infer<typeof assessmentSchema>;

export type AssessmentInput = {
  mrn: string;
  patientName: string;
  dateOfBirth: string;
  assessmentDate: string;
  mobility: (typeof MOBILITY)[number] | '';
  barthelIndex: number | string;
  medicationCount: number | string;
  pharmacistReviewRequested: boolean;
  followUpDate: string;
  consentObtained: boolean;
};

export const SAMPLE_PATIENT: AssessmentInput = {
  mrn: 'MRN-004821',
  patientName: 'Sushila Deshpande',
  dateOfBirth: '1949-03-12',
  assessmentDate: '2026-08-07',
  mobility: 'cane',
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: '2026-09-04',
  consentObtained: true,
};
