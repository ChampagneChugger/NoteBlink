<script lang="ts">
	import { page } from "$app/stores"
	import "$lib/css/main.css"
</script>

<div class="error">
	<h1>{$page.status} / {$page.error?.message}</h1>
	<a href="/">Home</a>
</div>

<style>
	:global(body) {
		background-color: #010101;
	}

	.error {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 30px;
	}

	h1 {
		color: white;
	}

	a {
		font-size: 15px;
		background-color: transparent;
		border: 1px solid white;
		color: white;
		padding: 10px 30px;
		cursor: pointer;
		text-decoration: none;
	}
</style>
