// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import GlobalErrorPage from './global-error';
import ErrorPage from './error';
import NotFoundPage from './not-found';

const privateErrorMessage = 'R2_SECRET_TOKEN must not be displayed';

describe('site error boundaries', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('offers retry without exposing a route error message', () => {
    const retry = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(<ErrorPage error={new Error(privateErrorMessage)} retry={retry} />);

    expect(screen.getByRole('heading', { name: 'We could not load this page' })).not.toBeNull();
    expect(screen.queryByText(privateErrorMessage)).toBeNull();
    expect(screen.getByRole('link', { name: 'Go to homepage' }).getAttribute('href')).toBe('/');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(retry).toHaveBeenCalledOnce();
    expect(consoleError).toHaveBeenCalledWith(expect.objectContaining({ message: privateErrorMessage }));
  });

  it('renders a complete global error document without exposing the error message', () => {
    const markup = renderToStaticMarkup(
      <GlobalErrorPage error={new Error(privateErrorMessage)} retry={() => undefined} />
    );

    expect(markup).toContain('<html');
    expect(markup).toContain('We could not load this page');
    expect(markup).not.toContain(privateErrorMessage);
  });

  it('renders a recoverable bilingual 404 page', () => {
    render(<NotFoundPage />);

    expect(screen.getByRole('heading', { name: 'Page not found' })).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Go to English home' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: '前往中文首页' }).getAttribute('href')).toBe('/zh');
  });
});
