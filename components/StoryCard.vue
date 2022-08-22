<template>
  <div class="container mx-auto my-10">
    <div
      :key="story.id"
      v-if="story && story.content"
      class="my-2 mx-2 rounded bg-white py-4 px-6 shadow-md"
    >
      <div class="flex justify-between">
        <div class="text-md block font-bold text-gray-800">
          Story name: "{{ story.name }}"
        </div>
        <div class="rounded bg-gray-300 p-1 px-3 text-sm">
          {{ story.published ? 'Published story' : 'Unpublished story'
          }}{{ story.unpublished_changes ? ' with unpublished changes' : '' }}
        </div>
      </div>
      <div>
        <label
          class="mb-2 mt-5 block text-sm font-bold text-gray-800"
          for="title"
          >Meta Title</label
        >
        <input
          type="text"
          v-model="story.content.seo.title"
          class="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          id="name"
        />
      </div>
      <div>
        <label
          class="mb-2 mt-5 block text-sm font-bold text-gray-800"
          for="description"
          >Meta Description</label
        >
        <textarea
          type="text"
          v-model="story.content.seo.description"
          class="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          id="name"
        />
      </div>

      <div v-if="changed" class="mt-2 bg-green-700">
        <div class="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
          <p class="ml-3 w-full text-right font-medium text-white">
            Changes Saved
          </p>
        </div>
      </div>

      <div v-if="!changed" class="mt-4 flex justify-end">
        <button
          class="mx-2 rounded bg-gray-800 py-2 px-4 text-gray-100 hover:bg-blue-900"
          @click="saveStoryData()"
        >
          Save Draft
        </button>
        <button
          class="mx-2 rounded bg-gray-800 py-2 px-4 text-gray-100 hover:bg-blue-900"
          @click="saveStoryData(true)"
        >
          Publish
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StoryData } from '@storyblok/js'
import { PropType } from 'vue'

const { query } = useRoute()
const { save } = useStoryblokAuth(query.space_id as string)

const props = defineProps({
  data: {
    type: Object as PropType<StoryData>,
  },
})

const story = ref(props.data)
const changed = ref(false)

const saveStoryData = async (publish: boolean) => {
  const newStory = await save(story.value, publish)

  if (newStory) {
    story.value = newStory
    changed.value = true
    setTimeout(() => {
      changed.value = false
    }, 2000)
  }
}
</script>
