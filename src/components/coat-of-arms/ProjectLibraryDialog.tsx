'use client';

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import { sanitizeCoatFileBaseName } from '@/lib/coat-of-arms/file-name';
import {
  deleteProjectRecord,
  exportProjectDocument,
  importProjectDocument,
  listProjectRecords,
  MAX_COAT_PROJECT_DOCUMENT_BYTES,
  saveProjectRecord,
  type CoatProjectRecord,
} from '@/lib/coat-of-arms/project-storage';
import type { CoatLocale, CoatProject } from '@/lib/coat-of-arms/types';
import { Button } from '@/components/ui/button';
import { getCoatWorkbenchCopy } from './workbench-copy';

interface ProjectLibraryDialogProps {
  locale: CoatLocale;
  open: boolean;
  project: CoatProject;
  portalHost?: HTMLElement | null;
  renderTrigger?: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onOpenChange: (open: boolean) => void;
  onProjectChange: (project: CoatProject) => void;
}

interface ProjectLibraryModalProps {
  locale: CoatLocale;
  project: CoatProject;
  portalHost?: HTMLElement | null;
  onOpenChange: (open: boolean) => void;
  onProjectChange: (project: CoatProject) => void;
}

interface InitialProjectLibraryState {
  records: CoatProjectRecord[];
  errorMessage: string | null;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function readInitialProjectLibraryState(): InitialProjectLibraryState {
  try {
    return { records: listProjectRecords(), errorMessage: null };
  } catch (caught) {
    return { records: [], errorMessage: getErrorMessage(caught) };
  }
}

function createProjectId(): string {
  return createLocalCoatId();
}

function downloadTextFile(contents: string, fileName: string): void {
  const urlApi = globalThis.URL;
  if (!urlApi || typeof urlApi.createObjectURL !== 'function' || typeof urlApi.revokeObjectURL !== 'function') {
    throw new Error('Project JSON download is unavailable in this browser');
  }
  const objectUrl = urlApi.createObjectURL(new Blob([contents], { type: 'application/json' }));
  try {
    const anchor = globalThis.document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.click();
  } finally {
    urlApi.revokeObjectURL(objectUrl);
  }
}

function copyProjectWithName(project: CoatProject, name: string, id = project.id, emptyNameMessage: string): CoatProject {
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error(emptyNameMessage);
  return { ...project, id, name: trimmedName };
}

function getDialogFocusableElements(dialog: HTMLElement): HTMLElement[] {
  return [...dialog.querySelectorAll<HTMLElement>(
    'button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
  )].filter((element) => !element.hasAttribute('hidden'));
}

function getProjectLibraryPortalHost(portalHost: HTMLElement | null | undefined): HTMLElement | null {
  if (portalHost) return portalHost;
  if (typeof document === 'undefined') return null;
  return document.body;
}

/** Owns one open local-project-library session and refreshes records on mount. */
function ProjectLibraryModal({
  locale,
  project,
  portalHost,
  onOpenChange,
  onProjectChange,
}: ProjectLibraryModalProps) {
  const copy = getCoatWorkbenchCopy(locale);
  const [initialState] = useState(readInitialProjectLibraryState);
  const [records, setRecords] = useState<CoatProjectRecord[]>(() => initialState.records);
  const [projectName, setProjectName] = useState(project.name);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => initialState.errorMessage ? copy.projectOperationFailed(initialState.errorMessage) : null);
  const [status, setStatus] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const refreshRecords = () => {
    const nextRecords = listProjectRecords();
    setRecords(nextRecords);
    setSelectedId((current) => current && nextRecords.some((record) => record.id === current) ? current : null);
  };

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const run = (operation: () => void, successMessage?: string) => {
    try {
      setError(null);
      operation();
      if (successMessage) setStatus(successMessage);
    } catch (caught) {
      setStatus(null);
      setError(copy.projectOperationFailed(getErrorMessage(caught)));
    }
  };

  const closeLibrary = () => {
    onOpenChange(false);
  };

