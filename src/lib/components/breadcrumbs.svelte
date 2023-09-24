<script lang="ts">
	import { page } from "$app/stores"
	import Icon from "@iconify/svelte"
	import { refetchNotes } from "$lib/stores/refetchNotes"

	export let noteTitle: string = ""

	$: if ($refetchNotes) {
		noteTitle = $refetchNotes.title
	}
</script>

<div class="breadcrumbs">
	<a href="/">Home</a>
	<Icon icon="mingcute:right-line" />
	<a href={`/${$page.params.year}/${$page.params.month}/${$page.params.day}`}
		>{$page.params.year}/{$page.params.month}/{$page.params.day}</a
	>
	{#if $page.params.noteId}
		<Icon icon="mingcute:right-line" />
		<a
			class="notet"
			href={`/${$page.params.year}/${$page.params.month}/${$page.params.day}/${$page.params.noteId}`}
			>{noteTitle != "" ? noteTitle : "Untitled"}</a
		>
	{/if}
</div>
