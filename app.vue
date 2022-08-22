<template>
  <div class="container mx-auto">
    <div class="flex w-full justify-center py-4">
      <nav class="inline-flex rounded" aria-label="pagination">
        <button
          v-for="pageNumber in totalPages"
          :key="pageNumber"
          @click="setPage(pageNumber)"
          class="mx-1 rounded bg-gray-300 p-1 px-3 text-sm hover:bg-gray-400"
          :class="{ 'bg-gray-400': pageNumber === currentPage }"
        >
          <span>{{ pageNumber }}</span>
        </button>
      </nav>
    </div>
    <div class="container">
      <div class="w-100 flex flex-col justify-center px-20">
        <div>
          <StoryCard
            v-for="story in storiesWithData"
            :key="story.id"
            :data="story"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const { query } = useRoute()
const { get } = useStoryblokAuth(query.space_id as string)

onMounted(async () => {
  if (window.top == window.self) {
    window.location.assign('https://app.storyblok.com/oauth/app_redirect')
  } else {
    await setPage(1)
  }
})

const storiesWithData = ref([])
const pageSize = 10 // stories per page
const currentPage = ref(1) // currentPage page
const totalStories = ref(null) // all stories

const totalPages = computed(() => Math.ceil(totalStories.value / pageSize))

const setPage = async (pageNumber) => {
  currentPage.value = pageNumber
  const { stories, total } = await get(pageSize, currentPage.value)
  totalStories.value = total
  storiesWithData.value = stories
}
</script>