  const onDialogKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLibrary();
      return;
    }
    if (event.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusableElements = getDialogFocusableElements(dialog);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);
    if (!firstElement || !lastElement) return;
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const saveCurrentProject = () => run(() => {
    const namedProject = copyProjectWithName(project, projectName, project.id, copy.projectNameRequired);
    saveProjectRecord({ id: namedProject.id, name: namedProject.name, project: namedProject });
    onProjectChange(namedProject);
    refreshRecords();
  }, copy.projectSaved);

  const saveAsProject = () => run(() => {
    const savedProject = copyProjectWithName(project, projectName, createProjectId(), copy.projectNameRequired);
    saveProjectRecord({ id: savedProject.id, name: savedProject.name, project: savedProject });
    onProjectChange(savedProject);
    refreshRecords();
    setSelectedId(savedProject.id);
  }, copy.projectCopied);

  const renameSavedProject = () => run(() => {
    if (!selectedId) throw new Error(copy.selectProjectToRename);
    const record = records.find((candidate) => candidate.id === selectedId);
    if (!record) throw new Error(copy.projectUnavailable(selectedId));
    const renamedProject = copyProjectWithName(record.project, projectName, record.project.id, copy.projectNameRequired);
    saveProjectRecord({ id: renamedProject.id, name: renamedProject.name, project: renamedProject });
    if (project.id === renamedProject.id) onProjectChange(renamedProject);
    refreshRecords();
  }, copy.projectRenamed);

  const deleteSavedProject = () => run(() => {
    if (!selectedId) throw new Error(copy.selectProjectToDelete);
    deleteProjectRecord(selectedId);
    refreshRecords();
  }, copy.projectDeleted);

  const loadSavedProject = () => run(() => {
    if (!selectedId) throw new Error(copy.selectProjectToLoad);
    const record = records.find((candidate) => candidate.id === selectedId);
    if (!record) throw new Error(copy.projectUnavailable(selectedId));
    onProjectChange(record.project);
    setProjectName(record.name);
  }, copy.projectLoaded);

  const createProject = () => run(() => {
    const nextProject = createDefaultProject(locale);
    onProjectChange(nextProject);
    setProjectName(nextProject.name);
    setSelectedId(null);
  }, copy.newProjectReady);

  const exportProject = () => run(() => {
    const json = exportProjectDocument(project);
    downloadTextFile(json, `${sanitizeCoatFileBaseName(project.name)}.json`);
  }, copy.projectDownloaded);

  const importProject = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setError(null);
      if (file.size > MAX_COAT_PROJECT_DOCUMENT_BYTES) {
        setStatus(null);
        setError(copy.projectImportFileTooLarge(file.size, MAX_COAT_PROJECT_DOCUMENT_BYTES));
        return;
      }
      const importedProject = importProjectDocument(await file.text());
      onProjectChange(importedProject);
      setProjectName(importedProject.name);
      setStatus(copy.projectImported);
    } catch (caught) {
      setStatus(null);
      setError(copy.projectOperationFailed(getErrorMessage(caught)));
    }
  };

  const targetPortalHost = getProjectLibraryPortalHost(portalHost);
  if (!targetPortalHost) return null;

  const dialog = createPortal(<>
    <div aria-hidden="true" className="coat-workbench-modal-backdrop" data-coat-project-library-modal-interaction="backdrop" data-testid="coat-project-modal-backdrop" onClick={closeLibrary} />
    <section
      ref={dialogRef}
      aria-label={copy.localProjects}
      aria-modal="true"
      className="coat-workbench-dialog"
      data-coat-project-library-modal-interaction="dialog"
      onKeyDown={onDialogKeyDown}
      role="dialog"
    >
      <div className="flex items-start justify-between gap-4">
        <div><h2>{copy.localProjects}</h2><p>{copy.localProjectsDescription}</p></div>
        <Button ref={closeButtonRef} type="button" variant="ghost" onClick={closeLibrary}>{copy.close}</Button>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      {status ? <p role="status">{status}</p> : null}
      <label>
        {copy.projectName}
        <input aria-label={copy.projectName} value={projectName} onChange={(event) => setProjectName(event.target.value)} />
      </label>
      <div className="coat-workbench-action-row">
        <Button type="button" onClick={createProject}>{copy.newProject}</Button>
        <Button type="button" onClick={saveCurrentProject}>{copy.saveProject}</Button>
        <Button type="button" variant="outline" onClick={saveAsProject}>{copy.saveAsProject}</Button>
        <Button type="button" variant="outline" onClick={exportProject}>{copy.exportProjectJson}</Button>
        <Button type="button" variant="outline" onClick={() => importInputRef.current?.click()}>{copy.importProjectJson}</Button>
        <input ref={importInputRef} aria-label={copy.importProjectJsonFile} className="sr-only" tabIndex={-1} type="file" accept="application/json,.json" onChange={importProject} />
      </div>
      <div className="coat-workbench-project-list">
        <label>
          {copy.savedProjects}
          <select aria-label={copy.savedProjects} value={selectedId ?? ''} onChange={(event) => {
            const nextId = event.target.value || null;
            setSelectedId(nextId);
            const record = records.find((candidate) => candidate.id === nextId);
            if (record) setProjectName(record.name);
          }}>
            <option value="">{copy.noSelectedProject}</option>
            {records.map((record) => <option key={record.id} value={record.id}>{record.name}</option>)}
          </select>
        </label>
        {records.length === 0 ? <p>{copy.noProjects}</p> : null}
        <div className="coat-workbench-action-row">
          <Button type="button" variant="outline" onClick={loadSavedProject}>{copy.loadProject}</Button>
          <Button type="button" variant="outline" onClick={renameSavedProject}>{copy.renameProject}</Button>
          <Button type="button" variant="destructive" onClick={deleteSavedProject}>{copy.deleteProject}</Button>
        </div>
      </div>
    </section>
  </>,
    targetPortalHost,
  );

  return dialog;
}

/** Local-only project library with a stable opener and a focus-managed modal. */
export function ProjectLibraryDialog({
  locale,
  open,
  project,
  portalHost,
  renderTrigger = true,
  triggerRef,
  onOpenChange,
  onProjectChange,
}: ProjectLibraryDialogProps) {
  const copy = getCoatWorkbenchCopy(locale);

  return <>
    {renderTrigger ? <Button ref={triggerRef} type="button" variant="outline" onClick={() => onOpenChange(true)}>{copy.projects}</Button> : null}
    {open ? <ProjectLibraryModal locale={locale} project={project} portalHost={portalHost} onOpenChange={onOpenChange} onProjectChange={onProjectChange} /> : null}
  </>;
}
