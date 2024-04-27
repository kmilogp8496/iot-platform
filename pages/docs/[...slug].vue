<template>
  <div class="pb-4">
    <ContentDoc
      class="page-content"
    >
      <template #not-found>
        No encontrado!
      </template>
    </ContentDoc>
  </div>
</template>

<style>
.page-content {
  h1,h2,h3,h4,h5,h6 {
    @apply mb-2;
  }

  h2,h3,h4,h5,h6 {
    @apply mt-4;
  }

  h1 {
    @apply text-4xl font-semibold;
  }

  h2 {
    @apply text-3xl font-semibold;
  }

  ul {
    @apply list-disc list-inside;
  }

  a {
    @apply dark:text-primary-400 text-primary-600 hover:underline decoration-dashed underline-offset-4;
  }

  p {
    @apply text-lg mt-4 text-justify;
  }
}
</style>
