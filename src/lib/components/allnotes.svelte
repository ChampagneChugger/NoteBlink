<script lang="ts">
	import { goto } from "$app/navigation"
	import { page } from "$app/stores"
	import { tilt } from "$lib/actions/tilt"
	import Icon from "@iconify/svelte"
	import { refetchNotes } from "$lib/stores/refetchNotes"
	import { refetchAllNotes } from "$lib/stores/refetchAllNotes"

	let notes: any[] = []

	type Loading = "loading" | "loaded"

	let loading: Loading = "loading"

	function getNotes(year: number, month: number, day: number) {
		notes = []

		const request = indexedDB.open("NoteBlink", 1)

		request.onerror = (event) => {
			console.error(event)
		}

		request.onsuccess = () => {
			const db = request.result
			const transaction = db.transaction("notes", "readonly")

			const store = transaction.objectStore("notes")

			const year_month = store.index("year-month-day")

			const query = year_month.getAll([year, month, day])

			query.onsuccess = () => {
				notes.push(...query.result.reverse())
				notes = notes
			}

			transaction.oncomplete = () => {
				db.close()
			}

			loading = "loaded"
		}
	}

	$: getNotes(Number($page.params.year), Number($page.params.month), Number($page.params.day))

	function createNote() {
		const request = indexedDB.open("NoteBlink", 1)

		request.onerror = (e) => {
			console.error(e)
		}

		request.onsuccess = () => {
			const db = request.result
			const transaction = db.transaction("notes", "readwrite")

			const store = transaction.objectStore("notes")

			const storeCount = store.openCursor(null, "prev")

			let lastIndex: number

			storeCount.onsuccess = (e) => {
				//@ts-expect-error
				const cursor = e.target.result

				if (cursor) {
					lastIndex = cursor.value.id

					store.put({
						id: lastIndex + 1,
						title: "Untitled",
						year: Number($page.params.year),
						month: Number($page.params.month),
						day: Number($page.params.day),
						content: ""
					})
				} else {
					lastIndex = 0

					store.put({
						id: 1,
						title: "Untitled",
						year: Number($page.params.year),
						month: Number($page.params.month),
						day: Number($page.params.day),
						content: ""
					})
				}
			}

			transaction.oncomplete = () => {
				db.close()

				console.log(lastIndex + 1)
				goto(`/${$page.params.year}/${$page.params.month}/${$page.params.day}/${lastIndex + 1}`)
			}
		}
	}

	$: if ($refetchNotes.state) {
		notes.forEach((note) => {
			if (note.id == $refetchNotes.id) {
				note.title = $refetchNotes.title
			}
		})

		notes = notes

		$refetchNotes.state = false
	}

	$: if ($refetchAllNotes) {
		getNotes(Number($page.params.year), Number($page.params.month), Number($page.params.day))
		$refetchAllNotes = false
	}
</script>

<div class="allnotes">
	{#if loading == "loading"}
		<p><Icon icon="line-md:loading-twotone-loop" /></p>
	{:else if notes.length > 0}
		<button on:click={createNote} use:tilt>Add note</button>
		{#each notes as { id, title }}
			<a
				href={"/" +
					$page.params.year +
					"/" +
					$page.params.month +
					"/" +
					$page.params.day +
					"/" +
					id}
				use:tilt
				style:border={$page.params.noteId == id ? "1px solid #999" : ""}
			>
				{title != "" ? title : "Untitled"}
			</a>
		{/each}
	{:else}
		<button on:click={createNote} use:tilt>Add note</button>
	{/if}
</div>
