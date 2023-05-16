import { type NextPage } from "next";
import clsx from "clsx";
import Head from "next/head";
import { Button, FormGroup, Input } from "~/component";
import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";

const colors = [
  "blue",
  "red",
  "pink",
  "green",
  "orange",
  "yellow",
  "white",
  "black",
];

const Generate: NextPage = () => {
  const [imageUrl, setImageUrl] = useState("");

  const [form, setForm] = useState({
    prompt: "",
    color: "",
  });

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      if (!data.imageUrl) return;
      setImageUrl(data.imageUrl);
    },
  });

  function updateForm(key: string) {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  }

  async function onSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    await generateIcon.mutateAsync(form);
    setForm((prevForm) => ({ ...prevForm, prompt: "" }));
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-24 flex min-h-screen flex-col gap-4 px-8">
        <h1 className="text-6xl">Generate your icons</h1>
        <p className="mb-12 text-2xl">
          Fill out the form below to start generating the icons
        </p>
        <form onSubmit={onSubmit} className={clsx("flex flex-col gap-4")}>
          <h2 className="text-xl">
            1. Descripte what you want your icon to look like.
          </h2>
          <FormGroup className="mb-12">
            <label>Prompt</label>
            <Input value={form.prompt} onChange={updateForm("prompt")} />
          </FormGroup>
          <h2 className="text-xl">2. Pick your icon color</h2>
          <FormGroup className="mb-12 grid grid-cols-4">
            {colors.map((color) => (
              <label key={color} className="flex gap-2 text-xl">
                <input
                  type="radio"
                  name="color"
                  checked={color === form.color}
                  onChange={() => {
                    setForm((prev) => ({ ...prev, color }));
                  }}
                  value={color}
                />
                {color}
              </label>
            ))}
          </FormGroup>
          <Button
            isLoading={generateIcon.isLoading}
            disabled={generateIcon.isLoading}
            type="submit"
          >
            Submit
          </Button>
        </form>
        {!!imageUrl && (
          <>
            <h2 className="text-xl">Your icons</h2>
            <section className="grid grid-cols-4 gap-4">
              <Image
                width={200}
                height={200}
                alt="An image of generated prompt"
                src={imageUrl}
                className="mb-12 w-full"
              />
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default Generate;
