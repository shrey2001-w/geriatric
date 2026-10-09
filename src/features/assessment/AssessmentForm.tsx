import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Divider,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';

import {
  assessmentSchema,
  MOBILITY,
  SAMPLE_PATIENT,
  type Assessment,
  type AssessmentInput,
} from './schema';

type AssessmentFormProps = {
  onSave?: (values: Assessment) => void;
};

const mobilityLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).replaceAll('_', ' ');

const emptyValues: AssessmentInput = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: '',
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};

const dateToString = (value: Date | string | null): string => {
  if (!value) return '';

  if (typeof value === 'string') {
    return value;
  }

  return dayjs(value).format('YYYY-MM-DD');
};

const validateAssessment = (values: AssessmentInput) => {
  const result = assessmentSchema.safeParse({
    ...values,
    barthelIndex: values.barthelIndex === '' ? Number.NaN : Number(values.barthelIndex),
    medicationCount: values.medicationCount === '' ? Number.NaN : Number(values.medicationCount),
  });

  if (result.success) {
    return {};
  }

  const errors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const field = issue.path.join('.');

    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
};

export default function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [savedValues, setSavedValues] = useState<Assessment | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<AssessmentInput>({
    initialValues: emptyValues,
    validateInputOnBlur: true,
    validate: validateAssessment,
  });

  const handleSubmit = form.onSubmit(async (inputValues) => {
    // Convert numeric inputs before validating with Zod.
    const result = assessmentSchema.safeParse({
      ...inputValues,
      barthelIndex: inputValues.barthelIndex === '' ? Number.NaN : Number(inputValues.barthelIndex),
      medicationCount:
        inputValues.medicationCount === '' ? Number.NaN : Number(inputValues.medicationCount),
    });

    if (!result.success) {
      return;
    }

    setSaving(true);
    setSavedValues(null);

    try {
      // Demo save operation.
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 800);
      });

      setSavedValues(result.data);
      onSave?.(result.data);
    } finally {
      setSaving(false);
    }
  });

  const loadSample = () => {
    form.setValues(SAMPLE_PATIENT);
    form.clearErrors();
    setSavedValues(null);
  };

  return (
    <Container size="md" py={48}>
      <Stack gap="xl">
        <header className="page-header">
          <Text className="eyebrow">HOME HEALTHCARE · CLINICAL WORKFLOW</Text>

          <Title order={1}>Geriatric Care Assessment</Title>

          <Text c="dimmed" maw={620}>
            Record a home-visit assessment, review mobility and medication needs, and plan the next
            check-in.
          </Text>
        </header>

        <Paper component="section" shadow="sm" radius="xl" p={{ base: 'md', sm: 'xl' }} withBorder>
          <Group justify="space-between" align="center" mb="lg">
            <div>
              <Title order={3}>Patient assessment</Title>

              <Text size="sm" c="dimmed" mt={4}>
                Complete all required fields before saving.
              </Text>
            </div>

            <div className="form-mark" aria-hidden="true">
              GC
            </div>
          </Group>

          <Divider mb="xl" />

          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              {/* Patient details */}
              <section>
                <Text fw={600} size="sm" mb="sm">
                  Patient details
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <TextInput
                    label="Medical record number"
                    placeholder="MRN-004821"
                    {...form.getInputProps('mrn')}
                  />

                  <TextInput
                    label="Patient name"
                    placeholder="Enter full name"
                    {...form.getInputProps('patientName')}
                  />

                  <DateInput
                    label="Date of birth"
                    placeholder="Select date of birth"
                    valueFormat="DD MMM YYYY"
                    clearable
                    maxDate={new Date()}
                    value={form.values.dateOfBirth || null}
                    onChange={(value) => form.setFieldValue('dateOfBirth', dateToString(value))}
                    onBlur={() => form.validateField('dateOfBirth')}
                    error={form.errors.dateOfBirth}
                  />

                  <DateInput
                    label="Assessment date"
                    placeholder="Select assessment date"
                    valueFormat="DD MMM YYYY"
                    maxDate={new Date()}
                    clearable
                    value={form.values.assessmentDate || null}
                    onChange={(value) => form.setFieldValue('assessmentDate', dateToString(value))}
                    onBlur={() => form.validateField('assessmentDate')}
                    error={form.errors.assessmentDate}
                  />
                </SimpleGrid>
              </section>

              <Divider />

              {/* Mobility and daily activity */}
              <section>
                <Text fw={600} size="sm" mb="sm">
                  Mobility & daily activity
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <Select
                    label="Mobility"
                    placeholder="Choose mobility status"
                    data={MOBILITY.map((value) => ({
                      value,
                      label: mobilityLabel(value),
                    }))}
                    {...form.getInputProps('mobility')}
                  />

                  <NumberInput
                    label="Barthel Index"
                    placeholder="0–100"
                    min={0}
                    max={100}
                    step={5}
                    allowDecimal={false}
                    clampBehavior="none"
                    value={form.values.barthelIndex}
                    onChange={(value) => form.setFieldValue('barthelIndex', value)}
                    onBlur={() => form.validateField('barthelIndex')}
                    error={form.errors.barthelIndex}
                  />
                </SimpleGrid>

                <Text size="xs" c="dimmed" mt="xs">
                  Barthel Index is scored from 0 to 100 in increments of 5.
                </Text>
              </section>

              <Divider />

              {/* Medication review */}
              <section>
                <Text fw={600} size="sm" mb="sm">
                  Medication review
                </Text>

                <Stack gap="md">
                  <NumberInput
                    label="Regular medications"
                    description="Number of regular medications taken by the patient"
                    placeholder="Enter a count"
                    min={0}
                    max={30}
                    allowDecimal={false}
                    clampBehavior="none"
                    value={form.values.medicationCount}
                    onChange={(value) => form.setFieldValue('medicationCount', value)}
                    onBlur={() => form.validateField('medicationCount')}
                    error={form.errors.medicationCount}
                  />

                  <Checkbox
                    label="Pharmacist review requested"
                    description="Required when the patient takes five or more regular medications."
                    {...form.getInputProps('pharmacistReviewRequested', {
                      type: 'checkbox',
                    })}
                  />
                </Stack>
              </section>

              <Divider />

              {/* Follow-up and consent */}
              <section>
                <Text fw={600} size="sm" mb="sm">
                  Follow-up & consent
                </Text>

                <Stack gap="md">
                  <DateInput
                    label="Next review date"
                    placeholder="Select next review date"
                    valueFormat="DD MMM YYYY"
                    clearable
                    value={form.values.followUpDate || null}
                    onChange={(value) => form.setFieldValue('followUpDate', dateToString(value))}
                    onBlur={() => form.validateField('followUpDate')}
                    error={form.errors.followUpDate}
                  />

                  <Checkbox
                    label="Patient or representative has given consent"
                    {...form.getInputProps('consentObtained', {
                      type: 'checkbox',
                    })}
                  />
                </Stack>
              </section>

              <Group justify="space-between" mt="sm" wrap="wrap">
                <Button
                  type="button"
                  variant="light"
                  color="gray"
                  onClick={loadSample}
                  disabled={saving}
                >
                  Load sample patient
                </Button>

                <Button type="submit" loading={saving} disabled={saving}>
                  Save assessment
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>

        {savedValues && (
          <Alert color="green" title="Assessment saved successfully" radius="lg">
            <Text size="sm" mb="sm">
              Validated values returned by the Zod schema:
            </Text>

            <Code block>{JSON.stringify(savedValues, null, 2)}</Code>
          </Alert>
        )}

        <Text size="xs" c="dimmed" ta="center">
          Demonstration only · Use fictional patient information
        </Text>
      </Stack>
    </Container>
  );
}
