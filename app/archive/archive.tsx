"use client";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { useState, useEffect } from "react";

export default function Archive(props: {style?: React.CSSProperties}) {

    const APIroute = "https://api.are.na/v2/channels/blip-yk9p67lhrbe";
    const [urls, setUrls] = useState<string[]>([]);

    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const response = await fetch(APIroute);
                if (!response.ok) throw new Error("Failed to fetch archive URLs");
                const data = await response.json();
                let tmp: string[] = [];
                data.contents.forEach((item: {image: { display: {url: string}}}) => {
                    tmp.push(item.image.display.url);
                });
                console.log("Fetched archive URLs:", tmp);
                setUrls(tmp);
            } catch (error) {
                console.error("Error fetching archive URLs:", error);
            }
        };

        fetchUrls();
    }, []);

    return (
           
            <div className="archive-page" id="archive-target" style={props.style}>
                {urls.map((url, index) => (
                    <div key={index}>
                        <img src={url}/>

                        <img src={url} />
                    </div >
                ))}
            </div>

    )
}