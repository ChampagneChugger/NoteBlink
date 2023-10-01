<script lang="ts">
	import Icon from "@iconify/svelte"
	import { page } from "$app/stores"
	import { popup } from "$lib/stores/popup"

	const paths = [
		{ name: "Home", path: "/", icon: "material-symbols:home", type: "link" },
		{ name: "Import", path: "/import", icon: "mdi:import", type: "button" },
		{ name: "Export", path: "/export", icon: "ph:export", type: "button" }
	]

	type popupType = "export" | "import" | "sync" | undefined

	function showPopup(popup: string) {
		let popupEnum: popupType

		switch (popup.toLowerCase()) {
			case "export":
				popupEnum = "export"
				break
			case "import":
				popupEnum = "import"
				break
			case "sync":
				popupEnum = "sync"
				break
			default:
				popupEnum = undefined
				break
		}

		$popup = popupEnum
	}
</script>

{#each paths as { name, path, icon, type }}
	{@const active = $page.url.pathname == path ? "page" : null}
	{#if type == "link"}
		<a href={path} aria-current={active}>
			<Icon {icon} />
			{name}
		</a>
	{:else}
		<button on:click={() => showPopup(name)} class:activebutton={$popup == name.toLowerCase()}>
			<Icon {icon} />
			{name}
		</button>
	{/if}
{/each}
