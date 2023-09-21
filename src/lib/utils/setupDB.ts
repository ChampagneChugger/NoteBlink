export function setupDatabase() {
    const request = indexedDB.open("NoteBlink", 1)

    request.onerror = (err) => {
        console.error(err)
    }

    request.onupgradeneeded = () => {
        const db = request.result

        const store = db.createObjectStore("notes", {
            keyPath: "id"
        })

        store.createIndex("year-month-day", ["year", "month", "day"], {
            unique: false
        })

        store.createIndex("year-month", ["year", "month"], {
            unique: false
        })

        store.createIndex("year", "year", {
            unique: false
        })

        db.close()
    }
}