<script lang="ts">
	import { onMount } from "svelte"
	import { monthAndYear } from "$lib/stores/yearandmonth"

	const date: Date = new Date()

	let currentYear: number = date.getFullYear()
	let currentMonth: number = date.getMonth() + 1
	let currentDay: number = date.getDate()

	let year: number = date.getFullYear()
	let month: number = date.getMonth() + 1

	function getCalendar(year: number, month: number) {
		return {
			days: new Date(year, month, 0).getDate(),
			year,
			month
		}
	}

	function getDayName(year: number, month: number, day: number) {
		let date: Date = new Date(year, month - 1, day)

		console.log(date)

		return date.toLocaleDateString("default", { weekday: "long" })
	}

	onMount(() => {
		document.addEventListener("wheel", (e: WheelEvent) => {
			if (e.deltaY > 0) {
				if (month >= 12) {
					month = 1
					year++
				} else {
					month++
				}
			} else {
				if (month <= 1) {
					month = 12
					year--
				} else {
					month--
				}
			}
		})
	})

	$: calendar = getCalendar(year, month)

	$: {
		year = year
		month = month
		$monthAndYear.month = month
		$monthAndYear.year = year
	}
</script>

<svelte:head>
	<title>NoteBlink - a note planning app</title>
</svelte:head>

<div class="calendar">
	{#each { length: calendar.days } as placeholder, index}
		{#if calendar.year == currentYear && calendar.month == currentMonth && index + 1 == currentDay}
			<a class="current" href="/{calendar.year}/{calendar.month}/{index + 1}">
				<div class="day">{index + 1}</div>
				<div class="dayName">
					{getDayName(calendar.year, calendar.month, index + 1)}
				</div>
			</a>
		{:else}
			<a href="/{calendar.year}/{calendar.month}/{index + 1}">
				<div class="day">{index + 1}</div>
				<div class="dayName">
					{getDayName(calendar.year, calendar.month, index + 1)}
				</div>
			</a>
		{/if}
	{/each}
</div>
