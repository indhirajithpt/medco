export const APP_NAME = 'MedCo';
export const APP_SUBTITLE = 'Your AI Healthcare Assistant';
export const APP_VERSION = '1.0.0-prototype';

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const QUICK_ACTIONS = [
  {
    id: 'understand',
    title: 'Understand',
    subtitle: 'Symptoms & conditions',
    icon: 'Activity',
    prompt: 'Can you explain the early symptoms and causes of Type 2 diabetes?',
  },
  {
    id: 'prevent',
    title: 'Prevent',
    subtitle: 'Health & wellness',
    icon: 'ShieldPlus',
    prompt: 'What lifestyle habits and dietary practices help maintain healthy cardiovascular function?',
  },
  {
    id: 'learn',
    title: 'Learn',
    subtitle: 'Treatments & care',
    icon: 'Pill',
    prompt: 'How do common medical treatments for hypertension work in the body?',
  },
  {
    id: 'summarize',
    title: 'Summarize',
    subtitle: 'Medical information',
    icon: 'FileText',
    prompt: 'Please summarize key facts about asthma triggers and management strategies.',
  },
] as const;

export const DISCLAIMER_SHORT =
  'MedCo provides general healthcare information and is not a substitute for professional medical advice, diagnosis, or treatment.';

export const PROTOTYPE_NOTICE =
  'Development prototype. Uses synthetic questions and unreviewed research documents. Do not enter personal medical records.';

export const EMERGENCY_WARNING =
  'If you or someone else is experiencing severe chest pain, shortness of breath, sudden numbness, or any life-threatening emergency, call 911 or your local emergency services immediately.';
