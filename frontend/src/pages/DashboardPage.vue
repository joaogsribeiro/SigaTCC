<script setup>
import { onMounted, ref } from 'vue'
import { tccApi } from '../services/tccApi'

const isLoading = ref(true)
const errorMessage = ref('')
const statistics = ref(null)

async function loadStatistics() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await tccApi.getStatistics()
    statistics.value = response.data
  } catch (error) {
    errorMessage.value =
      'Não foi possível carregar as estatísticas. Confira se o backend Django está rodando em http://127.0.0.1:8000.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadStatistics)
</script>

<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Visão geral dos TCCs cadastrados no sistema.</p>
      </div>

      <button type="button" class="button-secondary" @click="loadStatistics">
        Atualizar
      </button>
    </header>

    <div v-if="isLoading" class="status-box">
      Carregando estatísticas...
    </div>

    <div v-else-if="errorMessage" class="status-box status-box-error">
      {{ errorMessage }}
    </div>

    <div v-else class="dashboard-grid">
      <article class="metric-card">
        <span>Total de TCCs</span>
        <strong>{{ statistics.total_geral }}</strong>
      </article>

      <article class="data-panel">
        <h2>Por status</h2>

        <ul class="data-list">
          <li
            v-for="(total, status) in statistics.por_status"
            :key="status"
          >
            <span>{{ status }}</span>
            <strong>{{ total }}</strong>
          </li>
        </ul>
      </article>

      <article class="data-panel">
        <h2>Por tipo</h2>

        <ul class="data-list">
          <li
            v-for="(total, tipo) in statistics.por_tipo"
            :key="tipo"
          >
            <span>{{ tipo }}</span>
            <strong>{{ total }}</strong>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>