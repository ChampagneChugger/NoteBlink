<script lang="ts">
	import { page } from "$app/stores"
	import Breadcrumbs from "$lib/components/breadcrumbs.svelte"
	import Allnotes from "$lib/components/allnotes.svelte"
</script>

<svelte:head>
	<title>NoteBlink - {$page.params.year}/{$page.params.month}/{$page.params.day}</title>
</svelte:head>

<Allnotes />
<div class="notepagecontent">
	<Breadcrumbs />
</div>
