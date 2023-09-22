<script lang="ts">
	import { page } from "$app/stores"
	import { tilt } from "$lib/actions/tilt"
	import Icon from "@iconify/svelte"

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
</script>

<div class="allnotes">
	{#if loading == "loading"}
		<p><Icon icon="line-md:loading-twotone-loop" /></p>
	{:else if notes.length > 0}
		{#each notes as { id, title, color }}
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
				style:border={`1px solid ${color}`}
			>
				{title}
			</a>
		{/each}
	{:else}
		<p>No notes.</p>
	{/if}
</div>
