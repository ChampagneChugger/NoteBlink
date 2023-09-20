import { writable } from "svelte/store"

export const monthAndYear = writable({
    month: 0,
    year: 0
})