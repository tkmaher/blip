"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function Info() {

    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch("https://blip-worker.tomaszkkmaher.workers.dev/?data=info", { next: { revalidate: 3600 } })
        .then((res) => res.json())
        .then((data) => {
            setInfo(data.info);
            setLoading(false);
            
        }).catch(() => {
            setError(true); 
            setLoading(false);
        }).finally(() => {
            document.body.style.opacity = "1";
        });
    }, []);
    

    return (
        <div>
            <div className="info">
                {error && <p>Error loading info.</p>}
                {!loading && !error && <ReactMarkdown>{info}</ReactMarkdown>}

                
            </div>
        </div>
    )
}