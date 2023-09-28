import { expect, test } from '@playwright/test';
import {} from 'node:test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe(
		'  D  A  V  I  D  ::  R  O  E  G  E  R             '
	);
});

test('project page has expected h1', async ({ page }) => {
	await page.goto('/projects');
	console.log(await page.textContent('h1'));
	expect(await page.textContent('h1')).toBe('::\n\t\tProjects');
});

test('project detail page has expected h1', async ({ page }) => {
	await page.goto('/projects/obskurra-typeface');
	expect(await page.textContent('h1')).toBe(':: Obskurra Typeface');
});
