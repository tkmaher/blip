"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function buildURL(params: Record<string, string> = {}) {
    const url = new URL("https://blip-worker.tomaszkkmaher.workers.dev/");
    Object.entries(params).forEach(([k, v]) =>
        url.searchParams.set(k, v)
    );
    return url.toString();
}

export function EmailPoster(props: {admin: boolean}) {
    const admin = props.admin;

    const [email, updateEmail]  = useState("");
    const [parsing, setParsing] = useState(false);

    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = async (e: any) => {
        if (!admin) e.preventDefault();
        setParsing(true);
        try {
            const response = await fetch(
                buildURL({
                    data: "mailinglist",
                }),
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({"email": email}),
                }
            );
            if (!response.ok) throw new Error("Update failed");
            console.log("response:", response);
        } catch (err) {
            console.error(err);
        }
        updateEmail("");
        setParsing(false);
    };

    const spacer = "\u00A0";

    return (
        <>
            {admin ?
                <form id="form" ref={formRef} onSubmit={handleSubmit}>
                    <input type="email" placeholder="Add email..." required 
                        value={email}
                        name="email"
                        
                        onChange={(e) => updateEmail(e.target.value)}
                    />
                    <span><button type="submit">{parsing ? "Adding..." : "Add"}</button></span>
                </form>
                :
                <form ref={formRef} onSubmit={handleSubmit}>       
                    {spacer}
                    <input type="email" placeholder="Your email" required 
                        value={email}
                        name="email"
                        style={{textAlign: "right"}}
                        onChange={(e) => updateEmail(e.target.value)}
                    />
                    <br/>
                    <button type="submit">{parsing ? "Submitting..." : "Subscribe"}</button>
                </form>
            }
        </>
    )
}

export default function EditPage() {
    const [emails, setEmails] = useState<string[]>([]);
    const [info, setInfo] = useState("");
    const [error, setError] = useState(false);

    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const BASE_URL = "https://blip-worker.tomaszkkmaher.workers.dev/?data=info";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch info
                let response = await fetch(buildURL({ data: "info" }));
                if (!response.ok) throw new Error("Info fetch failed");
                let jsonData = await response.json();

                setInfo(jsonData.info || "");

                // 🔐 auto-login if password exists
                const storedPassword = localStorage.getItem("adminPassword");
                if (storedPassword) {
                    const loginRes = await fetch(
                        buildURL({ data: "login", password: storedPassword }),
                        { method: "POST" }
                    );

                    if (loginRes.ok) {
                        setLoggedIn(true);
                        setError(false);
                    } else {
                        localStorage.removeItem("adminPassword");
                        setLoggedIn(false);
                    }
                }
                
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(true);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(buildURL({ data: "mailinglist", password: localStorage.getItem("adminPassword") || "" }));
                if (!response.ok) throw new Error("Email fetch failed");
                const jsonData = await response.json();
                setEmails(jsonData.mailinglist || []);
                console.log("Fetched emails:", jsonData);
            } catch (err) {
                console.error("Error fetching emails:", err);
                setError(true);
            }
        };
        if (loggedIn) {
            fetchData();
        }
        document.body.style.opacity = "1";
    }, [loggedIn]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();


        try {
            const response = await fetch(
                buildURL({
                    data: "info",
                    password: localStorage.getItem("adminPassword") || "",
                }),
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({"info": info}),
                }
            );

            if (!response.ok) throw new Error("Update failed");
            console.log("response:", response);
            alert("Information section update successfully.");
        } catch (err) {
            console.error(err);
            alert("Error updating information section.");
        }
    };

    async function handleDelete(email: string) {
        try {
            const response = await fetch(
                buildURL({
                    data: "mailinglist",
                    password: localStorage.getItem("adminPassword") || "",
                    email: email,
                }),
                { method: "DELETE" }
            );

            if (!response.ok) throw new Error("Delete failed");
            
        } catch (err) {
            console.error(err);
            alert("Error deleting email.");
        }
    }

    const login = async (e: any) => {
        e.preventDefault();

        try {
            const response = await fetch(
                buildURL({ data: "login", password: password }),
                { method: "POST" }
            );

            if (!response.ok) {
                setLoggedIn(false);
                localStorage.removeItem("adminPassword");
            } else {
                localStorage.setItem("adminPassword", password);
                setPassword("");
                setLoggedIn(true);
                setError(false);
            }

        } catch (err) {
            console.error("Login error:", err);
            alert("Login failed.");
        }
    };


    return (
        <div>
            {!loggedIn && (
                <form onSubmit={login}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            )}

            {error ? (
                <div>Error fetching data!</div>
            ) : (
                loggedIn && (
                    <>
                        <h2>Information Section</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={info}
                                onChange={(e) => setInfo(e.target.value)}
                                style={{ width: "100%", height: 200 }}
                                placeholder="(Supports Markdown)"
                            />
                            <button type="submit">Save changes</button>
                        </form>
                        

                        <hr/>

                        <h2>Mailing List</h2>

                        {emails.map((email, index) => (
                            <div key={index}>
                                {email}
                                <a style={{float: "right", cursor: "pointer"}} onClick={() => {
                                    const updatedEmails = emails.filter((_, i) => i !== index);
                                    setEmails(updatedEmails);
                                    handleDelete(email);
                                }}>Delete</a>
                            </div>
                        ))}

                        {emails.length === 0 && <em>No emails in the mailing list.</em>}

                        <EmailPoster admin={true}/>
                    </>
                )
            )}
            <hr/>
            <Link href="/">Home</Link>

        </div>
    );
}
