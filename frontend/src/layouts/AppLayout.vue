<script setup>
import { RouterLink, RouterView } from 'vue-router'

const navigationItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'TCCs', to: '/tccs' },
  { label: 'Alunos', to: '/alunos' },
  { label: 'Professores', to: '/professores' },
  { label: 'Cursos', to: '/cursos' },
  { label: 'Departamentos', to: '/departamentos' },
  { label: 'Unidades Acadêmicas', to: '/unidades-academicas' },
]
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <strong>SigaTCC</strong>
        <span>Gestão acadêmica</span>
      </div>

      <nav class="nav-menu" aria-label="Navegação principal">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>