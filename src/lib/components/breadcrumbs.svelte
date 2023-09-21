<script lang="ts">
	import { page } from "$app/stores"
	import Icon from "@iconify/svelte"
</script>

<div class="breadcrumbs">
	<a href="/">Home</a>
	<Icon icon="mingcute:right-line" />
	<a href={$page.url.pathname}>{$page.params.year}/{$page.params.month}/{$page.params.day}</a>
</div>
