'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

import { createInitialFamilyTreeAvatar, randomizeFamilyTreeAvatar } from '@/lib/family-tree/avatar';
import { getFamilyTreeCopy } from '@/lib/family-tree/copy';
import { createFamilyTreeDocument, parseFamilyTreeDocument, serializeFamilyTreeDocument, type FamilyTreeDocument } from '@/lib/family-tree/document';
import { downloadFamilyTreeBlob, renderFamilyTreePng } from '@/lib/family-tree/export';
import { FAMILY_TREE_PERSON_WIDTH } from '@/lib/family-tree/layout';
import {
  addFamilyTreeConnection, addFamilyTreePerson, clearFamilyTreeConnections,
  createFamilyTreePerson, createInitialFamilyTreeScene, deleteFamilyTreePerson,
  getFamilyTreePerson, moveFamilyTreeConnection, moveFamilyTreePersonHorizontally,
  resizeFamilyTreeConnection, selectFamilyTreePerson, setFamilyTreeEndpointStyle,
  setFamilyTreeResizeEnabled, updateFamilyTreePerson,
  type FamilyTreeConnectionGap, type FamilyTreeGenerationIndex, type FamilyTreePersonDraft,
  type FamilyTreeScene,
} from '@/lib/family-tree/scene';
import { readFamilyTreeSaveSlot, readFamilyTreeSaveSlots, writeFamilyTreeSaveSlot, type FamilyTreeSaveSlotNumber } from '@/lib/family-tree/saves';
import type { SiteLocale } from '@/lib/site-locale';

import { FamilyAvatarEditor } from './FamilyAvatarEditor';
import { FamilyConnectionEditor } from './FamilyConnectionEditor';
import { FamilyDocumentPanel, type FamilyTreeSaveSlotsState } from './FamilyDocumentPanel';
import { FamilyImagePanel } from './FamilyImagePanel';
import { FamilyTreeCanvas } from './FamilyTreeCanvas';
import styles from './workbench.module.css';

type OpenPanel = 'editor' | 'connections' | 'documents' | 'image' | null;

function createDraft(): FamilyTreePersonDraft {
  return { avatar: createInitialFamilyTreeAvatar(), name: '', age: '', description: '' };
}

function readSlotIndicators(): FamilyTreeSaveSlotsState {
  const slots = readFamilyTreeSaveSlots(window.localStorage);
  return [slots[0] !== null, slots[1] !== null, slots[2] !== null, slots[3] !== null, slots[4] !== null];
}

async function createDecodedPreviewUrl(blob: Blob): Promise<string> {
  const url = URL.createObjectURL(blob);
  try {
    const previewImage = new Image();
    previewImage.src = url;
    await previewImage.decode();
    return url;
  } catch (caught) {
    URL.revokeObjectURL(url);
    if (!(caught instanceof Error)) throw caught;
    throw new Error(`Family tree image preview ${url} could not be decoded: ${caught.message}`, { cause: caught });
  }
}

