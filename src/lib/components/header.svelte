<script lang="ts">
	import { monthAndYear } from "$lib/stores/yearandmonth"

	$: monthString = new Date($monthAndYear.year, $monthAndYear.month - 1).toLocaleString("default", {
		month: "long"
	})
</script>

<header>
	<h1>{$monthAndYear.year}, {monthString}</h1>
</header>
