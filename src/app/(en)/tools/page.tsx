import { ToolDirectoryPageView } from '@/components/site/views/ToolDirectoryPageView';
import { getToolDirectoryMetadata } from '@/lib/tool-directory-metadata';

export const metadata = getToolDirectoryMetadata('en');

export default function EnglishToolDirectoryPage() {
  return <ToolDirectoryPageView locale="en" />;
}
