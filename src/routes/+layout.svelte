<script lang="ts">
	import { setupDatabase } from "$lib/utils/setupDB"
	import { popup } from "$lib/stores/popup"
	import { fade } from "svelte/transition"
	import { onNavigate } from "$app/navigation"
	import { tilt } from "$lib/actions/tilt"
	import Icon from "@iconify/svelte"
	import { refetchAllNotes } from "$lib/stores/refetchAllNotes"

	let dataJSON: string
	let importDataJSON: []
	let state: State = null
	let uploadElement: HTMLInputElement
	let uploadMessage: string = "Click or drag and drop to upload your notes."

	type Note = {
		id: number
		content: string
		day: number
		month: number
		title: string
		year: number
	}

	type State = "uploading" | "uploaded" | "error" | "imported" | null

	setupDatabase()

	onNavigate(() => {
		$popup = undefined
		state = null
		uploadMessage = "Click or drag and drop to upload your notes."
	})

	$: if (!$popup) {
		state = null
		uploadMessage = "Click or drag and drop to upload your notes."
	}

	function exportDB() {
		$popup = "exporting"

		const request = indexedDB.open("NoteBlink", 1)

		request.onerror = (e) => {
			console.error(e)
		}

		request.onsuccess = () => {
			const db = request.result
			const transaction = db.transaction("notes", "readwrite")

			const store = transaction.objectStore("notes")
			const dataToExport: Note[] = []

			store.openCursor().onsuccess = (e) => {
				//@ts-expect-error
				const cursor = e.target?.result

				if (cursor) {
					dataToExport.push(cursor.value)
					cursor.continue()
				}
			}

			transaction.oncomplete = () => {
				dataJSON = JSON.stringify(dataToExport)
				db.close()
			}
		}

		$popup = "exported"
	}

	function download() {
		const blob = new Blob([dataJSON], {
			type: "application/json"
		})

		const a = document.createElement("a")
		a.href = URL.createObjectURL(blob)
		a.download = "exported-notes.json"
		a.click()
		a.remove()
	}

	function handleUpload() {
		const files = uploadElement.files

		const fileTypes = ["application/json"]

		function validFileType(file: File) {
			return fileTypes.includes(file.type)
		}

		if (files) {
			state = "uploading"
			uploadMessage = "Uploading..."
			for (const file of files) {
				if (validFileType(file)) {
					const reader = new FileReader()

					reader.onload = (e) => {
						if (e.target) {
							//@ts-expect-error
							importDataJSON = JSON.parse(e.target.result)
						}
					}

					reader.readAsText(file)
					state = "uploaded"
					uploadMessage = "Successfully uploaded your notes."
				} else {
					state = "error"
					uploadMessage = "This is not a notes JSON file."
				}
			}
		}

		uploadElement.value = ""
	}

	function importToDatabase() {
		const request = indexedDB.open("NoteBlink", 1)

		request.onerror = (e) => {
			console.error(e)
		}

		request.onsuccess = () => {
			const db = request.result
			const transaction = db.transaction("notes", "readwrite")

			const store = transaction.objectStore("notes")

			importDataJSON.forEach((note) => {
				store.put(note)
			})

			transaction.oncomplete = () => {
				state = "imported"
				uploadMessage = "Your notes have been imported."
				$refetchAllNotes = true

				db.close()
			}
		}
	}
</script>

<slot />

{#if $popup}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="popup"
		transition:fade={{ duration: 150 }}
		on:click|self={() => {
			$popup = undefined
		}}
	>
		{#if $popup == "export"}
			<div class="export">
				<h1>Are you sure you want to export?</h1>
				<div class="exportoptions">
					<button
						on:click={() => {
							$popup = undefined
						}}
						use:tilt>Cancel</button
					>
					<button use:tilt on:click={exportDB}>Continue</button>
				</div>
			</div>
		{/if}
		{#if $popup == "exporting"}
			<div class="export">
				<h1>Exporting...</h1>
				<Icon icon="line-md:loading-twotone-loop" />
				<div class="exportoptions exportoptionssolo">
					<button
						on:click={() => {
							$popup = undefined
						}}
						use:tilt>Cancel</button
					>
				</div>
			</div>
		{/if}
		{#if $popup == "exported"}
			<div class="export">
				<h1>Your notes have been exported.</h1>
				<div class="exportoptions">
					<button
						on:click={() => {
							$popup = undefined
						}}
						use:tilt>Close</button
					>
					<button use:tilt on:click={download}>Download</button>
				</div>
			</div>
		{/if}
		{#if $popup == "import"}
			<div class="export">
				<h1>Upload your notes.</h1>
				<div
					class="upload"
					on:click={() => {
						uploadElement.click()
					}}
				>
					<Icon
						icon={state == null
							? "material-symbols:upload"
							: state == "uploaded" || state == "imported"
							? "carbon:checkmark"
							: state == "error"
							? "ph:x"
							: "line-md:uploading-loop"}
					/>
					<p>{uploadMessage}</p>
				</div>
				<div class="exportoptions" class:exportoptionssolo={state != "uploaded"}>
					<button
						on:click={() => {
							$popup = undefined
						}}
						use:tilt>Close</button
					>
					{#if state == "uploaded"}
						<button on:click={importToDatabase} use:tilt>Import</button>
					{/if}
				</div>
			</div>
			<input hidden type="file" bind:this={uploadElement} on:change={handleUpload} accept=".json" />
		{/if}
	</div>
{/if}
