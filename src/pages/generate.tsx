import { type NextPage } from "next";
import clsx from "clsx";
import Head from "next/head";
import { Button, FormGroup, Input } from "~/component";
import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";

const shapes = ["square", "rounded", "circle"];

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

const styles = [
  "claymorphic",
  "3d rendered",
  "pixelated",
  "illustreated with color penciled",
];

const Generate: NextPage = () => {
  const [imagesUrl, setImagesUrl] = useState<{ imageUrl: string }[]>([]);

  const [form, setForm] = useState({
    prompt: "",
    color: "",
    numberOfIcons: "1",
    shape: "",
    style: "",
  });

  const [error, setError] = useState("");

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      setImagesUrl(data);
    },
    onError(error) {
      setError(error.message);
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
    setError("");
    await generateIcon.mutateAsync({
      ...form,
      numberOfIcons: parseInt(form.numberOfIcons),
    });
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
            <Input
              required
              value={form.prompt}
              onChange={updateForm("prompt")}
            />
          </FormGroup>
          <h2 className="text-xl">2. Pick your icon color</h2>
          <FormGroup className="mb-12 grid grid-cols-4">
            {colors.map((color) => (
              <label key={color} className="flex gap-2 text-xl">
                <input
                  required
                  type="radio"
                  name="color"
                  checked={color === form.color}
                  onChange={updateForm("color")}
                  value={color}
                />
                {color}
              </label>
            ))}
          </FormGroup>
          <h2 className="text-xl">3. Pick your icon shape</h2>
          <FormGroup className="mb-12 grid grid-cols-4">
            {shapes.map((shape) => (
              <label key={shape} className="flex gap-2 text-xl">
                <input
                  required
                  type="radio"
                  name="shape"
                  checked={shape === form.shape}
                  onChange={updateForm("shape")}
                  value={shape}
                />
                {shape}
              </label>
            ))}
          </FormGroup>
          <h2 className="text-xl">4. Pick your icon style</h2>
          <FormGroup className="mb-12 grid grid-cols-4">
            {styles.map((style) => (
              <label key={style} className="flex gap-2 text-xl">
                <input
                  required
                  type="radio"
                  name="style"
                  checked={style === form.style}
                  onChange={updateForm("style")}
                  value={style}
                />
                {style}
              </label>
            ))}
          </FormGroup>

          <h2 className="text-xl">5. How many do you want?</h2>
          <FormGroup className="mb-12">
            <label className="flex gap-2 text-xl">
              How many icons do you want to generate in a single batch?
            </label>
            <Input
              required
              value={form.numberOfIcons}
              onChange={updateForm("numberOfIcons")}
              inputMode="numeric"
              pattern="[1-9]|10"
            />
          </FormGroup>
          {error && (
            <div className="bg-red-500 p-8 text-lg text-white">{error}</div>
          )}
          <Button
            isLoading={generateIcon.isLoading}
            disabled={generateIcon.isLoading}
            type="submit"
          >
            Submit
          </Button>
        </form>
        <h2 className="text-xl">Your icons</h2>
        <section className="mb-12 grid grid-cols-4 gap-4">
          {imagesUrl.length > 0 &&
            imagesUrl.map(({ imageUrl }) => (
              <>
                <Image
                  key={imageUrl}
                  width={512}
                  height={512}
                  alt="An image of generated prompt"
                  src={imageUrl}
                  className="mb-12 w-full"
                />
              </>
            ))}
        </section>
      </main>
    </>
  );
};

export default Generate;
