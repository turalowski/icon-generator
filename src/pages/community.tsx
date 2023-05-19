import { type NextPage } from "next";
import { type Icon } from "@prisma/client";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";

const Community: NextPage = () => {
  const icons = api.icons.getCommunityIcons.useQuery();
  return (
    <>
      <Head>
        <title>Your Icons</title>
        <meta name="description" content="Your Icons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-24 flex min-h-screen flex-col gap-4 px-8">
        <h1 className="text-4xl">Community icons</h1>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {icons.data?.map((icon: Icon) => (
            <li key={icon.id}>
              <Image
                className="w-full rounded-md"
                src={`https://icon-generator-app.s3.eu-west-2.amazonaws.com/${icon.id}`}
                alt={icon.prompt ?? "an image of an icon"}
                width="100"
                height="100"
              />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Community;
