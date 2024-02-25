<script setup lang="ts">
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <section class="w-full pt-12 md:pt-24 lg:pt-32 border-y">
    <div class="px-4 md:px-6 space-y-10 xl:space-y-16">
      <div class="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
        <div>
          <h1
            class="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]"
          >
            The complete platform for building the Web
          </h1>
        </div>
        <div class="flex flex-col items-start space-y-4">
          <p class="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Beautifully designed components that you can copy and paste
            into your apps. Accessible. Customizable. Open Source.
          </p>
          <div class="space-x-4">
            <UButton
              size="lg"
              href="#"
            >
              Get Started
            </UButton>
            <UButton
              href="#"
              size="lg"
              variant="ghost"
            >
              Button
            </UButton>
          </div>
        </div>
      </div><img
        src="/placeholder.svg" width="1270" height="300" alt="Hero"
        class="mx-auto aspect-[3/1] overflow-hidden rounded-t-xl object-cover"
      >
    </div>
  </section>
  <section class="w-full py-12 md:py-24 lg:py-32">
    <UContainer class="space-y-12 px-4 md:px-6">
      <div class="flex flex-col items-center justify-center space-y-4 text-center">
        <div class="space-y-2">
          <UBadge variant="subtle">
            New Features
          </UBadge>
          <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
            Faster iteration. More innovation.
          </h2>
          <p
            class="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
          >
            The platform for rapid progress. Let your team focus on
            shipping features instead of managing infrastructure with
            automated CI/CD, built-in testing, and integrated
            collaboration.
          </p>
        </div>
      </div>
      <div
        class="mx-auto grid max-w-5xl items-start gap-6 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3"
      >
        <div class="grid gap-1">
          <h3 class="text-lg font-bold">
            Infinite scalability, zero config
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Enable code to run on-demand without needing to manage your
            own infrastructure or upgrade hardware.
          </p>
        </div>
        <div class="grid gap-1">
          <h3 class="text-lg font-bold">
            Real-time insights and controls
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Get granular, first-party, real-user metrics on site
            performance per deployment.
          </p>
        </div>
        <div class="grid gap-1">
          <h3 class="text-lg font-bold">
            Personalization at the edge
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Deliver dynamic, personalized content, while ensuring users
            only see the best version of your site.
          </p>
        </div>
        <div class="grid gap-1">
          <h3 class="text-lg font-bold">
            Real-time insights and controls
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Get granular, first-party, real-user metrics on site
            performance per deployment.
          </p>
        </div>
        <div class="grid gap-1">
          <h3 class="text-lg font-bold">
            Personalization at the edge
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Deliver dynamic, personalized content, while ensuring users
            only see the best version of your site.
          </p>
        </div>
        <div class="grid gap-1">
          <h3 class="text-lg font-bold">
            Infinite scalability, zero config
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Enable code to run on-demand without needing to manage your
            own infrastructure or upgrade hardware.
          </p>
        </div>
      </div>
      <div class="flex justify-center flex-col sm:flex-row items-start gap-4">
        <UButton
          size="lg"
          href="#"
        >
          Contact Sales
        </UButton>
        <UButton
          size="lg"
          variant="ghost"
          href="#"
        >
          Tour the Platform
        </UButton>
      </div>
    </UContainer>
  </section>
  <section class="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
    <UContainer class="grid items-center justify-center gap-4 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold tracking-tighter md:text-4xl/tight">
          Experience the workflow the best frontend teams love.
        </h2>
        <p
          class="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
        >
          Let your team focus on shipping features instead of managing
          infrastructure with automated CI/CD.
        </p>
      </div>
      <div class="mx-auto w-full max-w-sm space-y-2">
        <form class="flex space-x-2">
          <UInput
            class="w-full"
            placeholder="Enter your email" type="email"
          />
          <UButton
            type="submit"
          >
            Sign Up
          </UButton>
        </form>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Sign up to get notified when we launch.
          <a class="underline underline-offset-2" href="#">
            Terms &amp; Conditions
          </a>
        </p>
      </div>
    </UContainer>
  </section>
  <section class="w-full py-12 md:py-24 lg:py-32">
    <UContainer class="grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
      <div class="space-y-3">
        <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Meet our Customers
        </h2>
        <p
          class="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
        >
          Trusted by the best teams in the world. We help teams of all
          sizes.
        </p>
      </div>
      <div class="divide-y rounded-lg border">
        <div class="grid w-full grid-cols-3 items-stretch justify-center divide-x md:grid-cols-3">
          <div class="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
            <img
              src="/placeholder.svg" width="140" height="70" alt="Logo"
              class="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
            >
          </div>
          <div class="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
            <img
              src="/placeholder.svg" width="140" height="70" alt="Logo"
              class="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
            >
          </div>
          <div class="mx-auto flex w-full items-center justify-center p-8">
            <img
              src="/placeholder.svg" width="140" height="70" alt="Logo"
              class="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
            >
          </div>
        </div>
        <div class="grid w-full grid-cols-3 items-stretch justify-center divide-x md:grid-cols-3">
          <div class="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
            <img
              src="/placeholder.svg" width="140" height="70" alt="Logo"
              class="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
            >
          </div>
          <div class="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
            <img
              src="/placeholder.svg" width="140" height="70" alt="Logo"
              class="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
            >
          </div>
          <div class="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
            <img
              src="/placeholder.svg" width="140" height="70" alt="Logo"
              class="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
            >
          </div>
        </div>
      </div>
      <div class="flex justify-center space-x-4">
        <UButton
          size="lg"
          href="#"
        >
          Contact Sales
        </UButton>
        <UButton
          href="#"
          size="lg"
          variant="ghost"
        >
          Learn more
        </UButton>
      </div>
    </UContainer>
  </section>
  <section class="w-full py-12 md:py-24 lg:py-32 border-t">
    <UContainer class="px-4 md:px-6">
      <div class="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
        <div class="space-y-4">
          <UBadge variant="subtle">
            Performance
          </UBadge>
          <h2
            class="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]"
          >
            Traffic spikes should be exciting, not scary.
          </h2><UButton
            size="lg"
            href="#"
          >
            Get Started
          </UButton>
        </div>
        <div class="flex flex-col items-start space-y-4">
          <UBadge variant="subtle">
            Security
          </UBadge>
          <p class="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
            Infraestructura totalmente gestionada diseñada para escalar dinámicamente
            con tu tráfico, un borde global para garantizar que tu sitio sea rápido
            para cada cliente, y las herramientas para monitorear cada aspecto de
            tu aplicación.
          </p><UButton
            size="lg"
            href="#"
          >
            Contact Sales
          </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>
