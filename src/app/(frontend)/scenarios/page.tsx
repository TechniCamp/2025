import NotesScenarioGenerator from '@/components/PresentationsScenariosGenerator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Note to Learning Scenario Generator',
  description: 'Convert your notes into detailed teaching scenarios and learning materials',
};

export default function ScenariosPage() {
  return <NotesScenarioGenerator />;
}