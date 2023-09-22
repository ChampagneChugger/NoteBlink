<script lang="ts">
	import { page } from "$app/stores"
	import Breadcrumbs from "$lib/components/breadcrumbs.svelte"
	import Allnotes from "$lib/components/allnotes.svelte"
	import Icon from "@iconify/svelte"
	import type { Note } from "$lib/types/note"
	import { tick } from "svelte"

	let note: Note
	let editable: boolean = false
	let contentElement: HTMLDivElement

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
</script>

<svelte:head>
	<title>NoteBlink - {note?.title}</title>
</svelte:head>

<Allnotes />
<div class="notepagecontent">
	<Breadcrumbs noteTitle={note?.title} />
	<div class="noteActions">
		<button
			on:click={() => {
				editable = false
			}}
		>
			<Icon icon="ant-design:read-filled" />
			<p>Read</p>
		</button>
		<button
			on:click={async () => {
				editable = true
				await tick()
				contentElement.focus()
			}}
		>
			<Icon icon="material-symbols:edit" />
			<p>Edit</p>
		</button>
	</div>
	<div class="noteContent" contenteditable={editable} bind:this={contentElement}>
		{note?.content}
	</div>
</div>
