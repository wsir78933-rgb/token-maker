'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SiteLocale } from '@/lib/site-locale';

import styles from './TownDialogs.module.css';

export type TownHelpDialogProps = {
  locale: SiteLocale;
  onClose: () => void;
};

const COPY = {
  en: {
    title: 'How to use Town Creator',
    description: 'A short guide to building, checking, saving, and exporting a town map.',
    sections: [
      ['Add assets', 'Choose a category and material, then add an asset to the active layer. The original asset ID and selected material stay in the project.'],
      ['Move and scale', 'Drag an object to move it. Use the resize handles to scale it by type; roads and terrain repeat along their native direction while regular buildings keep their proportions. When objects overlap, the click selects the topmost visible object. Delete or Backspace removes the selected object, and does not run while typing.'],
      ['Rotate and duplicate', 'Rotation is absolute in degrees, so repeated edits do not accumulate hidden offsets. Duplicate objects receive independent IDs and can be moved, resized, or rotated separately.'],
      ['Layers and background', 'Use the lower, middle, and upper layer controls to show or hide a complete layer. Clicking a visible object switches the editing layer to the layer that contains it. A background color or image URL is part of the project and is included in PNG export.'],
      ['Save and transfer', 'Use five browser-local slots for quick saves. Download a UTF-8 .txt project file to move the complete document, or import one that matches the current Town format.'],
      ['PNG export', 'PNG output uses the project width and height, visible layers, rotations, repeated assets, and background. The export has no selection handles or editor controls.'],
      ['Coordinates stay stable', 'The editor scales the display to fit the window, but document coordinates remain in the project canvas. Resizing the window does not change saved positions or export geometry.'],
    ],
    note: 'Start with terrain and roads on the lower layer, buildings on the middle layer, and details on the upper layer. Save a project file so you can continue editing later.',
    close: 'Close',
  },
  zh: {
    title: '城镇工具使用说明',
    description: '了解添加、检查、保存和导出城镇地图的关键操作。',
    sections: [
      ['添加素材', '选择分类和材质，把素材添加到当前图层。项目会保留原始素材 ID 和所选材质。'],
      ['拖动与缩放', '拖动对象可以移动位置，使用尺寸控制点按素材类型缩放；道路和地形沿原生方向重复，普通建筑保持比例。对象重叠时，点击选中最上方的可见对象。Delete 或 Backspace 删除选中对象，正在输入时不会触发。'],
      ['旋转与复制', '旋转使用绝对角度，重复编辑不会累积隐藏偏移。复制对象会得到独立 ID，可以分别移动、缩放和旋转。'],
      ['图层与背景', '下层、中层、上层可以整体显示或隐藏。点击可见对象会自动把编辑图层切换到该对象所在图层。背景色或背景图片 URL 会保存到项目，并包含在 PNG 导出中。'],
      ['保存与转移', '使用 5 个浏览器本地存档位快速保存。下载 UTF-8 `.txt` 项目文件可以完整转移文档，也可以导入当前城镇格式的文件。'],
      ['PNG 导出', 'PNG 会使用项目宽高、可见图层、旋转、重复素材和背景，不包含选中框或编辑器控件。'],
      ['坐标保持稳定', '编辑器会按窗口大小缩放显示，但文档坐标始终基于项目画布。调整窗口不会改变已保存的位置或导出几何。'],
    ],
    note: '建议先在下层铺设地面和道路，在中层放置建筑，在上层补充细节。下载项目文件，方便以后继续编辑。',
    close: '关闭',
  },
} as const;

export function TownHelpDialog({ locale, onClose }: TownHelpDialogProps) {
  const copy = COPY[locale];

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.dialogPanel}>
          <header className={styles.dialogHeader}>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
            <DialogClose className={styles.closeButton} aria-label={copy.close}>{copy.close}</DialogClose>
          </header>
          <div className={styles.dialogScroll}>
            <div className={styles.helpSections}>
              {copy.sections.map(([title, body]) => (
                <section className={styles.helpSection} key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </section>
              ))}
            </div>
            <p className={styles.helpNote}>{copy.note}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