export function FamilyTreeWorkbench({ locale }: { locale: SiteLocale }) {
  const copy = getFamilyTreeCopy(locale);
  const [scene, setScene] = useState(createInitialFamilyTreeScene);
  const [draft, setDraft] = useState(createDraft);
  const [generation, setGeneration] = useState<FamilyTreeGenerationIndex>(1);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [panel, setPanel] = useState<OpenPanel>(null);
  const [slots, setSlots] = useState<FamilyTreeSaveSlotsState>([false, false, false, false, false]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [whiteBackground, setWhiteBackground] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewBlob = useRef<Blob | null>(null);
  const previewScene = useRef<FamilyTreeScene | null>(null);
  const previewWhiteBackground = useRef<boolean | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => {
    if (!panel) return;
    const container = panel === 'editor' ? editorRef.current : dialogRef.current;
    const focusable = container?.querySelector<HTMLElement>('button, input, select, textarea');
    focusable?.focus();
  }, [panel]);

  const selectedPerson = scene.selectedPersonId ? getFamilyTreePerson(scene, scene.selectedPersonId) : null;

  function reportError(caught: unknown, message: string): void {
    if (!(caught instanceof Error)) throw caught;
    setError(`${message} ${caught.message}`);
    setStatus(null);
  }

  function openPanel(nextPanel: OpenPanel): void {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPanel(nextPanel);
    setError(null);
    setStatus(null);
  }

  function closePanel(): void {
    if (busy) return;
    setPanel(null);
    openerRef.current?.focus();
  }

  function handleConnectionsBackdropPointerDown(event: ReactPointerEvent<HTMLDivElement>): void {
    if (event.button !== 0 || event.target !== event.currentTarget) return;
    event.preventDefault();
    closePanel();
  }

  function changeDraft(nextDraft: FamilyTreePersonDraft): void {
    setDraft(nextDraft);
    setScene((current) => current.selectedPersonId ? updateFamilyTreePerson(current, current.selectedPersonId, nextDraft) : current);
  }

  function selectPerson(personId: string | null): void {
    if (personId) {
      const person = getFamilyTreePerson(scene, personId);
      setDraft({ avatar: person.avatar, name: person.name, age: person.age, description: person.description });
      setGeneration(person.generation);
    }
    setScene((current) => selectFamilyTreePerson(current, personId));
    setSelectedConnectionId(null);
  }

  function addPerson(): void {
    const id = `person-${crypto.randomUUID()}`;
    setScene((current) => {
      const existingPeople = current.generations[generation];
      const x = existingPeople.length === 0 ? 24 : Math.max(...existingPeople.map((person) => person.x)) + FAMILY_TREE_PERSON_WIDTH + 32;
      return addFamilyTreePerson(current, createFamilyTreePerson(draft, id, generation, x));
    });
    setStatus(copy.personAdded);
  }

  function addConnection(gap: FamilyTreeConnectionGap): void {
    const id = `connection-${crypto.randomUUID()}`;
    setScene((current) => setFamilyTreeResizeEnabled(addFamilyTreeConnection(current, { id, gap, x: 24, width: 240 }), true));
    setSelectedConnectionId(id);
  }

  function replaceDocument(document: FamilyTreeDocument): void {
    const restoredScene = document.scene;
    setScene(restoredScene);
    setSelectedConnectionId(null);
    if (restoredScene.selectedPersonId) {
      const person = getFamilyTreePerson(restoredScene, restoredScene.selectedPersonId);
      setDraft({ avatar: person.avatar, name: person.name, age: person.age, description: person.description });
      setGeneration(person.generation);
    } else {
      setDraft(createDraft());
      setGeneration(1);
    }
  }

  function openDocuments(): void {
    openPanel('documents');
    try { setSlots(readSlotIndicators()); } catch (caught) { reportError(caught, copy.errorStorage); }
  }

  function saveSlot(slot: FamilyTreeSaveSlotNumber): void {
    try {
      writeFamilyTreeSaveSlot(window.localStorage, slot, createFamilyTreeDocument(scene));
      setSlots(readSlotIndicators());
      setError(null);
      setStatus(copy.slotSaved);
    } catch (caught) { reportError(caught, copy.errorStorage); }
  }

  function loadSlot(slot: FamilyTreeSaveSlotNumber): void {
    try {
      const document = readFamilyTreeSaveSlot(window.localStorage, slot);
      if (!document) throw new Error(`Family tree save slot ${slot} is empty.`);
      replaceDocument(document);
      setError(null);
      setStatus(copy.slotLoaded);
    } catch (caught) { reportError(caught, copy.errorStorage); }
  }

  function saveFile(): void {
    try {
      const serialized = serializeFamilyTreeDocument(createFamilyTreeDocument(scene));
      downloadFamilyTreeBlob(new Blob([serialized], { type: 'text/plain;charset=utf-8' }), 'familyTree.txt');
      setError(null);
    } catch (caught) { reportError(caught, copy.errorFile); }
  }

  async function loadFile(): Promise<void> {
    setBusy(true);
    try {
      if (!selectedFile) throw new Error('Family tree selected file is null.');
      const document = parseFamilyTreeDocument(await selectedFile.text());
      replaceDocument(document);
      setError(null);
      setStatus(copy.fileLoaded);
    } catch (caught) { reportError(caught, copy.errorFile); }
    finally { setBusy(false); }
  }

  function clearImagePreview(): void {
    previewBlob.current = null;
    previewScene.current = null;
    previewWhiteBackground.current = null;
    setPreviewUrl(null);
  }

  function publishImagePreview(blob: Blob, url: string, imageWhiteBackground: boolean): void {
    previewBlob.current = blob;
    previewScene.current = scene;
    previewWhiteBackground.current = imageWhiteBackground;
    setPreviewUrl(url);
  }

  async function generateImage(imageWhiteBackground: boolean = whiteBackground): Promise<void> {
    if (busy) return;
    if (panel !== 'image') openPanel('image');
    setBusy(true);
    setError(null);
    if (previewScene.current !== scene) clearImagePreview();
    try {
      const blob = await renderFamilyTreePng(scene, copy, imageWhiteBackground);
      const url = await createDecodedPreviewUrl(blob);
      publishImagePreview(blob, url, imageWhiteBackground);
    } catch (caught) {
      clearImagePreview();
      reportError(caught, copy.errorImage);
    }
    finally { setBusy(false); }
  }

  function changeWhiteBackground(nextWhiteBackground: boolean): void {
    if (busy || nextWhiteBackground === whiteBackground) return;
    setWhiteBackground(nextWhiteBackground);
    void generateImage(nextWhiteBackground);
  }

  function saveImage(): void {
    try {
      if (!previewBlob.current || previewScene.current !== scene || previewWhiteBackground.current !== whiteBackground) {
        throw new Error(`Family tree image preview does not match the current canvas or background. White background: ${whiteBackground}; preview background: ${previewWhiteBackground.current}.`);
      }
      downloadFamilyTreeBlob(previewBlob.current, 'familyTree.png');
    } catch (caught) { reportError(caught, copy.errorImage); }
  }

  function handleModalKeys(event: React.KeyboardEvent<HTMLElement>): void {
    if (event.key === 'Escape') { event.preventDefault(); closePanel(); return; }
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')];
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  return (
    <section id="family-tree-workspace" className={styles.workbench} aria-label={copy.workspaceLabel}>
      <div className={styles.toolbar}>
        <span className={styles.mode}>{selectedPerson ? copy.selectedPerson : copy.newPerson}</span>
      </div>
      <div className={styles.workspace}>
        <aside ref={editorRef} className={styles.editorPane} data-open={panel === 'editor'} role={panel === 'editor' ? 'dialog' : undefined} aria-modal={panel === 'editor' ? true : undefined} onKeyDown={panel === 'editor' ? handleModalKeys : undefined} aria-label={copy.personEditor}>
          <div className={styles.mobilePanelHeader}><button type="button" className={styles.button} onClick={closePanel}>{copy.done}</button></div>
          <FamilyAvatarEditor copy={copy} locale={locale} draft={draft} generation={generation} onChange={changeDraft} onGenerationChange={setGeneration} onRandomize={() => changeDraft({ ...draft, avatar: randomizeFamilyTreeAvatar(draft.avatar) })} onAdd={addPerson} />
        </aside>
        <div className={styles.canvasPane}>
          <FamilyTreeCanvas scene={scene} copy={copy} selectedConnectionId={selectedConnectionId} onPersonSelect={selectPerson}
            headerActions={(
              <>
                <button type="button" className={styles.button} onClick={openDocuments}>{copy.saveLoad}</button>
                <button type="button" className={styles.button} onClick={openDocuments}>{copy.localFile}</button>
                <button type="button" className={styles.primaryButton} onClick={() => void generateImage()} disabled={busy}>{copy.generateImage}</button>
              </>
            )}
            onPersonMove={(id, x) => setScene((current) => moveFamilyTreePersonHorizontally(current, id, x))}
            onPersonDelete={(id) => setScene((current) => deleteFamilyTreePerson(current, id))}
            onEndpointChange={(id, direction, style) => setScene((current) => setFamilyTreeEndpointStyle(current, id, direction, style))}
            onConnectionSelect={setSelectedConnectionId}
            onConnectionMove={(id, x) => setScene((current) => moveFamilyTreeConnection(current, id, x))}
            onConnectionResize={(id, x, width) => setScene((current) => resizeFamilyTreeConnection(moveFamilyTreeConnection(current, id, x), id, width))}
            onOpenConnections={() => openPanel('connections')} />
        </div>
      </div>
      <div className={styles.mobileActions}>
        <button type="button" className={styles.button} onClick={() => openPanel('editor')}>{copy.editPerson}</button>
        <button type="button" className={styles.button} onClick={() => openPanel('connections')}>{copy.editConnections}</button>
        <button type="button" className={styles.button} onClick={openDocuments}>{copy.storageAndExport}</button>
      </div>
      {panel && panel !== 'editor' ? (
        <div
          className={styles.backdrop}
          onPointerDown={panel === 'connections' ? handleConnectionsBackdropPointerDown : undefined}
        >
          <div ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-label={panel === 'connections' ? copy.connectionEditor : panel === 'documents' ? copy.saveLoad : copy.imagePreview} onKeyDown={handleModalKeys}>
            {panel === 'connections' ? <>
              <div className={styles.connectionClose}><button type="button" className={styles.button} onClick={closePanel}>{copy.close}</button></div>
              <FamilyConnectionEditor selectedPerson={selectedPerson} connections={scene.connections} copy={copy} selectedConnectionId={selectedConnectionId} resizeEnabled={scene.resizeEnabled}
                onEndpointChange={(direction, style) => setScene((current) => {
                  if (!current.selectedPersonId) throw new Error('Family tree selected person is null.');
                  return setFamilyTreeEndpointStyle(current, current.selectedPersonId, direction, style);
                })}
                onAddConnection={addConnection} onConnectionSelect={setSelectedConnectionId}
                onResizeEnabledChange={(enabled) => setScene((current) => setFamilyTreeResizeEnabled(current, enabled))}
                onClearConnections={() => { setScene(clearFamilyTreeConnections); setSelectedConnectionId(null); }} />
            </> : panel === 'documents' ? <FamilyDocumentPanel copy={copy} slots={slots} selectedFile={selectedFile} busy={busy} onSaveSlot={saveSlot} onLoadSlot={loadSlot} onSaveFile={saveFile} onChooseFile={setSelectedFile} onLoadFile={() => void loadFile()} onClose={closePanel} /> : <FamilyImagePanel copy={copy} previewUrl={previewScene.current === scene && (busy || previewWhiteBackground.current === whiteBackground) ? previewUrl : null} whiteBackground={whiteBackground} previewWhiteBackground={previewWhiteBackground.current ?? whiteBackground} busy={busy} onWhiteBackgroundChange={changeWhiteBackground} onRegenerate={() => void generateImage()} onSave={saveImage} onClose={closePanel} />}
            {error ? <p className={styles.error} role="alert">{error}</p> : null}
            {status ? <p className={styles.status} role="status">{status}</p> : null}
          </div>
        </div>
      ) : <>{error ? <p className={styles.error} role="alert">{error}</p> : null}{status ? <p className={styles.status} role="status">{status}</p> : null}</>}
    </section>
  );
}
