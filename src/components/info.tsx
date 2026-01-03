import { useState } from "react"

export default async function Info() {

    async function getInfo() {
        const res = await fetch('https://api.example.com/posts', { next: { revalidate: 3600 } }); // Caches data for 1 hour
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json();
    }
    
    const info = await getInfo();

    return (
        <></>
    )
}