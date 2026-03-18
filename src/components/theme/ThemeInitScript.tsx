import { getThemeInitScript } from '@/lib/theme';

export function ThemeInitScript() {
  return (
    <script
      id="theme-init"
      dangerouslySetInnerHTML={{ __html: getThemeInitScript() }}
    />
  );
}
