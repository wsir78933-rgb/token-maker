import { ToolDirectoryPageView } from '@/components/site/views/ToolDirectoryPageView';
import { getToolDirectoryMetadata } from '@/lib/tool-directory-metadata';

export const metadata = getToolDirectoryMetadata('zh');

export default function ChineseToolDirectoryPage() {
  return <ToolDirectoryPageView locale="zh" />;
}
