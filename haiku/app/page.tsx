"use client";
import { verifyHaiku } from "@/app/lib/verifyHaiku";
import { useEffect, useState } from "react";
import { AnimatedTextAreaWrapper } from "@/app/components/AnimatedTextAreaWrapper";

export default function Home() {
  const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
  const [haiku, setHaiku] = useState(url?.searchParams.get('haiku') ?? "");
  const [errors, setErrors] = useState<string[] | null>(["1", "2", "3", "4"]);

  useEffect(() => {
    haiku && setErrors(verifyHaiku(haiku));
    if (url && typeof window !== "undefined") {
      url.searchParams.set('haiku', haiku);
      const newUrl = `${url.origin}${url.pathname}?${url.searchParams.toString()}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }, [haiku]);

  const handleChange = (event: any) => {
    const { value } = event.target;
    setHaiku(value);
  };

  return (
    <div className={"bg-slate-900 text-white h-screen pt-12"}>
      <h1 className={"text-4xl text-center"}>Haiku Validator</h1>
      <div className={"flex justify-center pt-12"}>
        <AnimatedTextAreaWrapper haiku={haiku} onChange={handleChange} />
      </div>
      <div className={"flex justify-center mt-12"}>
        <div
          className={
            "rounded-[calc(1.5rem-1px)] p-px bg-gradient-to-tr from-blue-400 to-cyan-500"
          }
        >
          <div
            className={
              "rounded-[calc(1.5rem-1px)] p-10 bg-gradient-to-tr from-blue-900 to-cyan-900"
            }
          >
            <ul>
              <li>
                Haiku has three lines {errors?.includes("1") ? "🚫" : "✅"}
              </li>
              <li>
                First line has five syllables{" "}
                {errors?.includes("2") ? "🚫" : "✅"}
              </li>
              <li>
                Second line has seven syllables{" "}
                {errors?.includes("3") ? "🚫" : "✅"}
              </li>
              <li>
                Third line has five syllables
                {errors?.includes("4") ? "🚫" : "✅"}
              </li>
              <li>Haiku is valid {errors?.includes("5") ? "✅" : "🚫"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
