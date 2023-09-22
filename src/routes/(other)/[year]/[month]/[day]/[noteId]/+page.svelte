<script lang="ts">
	import { page } from "$app/stores"
	import Breadcrumbs from "$lib/components/breadcrumbs.svelte"
	import Allnotes from "$lib/components/allnotes.svelte"
	import Icon from "@iconify/svelte"
	import type { Note } from "$lib/types/note"
	import { marked } from "marked"

	type State = "read" | "edit"
	let note: Note
	let noteHTML: string
	let noteMarkdown: string
	let state: State = "read"

	function getCurrentNote(year: number, month: number, day: number, noteID: number) {
		const request = indexedDB.open("NoteBlink", 1)

		request.onerror = (event) => {
			console.error(event)
		}

		request.onsuccess = () => {
			const db = request.result
			const transaction = db.transaction("notes", "readwrite")

			const store = transaction.objectStore("notes")

			const year_month_day = store.index("year-month-day")

			const query = year_month_day.getAll([year, month, day])

			query.onsuccess = () => {
				let notes = query.result

				notes = notes.filter((note) => {
					return note.id == $page.params.noteId
				})

				note = notes[0]
				noteHTML = marked.parse(note.content)
				noteMarkdown = note.content

				if (!note) {
					window.location.href = "/error"
				}
			}

			transaction.oncomplete = () => {
				db.close()
			}
		}
	}

	$: getCurrentNote(
		Number($page.params.year),
		Number($page.params.month),
		Number($page.params.day),
		Number($page.params.noteId)
	)

	$: if (noteMarkdown) {
		noteHTML = marked.parse(noteMarkdown)
	}
</script>

<svelte:head>
	<title>NoteBlink - {note?.title}</title>
</svelte:head>

<Allnotes />
<div class="notepagecontent">
	<div class="upper">
		<Breadcrumbs noteTitle={note?.title} />
		<div class="noteActions">
			<button
				on:click={() => {
					state = "read"
				}}
			>
				<Icon icon="ant-design:read-filled" />
				<p>Read</p>
			</button>
			<button
				on:click={async () => {
					state = "edit"
				}}
			>
				<Icon icon="material-symbols:edit" />
				<p>Edit</p>
			</button>
		</div>
	</div>
	{#if state == "read" && noteHTML}
		<div class="content">
			{@html noteHTML}
		</div>
	{:else}
		<div class="content">
			<textarea bind:value={noteMarkdown} />
		</div>
	{/if}
</div>
