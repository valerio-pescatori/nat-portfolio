"use client";
import Form from "next/form";
import { redirect } from "next/navigation";
import { FormEventHandler, useEffect, useRef, useState } from "react";

export default function BookASession() {
  const [value, setValue] = useState("");

  const action: FormEventHandler<HTMLFormElement> = () => {
    const encodedText = encodeURI(value);
    redirect(`https://wa.me/393207528036?text=${encodedText}`);
  };

  return (
    <section className="flex flex-col text-3xl gap-4">
      <h1 className="text-7xl">Book a session</h1>
      <span>
        Raccontami la tua idea qui sotto e premi il tasto invia: avvierai direttamente una conversazione con me tramite
        Whatsapp
      </span>
      <Form onSubmit={action} action="" className="flex flex-col text-3xl gap-4">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="text"
          className="border border-detail p-2 rounded bg-white/50 font-inter text-base"
          rows={5}
        ></textarea>
        <button
          type="submit"
          disabled={!value}
          className="mt-2 py-4 border rounded-full bg-primary border-detail shadow-lg disabled:opacity-50"
        >
          Contattami
        </button>
      </Form>
    </section>
  );
}
