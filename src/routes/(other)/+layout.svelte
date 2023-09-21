<script lang="ts">
	import "$lib/css/main.css"
	import Navigation from "$lib/components/navigation.svelte"
</script>

<div class="container">
	<aside>
		<Navigation />
	</aside>
	<main>
		<slot />
	</main>
</div>

<style>
	main {
		grid-template-rows: auto;
		height: 100%;
	}
</style>
