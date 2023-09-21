<script lang="ts">
	import { page } from "$app/stores"
	import Breadcrumbs from "$lib/components/breadcrumbs.svelte"
	import { tilt } from "$lib/actions/tilt"
</script>

<svelte:head>
	<title>NoteBlink - {$page.params.year}/{$page.params.month}/{$page.params.day}</title>
</svelte:head>

<div class="allnotes">
	<a href={$page.params.day + "/" + "sagaxasfgas"} use:tilt>SVELTEKIT NESTO</a>
</div>
<div class="notepagecontent">
	<Breadcrumbs />
</div>
