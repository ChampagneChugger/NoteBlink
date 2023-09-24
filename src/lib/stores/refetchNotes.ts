import { writable } from "svelte/store"

export const refetchNotes = writable({
    id: -1,
    title: "",
    state: false
})