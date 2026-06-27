const templateStyles = [
  { value: 'v1', label: 'Standard', tone: 'Clean local business layout' },
  { value: 'v2', label: 'Showcase', tone: 'Premium visual brand presentation' },
  { value: 'v3', label: 'Lead Capture', tone: 'Enquiry-first conversion flow' },
  { value: 'v4', label: 'Motion Landing', tone: 'Animated, high-energy landing page' },
  { value: 'v5', label: 'Editorial Texture', tone: 'Magazine-style hierarchy and texture' },
  { value: 'v6', label: 'Immersive Pro', tone: 'Layered gallery-led trust builder' },
] as const;

const demoIndustries = [
  {
    slug: 'restaurant',
    label: 'Restaurant & Dining',
    industry: 'Restaurant',
    useCase: 'Menu highlights, ambience, hours, location, and reservation intent.',
    accent: '#f97316',
  },
  {
    slug: 'medical',
    label: 'Medical & Clinics',
    industry: 'Medical',
    useCase: 'Services, appointment path, patient reassurance, and contact clarity.',
    accent: '#0ea5e9',
  },
  {
    slug: 'real-estate',
    label: 'Real Estate',
    industry: 'Real Estate',
    useCase: 'Featured properties, buyer/seller prompts, and local market confidence.',
    accent: '#2563eb',
  },
  {
    slug: 'education',
    label: 'Education & Schools',
    industry: 'Education',
    useCase: 'Programs, admissions, campus life, and parent enquiry flow.',
    accent: '#7c3aed',
  },
  {
    slug: 'interior',
    label: 'Interior Design',
    industry: 'Interior',
    useCase: 'Portfolio presentation, process, consultation CTA, and design credibility.',
    accent: '#be185d',
  },
  {
    slug: 'agency',
    label: 'Digital Agency',
    industry: 'Agency',
    useCase: 'Services, selected work, process, and consultation-led conversion.',
    accent: '#0891b2',
  },
] as const;

const industryPages = {
  'for-restaurants': {
    industry: 'Restaurant',
    eyebrow: 'Restaurant website demos',
    headline: 'Turn hungry visitors into bookings before they call.',
    intro: 'AI SiteSpark creates restaurant demos with menu focus, strong food presentation, practical location details, and reservation-ready calls to action.',
    pains: ['Food photos are scattered across social media', 'Menus and timings are hard to find', 'New guests do not know what makes the place worth visiting'],
    benefits: ['Menu-led website structure', 'Reservation and WhatsApp-ready CTAs', 'Gallery sections that sell ambience and signature dishes'],
  },
  'for-clinics': {
    industry: 'Medical',
    eyebrow: 'Clinic website demos',
    headline: 'Make patients understand your care before they visit.',
    intro: 'Generate a calm clinic website demo with services, appointment flow, doctor/team trust sections, and contact details that reduce confusion.',
    pains: ['Patients cannot quickly understand available services', 'Appointment instructions are unclear', 'Trust signals are missing or scattered'],
    benefits: ['Service sections for common treatments', 'Clear appointment and contact paths', 'Patient-friendly structure with practical FAQs'],
  },
  'for-real-estate': {
    industry: 'Real Estate',
    eyebrow: 'Real estate website demos',
    headline: 'Show properties and local expertise with more confidence.',
    intro: 'Create real estate demos that organize listings, neighbourhood context, buyer/seller prompts, and enquiry paths for serious prospects.',
    pains: ['Listings look generic and hard to compare', 'Prospects do not see your local expertise', 'Buyer and seller enquiries are mixed together'],
    benefits: ['Featured listing sections', 'Buyer and seller CTA paths', 'Local-market trust content'],
  },
  'for-schools': {
    industry: 'Education',
    eyebrow: 'School website demos',
    headline: 'Help parents understand your school in minutes.',
    intro: 'Build education demos with programs, admissions, campus details, outcomes, and enquiry sections designed for parent decision-making.',
    pains: ['Admissions information is spread across documents', 'Parents cannot compare programs easily', 'Campus and student support details are not visible'],
    benefits: ['Admissions-first information flow', 'Program and campus sections', 'Parent enquiry CTA sections'],
  },
  'for-interior-designers': {
    industry: 'Interior',
    eyebrow: 'Interior designer website demos',
    headline: 'Sell the design standard before the first consultation.',
    intro: 'Generate polished interior design demos that lead with portfolio quality, services, process, and consultation-ready conversion sections.',
    pains: ['Portfolio work is not presented professionally', 'Clients do not understand the design process', 'Consultation requests lack context'],
    benefits: ['Portfolio-led visual sections', 'Process and service clarity', 'Consultation-focused enquiry flow'],
  },
} as const;

export { demoIndustries, industryPages, templateStyles };
export type IndustryPageSlug = keyof typeof industryPages;
