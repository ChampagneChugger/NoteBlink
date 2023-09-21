<script lang="ts">
	import { monthAndYear } from "$lib/stores/yearandmonth"

	let notes: any[] = []

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

		return date.toLocaleDateString("default", { weekday: "long" })
	}

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

	$: calendar = getCalendar(year, month)
	$: getMonthNotes(year, month)

	$: {
		year = year
		month = month
		$monthAndYear.month = month
		$monthAndYear.year = year
	}

	function getMonthNotes(year: number, month: number) {
		notes = []
		const request = indexedDB.open("NoteBlink", 1)

		request.onerror = (event) => {
			console.error(event)
		}

		request.onsuccess = () => {
			const db = request.result
			const transaction = db.transaction("notes", "readonly")

			const store = transaction.objectStore("notes")

			const year_month = store.index("year-month")

			const query = year_month.getAll([year, month])

			query.onsuccess = () => {
				notes.push(...query.result)
				notes = notes
			}

			transaction.oncomplete = () => {
				db.close()
			}
		}
	}

	function checkIfHasNote(day: number) {
		let amount: number = 0

		notes.forEach((item) => {
			if (item.day == day) {
				amount++
			}
		})

		return amount
	}
</script>

<svelte:head>
	<title>NoteBlink - a note taking app</title>
</svelte:head>

{#if notes.length > 0}
	<div class="calendar">
		{#each { length: calendar.days } as placeholder, index}
			{@const amount = checkIfHasNote(index + 1)}
			{#if calendar.year == currentYear && calendar.month == currentMonth && index + 1 == currentDay}
				<a class="current" href="/{calendar.year}/{calendar.month}/{index + 1}">
					<div class="day">{index + 1}</div>
					<div class="dayName">
						{getDayName(calendar.year, calendar.month, index + 1)}
					</div>
					<div class="dayNotes">
						{amount}
					</div>
				</a>
			{:else}
				<a href="/{calendar.year}/{calendar.month}/{index + 1}">
					<div class="day">{index + 1}</div>
					<div class="dayName">
						{getDayName(calendar.year, calendar.month, index + 1)}
					</div>
					<div class="dayNotes">
						{amount}
					</div>
				</a>
			{/if}
		{/each}
	</div>
{:else}
	<div class="calendar">
		{#each { length: calendar.days } as placeholder, index}
			{#if calendar.year == currentYear && calendar.month == currentMonth && index + 1 == currentDay}
				<a class="current" href="/{calendar.year}/{calendar.month}/{index + 1}">
					<div class="day">{index + 1}</div>
					<div class="dayName">
						{getDayName(calendar.year, calendar.month, index + 1)}
					</div>
					<div class="dayNotes">0</div>
				</a>
			{:else}
				<a href="/{calendar.year}/{calendar.month}/{index + 1}">
					<div class="day">{index + 1}</div>
					<div class="dayName">
						{getDayName(calendar.year, calendar.month, index + 1)}
					</div>
					<div class="dayNotes">0</div>
				</a>
			{/if}
		{/each}
	</div>
{/if}
