<script lang="ts">
	import { page } from "$app/stores"
	import Breadcrumbs from "$lib/components/breadcrumbs.svelte"
	import Allnotes from "$lib/components/allnotes.svelte"
	import Icon from "@iconify/svelte"
	import type { Note } from "$lib/types/note"
	import { marked } from "marked"
	import { goto, onNavigate } from "$app/navigation"
	import { refetchNotes } from "$lib/stores/refetchNotes"

	type State = "read" | "edit"
	let note: Note
	let noteHTML: string
	let noteMarkdown: string
	let noteTitle: string
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
				noteTitle = note.title

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

	onNavigate((e) => {
		if (e.from?.params?.noteId != e.to?.params?.noteId) {
			state = "read"
		}
	})

	function deleteNote() {
		const request = indexedDB.open("NoteBlink", 1)

		request.onerror = (e) => {
			console.error(e)
		}

		request.onsuccess = () => {
			const db = request.result
			const transaction = db.transaction("notes", "readwrite")

			transaction.objectStore("notes").delete(Number($page.params.noteId))

			transaction.oncomplete = () => {
				goto("./")
				db.close()
			}
		}
	}

	function updateNote() {
		const request = indexedDB.open("NoteBlink", 1)

		request.onerror = (e) => {
			console.log(e)
		}

		request.onsuccess = () => {
			const db = request.result
			const transaction = db.transaction("notes", "readwrite")

			const store = transaction.objectStore("notes")

			store.put({
				id: Number($page.params.noteId),
				content: noteMarkdown,
				day: Number($page.params.day),
				year: Number($page.params.year),
				month: Number($page.params.month),
				title: noteTitle
			})

			$refetchNotes.state = true
			$refetchNotes.title = noteTitle
			$refetchNotes.id = Number($page.params.noteId)

			transaction.oncomplete = () => {
				db.close()
			}
		}
	}
</script>

<svelte:head>
	<title>NoteBlink - {noteTitle}</title>
</svelte:head>

<Allnotes />
<div class="notepagecontent">
	<div class="upper">
		<Breadcrumbs {noteTitle} />
		<div class="noteActions">
			<button
				on:click={() => {
					state = "read"
				}}
				style:border={state == "read" ? "1px solid #999" : ""}
			>
				<Icon icon="ant-design:read-filled" />
				<p>Read</p>
			</button>
			<button
				on:click={async () => {
					state = "edit"
				}}
				style:border={state == "edit" ? "1px solid #999" : ""}
			>
				<Icon icon="material-symbols:edit" />
				<p>Edit</p>
			</button>
			<button on:click={deleteNote}>
				<Icon icon="mdi:bin" />
				<p>Delete</p>
			</button>
		</div>
	</div>
	{#if state == "read"}
		<div class="content">
			{@html noteHTML}
		</div>
	{:else}
		<div class="markdowncontent">
			<input type="text" bind:value={noteTitle} placeholder="Note title" on:input={updateNote} />
			<!-- svelte-ignore a11y-autofocus -->
			<textarea
				bind:value={noteMarkdown}
				autofocus
				placeholder="Note markdown"
				on:input={updateNote}
			/>
		</div>
	{/if}
</div>
