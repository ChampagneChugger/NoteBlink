import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export type Popup = "export" | "import" | "sync" | undefined | "exporting" | "exported"

export const popup: Writable<Popup> = writable(undefined)