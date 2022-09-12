import { expect, test } from '@playwright/test';
import {} from 'node:test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe('Welcome');
});

test('project page has expected h1', async ({ page }) => {
	await page.goto('/projects');
	expect(await page.textContent('h1')).toBe('My Projects');
});

test('project detail page has expected h1', async ({ page }) => {
	await page.goto('/projects/obskurra');
	expect(await page.textContent('h1')).toBe('Obskurra Type');
});
