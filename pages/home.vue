<script setup lang="ts">
definePageMeta({
  layout: 'empty',
})

useHead({
  titleTemplate: 'IoT Platform',
})
</script>

<template>
  <div>
    <nav class="px-4 py-2 flex items-center container mx-auto">
      <AppLogo /> <ULink
        to="/home"
        class="ml-2 text-lg font-semibold"
      >
        IoT platform
      </ULink>

      <BaseSpacer />
      <div class="hidden md:flex px-4 gap-4 items-end rounded-full text-sm">
        <UButton
          variant="ghost"
          to="#technologies"
        >
          Tecnologías
        </UButton>
        <UButton
          variant="ghost"
          to="#getting-started"
        >
          Comenzar
        </UButton>
      </div>
      <BaseSpacer class="hidden md:inline-flex" />

      <ULink
        class="font-semibold"
        to="/auth/login"
      >
        Iniciar sesión <UIcon name="i-mdi-login" />
      </ULink>
    </nav>
    <section class="px-4 min-h-[33svh] flex flex-col gap-10 items-center justify-center py-10 text-center">
      <UBadge variant="soft">
        Manejo de dispositivos IoT
      </UBadge>
      <h1 class="font-extrabold text-5xl">
        Crea tu propia plataforma IoT en minutos
      </h1>
      <p class="text-gray-700 dark:text-gray-100">
        Conecta tus dispositivos y visualiza sus datos en tiempo real a través de nuestra plataforma. Maneja todos tus dispositivos IoT desde un solo lugar.
      </p>
      <div class="inline-flex gap-4">
        <UButton
          :ui="{ rounded: 'rounded-full' }"
          size="lg"
          to="/auth/login"
        >
          Comenzar <UIcon
            class="text-xl"
            name="i-mdi-arrow-right"
          />
        </UButton>
        <UButton
          :ui="{ rounded: 'rounded-full' }"
          class="shadow"
          variant="outline"
          size="lg"
        >
          Saber más
        </UButton>
      </div>
    </section>
    <section
      id="technologies"
      class="container mx-auto px-4 max-w-6xl"
    >
      <div class="flex justify-center py-10">
        <UBadge
          variant="soft"
          class="mx-auto"
        >
          Tecnologías
        </UBadge>
      </div>
      <div class="flex gap-8 flex-wrap justify-center items-stretch">
        <LandingCard
          class="max-w-[400px]"
          title="InfluxDB"
          description="Almacena y visualiza los datos recogidos por tus sensores en tiempo real con InfluxDB."
          icon="i-simple-icons:influxdb"
          href="https://www.influxdata.com/"
        />
        <LandingCard
          class="max-w-100"
          title="Supabase"
          description="Supabase ayuda al menejo de los usuarios de tus aplicaciones, así como con sus configuraciones."
          icon="i-skill-icons:supabase-dark"
          href="https://supabase.com/"
        />
        <LandingCard
          class="max-w-100"
          title="Nuxt"
          description="Nuxt maneja el código de tu aplicación, así como su despliegue y manejo de rutas."
          icon="i-skill-icons:nuxtjs-dark"
          href="https://nuxt.com/"
        />
        <LandingCard
          class="max-w-100"
          title="OAuth 2.0"
          description="OAuth para el manejo de la autenticación de tus usuarios."
          icon="i-devicon:oauth"
          href="https://oauth.net/2/"
        />
      </div>
    </section>
    <section
      id="getting-started"
      class="mt-10 md:mt-20 gap-10 flex items-center flex-col justify-center py-10 bg-primary-50 dark:bg-primary-950 min-h-[33svh]"
    >
      <UBadge
        variant="soft"
        class="mx-auto"
      >
        Inicio rápido
      </UBadge>
      <h2 class="font-bold text-3xl">
        Comienza ahora mismo
      </h2>
      <p class="text-gray-600 dark:text-gray-100 text-center">
        Inicia sesión con una cuenta de github y comienza a manejar tus dispositivos IoT.
      </p>
      <div>
        <UButton
          :ui="{ rounded: 'rounded-full' }"
          size="lg"
          to="/dashboard"
        >
          Comenzar <UIcon
            class="text-xl"
            name="i-mdi-arrow-right"
          />
        </UButton>
      </div>
    </section>
    <section>
      <LayoutFooter />
    </section>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
