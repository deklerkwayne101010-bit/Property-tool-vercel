'use client';

import { useSearchParams } from 'next/navigation';
import TemplateEditor from '@/components/templates/TemplateEditor';

export default function TemplateEditorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');

  return <TemplateEditor templateId={templateId || undefined} />;
}