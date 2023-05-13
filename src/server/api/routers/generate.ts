import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
import { base64 } from "data/base64";
import AWS from "aws-sdk";

const S3_BUCKET_NAME = "icon-generator-app";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: "eu-west-2",
});

const configuration = new Configuration({
  apiKey: env.DALLE_API_KEY,
});

async function generateIcon(prompt: string): Promise<string | undefined> {
  if (env.MOCK_DALLE === "true") {
    return base64;
  } else {
    // API request
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });
    return response.data.data[0]?.b64_json;
  }
}
const openai = new OpenAIApi(configuration);

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        color: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Verify that user has enough credits
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id, // TODO: user id
          credits: {
            gte: 1,
          },
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You don't have enough credits",
        });
      }

      const finalPrompt = `a modern icon in ${input.color} of a ${input.prompt}, 3d rendered, metallic material, shiny, minimialistic`;

      const base64EncodedImage = await generateIcon(finalPrompt);

      const icon = await ctx.prisma.icon.create({
        data: {
          prompt: input.prompt,
          userId: ctx.session.user.id,
        },
      });

      await s3
        .putObject({
          Bucket: S3_BUCKET_NAME,
          Body: Buffer.from(base64EncodedImage!, "base64"),
          Key: icon.id,
          ContentEncoding: "base64",
          ContentType: "image/png",
        })
        .promise();

      // Save image to S3 bucket

      return {
        imageUrl: `https://${S3_BUCKET_NAME}.s3.eu-west-2.amazonaws.com/${icon.id}`,
      };
    }),
});
