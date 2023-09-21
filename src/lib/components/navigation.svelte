<script lang="ts">
	import Icon from "@iconify/svelte"
	import { page } from "$app/stores"

	const paths = [
		{ name: "Home", path: "/", icon: "material-symbols:home" },
		{ name: "Import", path: "/import", icon: "mdi:import" }
	]
</script>

{#each paths as { name, path, icon }}
	{@const active = $page.url.pathname == path ? "page" : null}
	<a href={path} aria-current={active}>
		<Icon {icon} />
		{name}
	</a>
{/each}
