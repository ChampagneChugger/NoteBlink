<script lang="ts">
	import "$lib/css/main.css"
	import Navigation from "$lib/components/navigation.svelte"
	import Header from "$lib/components/header.svelte"
</script>

<div class="container">
	<aside>
		<Navigation />
	</aside>
	<main>
		<Header />
		<slot />
	</main>
</div>
