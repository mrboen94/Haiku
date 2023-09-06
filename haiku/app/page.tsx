"use client";
import { verifyHaiku } from "@/app/lib/verifyHaiku";
import { useEffect, useState } from "react";
import HaikuTextField from "@/app/components/HaikuTextField";
import MyAnimatedTextarea from "@/app/components/HaikuTextField";

export default function Home() {
  const [haiku, setHaiku] = useState("");
  const [errors, setErrors] = useState<string[] | null>([]);

  useEffect(() => {
    haiku && setErrors(verifyHaiku(haiku));
  }, [haiku]);

  const handleChange = (event: any) => {
    const { value } = event.target;
    setHaiku(value);
  };

  return (
    <div>
      <h1>Haiku Verification</h1>
      <form>
        <MyAnimatedTextarea />
        <textarea
          id="haikuTextArea"
          rows={5}
          cols={50}
          value={haiku}
          onChange={handleChange}
        />
        <br />
        <ul id="errorList">
          {errors?.map((error, index) => <li key={index}>{error}</li>)}
        </ul>
      </form>
      {errors?.length === 0 && <p>Haiku is valid!</p>}
      {errors?.length === 1 && <p>Haiku is invalid!</p>}
      {errors?.length && errors.length > 1 && <p>Haiku is invalid!</p>}
      {errors?.length && errors.length > 0 && <p>{errors}</p>}
    </div>
  );
}
