import Prismisc from '@prismicio/client'

export const repositoryName = process.env.PRISMIC_ENDPOINT;

export function getPrismicClient(req?: unknown) {
  const prismic = Prismisc.client(process.env.PRISMIC_ENDPOINT, {
    req: req,
    accessToken: process.env.PRISMISC_ACCESS_TOKEN
  })

  return prismic
}