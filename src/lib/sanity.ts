import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'i8fwa4mk',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
