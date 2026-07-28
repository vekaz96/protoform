"use client";
import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("3D modeling & CAD engineering");
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${name}\r\nEmail: ${email}\r\nType: ${type}\r\n\r\n${msg}`;
    window.location.href = `mailto:hello@protoform.example?subject=${encodeURIComponent(
      "Project request — " + type
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="reveal" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="type">What do you need?</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option>3D modeling &amp; CAD engineering</option>
          <option>Simulation &amp; DFM</option>
          <option>3D printing &amp; prototyping</option>
          <option>Reverse engineering / spare part</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="msg">Project details</label>
        <textarea id="msg" placeholder="Describe the part, quantities, materials, deadline…" value={msg} onChange={(e) => setMsg(e.target.value)} />
      </div>
      <button type="submit" className="btn btn--big" style={{ marginTop: ".4rem" }}>
        Send request
      </button>
      <p className="form-note">This form opens your email client with the details pre-filled.</p>
    </form>
  );
}
