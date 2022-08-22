import { StoryData } from '@storyblok/js'
import axios from 'axios'

interface StoryblokAuthModule {
  get: (perPage: number, curentPage: number) => Promise<any>
  save: (data: StoryData, publish: boolean) => Promise<StoryData | null>
}

export function useStoryblokAuth(spaceId: string): StoryblokAuthModule {
  const get = async (perPage: number, curentPage: number) => {
    const pageTypes = ['page', 'blog', 'project']
    const parameters = [
      `per_page=${perPage}`,
      `page=${curentPage}`,
      `sort_by=name:asc`,
      `filter_query[component][in]=${pageTypes.join(',')}`,
    ]

    const res = await axios.get(
      `/auth/spaces/${spaceId}/stories?${parameters.join('&')}`
    )
    const stories: StoryData[] = []

    await useAsyncForEach(res.data.stories, async (story: StoryData) => {
      await axios
        .get(`/auth/spaces/${spaceId}/stories/${story.id}`)
        .then((res) => {
          if (!res.data.story.content.seo) {
            res.data.story.content.seo = {
              title: '',
              description: '',
              plugin: 'seo_metatags',
            }
          }
          stories.push(res.data.story)
        })
        .catch((error) => {
          console.log(error)
        })
    })

    return { stories, total: res.data.total }
  }

  const save = async (story: StoryData, publish: boolean) => {
    let storyData = {
      story: { content: story.content, unpublished_changes: !publish },
      publish: -1,
    }

    if (publish) {
      storyData.publish = 1
    }

    try {
      const rest = await axios.put(
        `/auth/spaces/${spaceId}/stories/${story.id}`,
        storyData
      )
      if (rest.status === 200) {
        return rest.data.story
      }
    } catch (err) {
      console.log(err, 'error')

      return null
    }
  }

  return {
    get,
    save,
  }
}
