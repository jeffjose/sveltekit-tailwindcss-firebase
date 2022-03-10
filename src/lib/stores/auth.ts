import { writable } from 'svelte/store';

export const authStore = writable({ status: 'loading', user: null, token: null });