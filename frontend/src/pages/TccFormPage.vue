<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { tccApi } from '../services/tccApi'
import {
  languageOptions,
  semesterOptions,
  statusOptions,
  typeOptions,
} from '../services/domainOptions'

const router = useRouter()

const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const students = ref([])
const professors = ref([])

const form = ref({
  titulo: '',
  resumo: '',
  palavras_chave: '',
  tipo: 'MONOGRAFIA',
  idioma: 'PT',
  aluno: '',
  orientador: '',
  coorientador: '',
  presidente: '',
  primeiro_membro: '',
  segundo_membro: '',
  semestre_letivo_defesa: '2026/1',
  status: '0',
  arquivo: null,
})

const canSubmit = computed(() => {
  return (
    form.value.titulo &&
    form.value.resumo &&
    form.value.palavras_chave &&
    form.value.tipo &&
    form.value.idioma &&
    form.value.aluno &&
    form.value.orientador &&
    form.value.presidente &&
    form.value.primeiro_membro &&
    form.value.segundo_membro
  )
})

async function loadOptions() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [studentsResponse, professorsResponse] = await Promise.all([
      tccApi.getStudents(),
      tccApi.getProfessors(),
    ])

    students.value = studentsResponse.data
    professors.value = professorsResponse.data
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar alunos e professores.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

function handleFileChange(event) {
  const [file] = event.target.files
  form.value.arquivo = file ?? null
}

function buildFormData() {
  const formData = new FormData()

  Object.entries(form.value).forEach(([key, value]) => {
    if (key === 'coorientador' && !value) {
      return
    }

    if (key === 'arquivo' && !value) {
      return
    }

    formData.append(key, value)
  })

  return formData
}

async function submitForm() {
  if (!canSubmit.value) {
    errorMessage.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  isSaving.value = true
  errorMessage.value = ''

  try {
    await tccApi.createTcc(buildFormData())
    router.push('/tccs')
  } catch (error) {
    errorMessage.value = 'Não foi possível cadastrar o TCC.'
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

onMounted(loadOptions)
</script>

<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h1>Novo TCC</h1>
        <p>Cadastro de trabalho com banca, status e arquivo PDF.</p>
      </div>

      <button type="button" class="button-secondary" @click="router.push('/tccs')">
        Voltar
      </button>
    </header>

    <div v-if="isLoading" class="status-box">
      Carregando opções do formulário...
    </div>

    <div v-else class="form-panel">
      <div v-if="errorMessage" class="status-box status-box-error">
        {{ errorMessage }}
      </div>

      <form class="form-grid" @submit.prevent="submitForm">
        <label class="field field-wide">
          <span>Título *</span>
          <input v-model.trim="form.titulo" type="text" required>
        </label>

        <label class="field field-wide">
          <span>Resumo *</span>
          <textarea v-model.trim="form.resumo" rows="5" required />
        </label>

        <label class="field field-wide">
          <span>Palavras-chave *</span>
          <input
            v-model.trim="form.palavras_chave"
            type="text"
            placeholder="vue, django, gestão acadêmica"
            required
          >
        </label>

        <label class="field">
          <span>Tipo *</span>
          <select v-model="form.tipo" required>
            <option
              v-for="option in typeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Idioma *</span>
          <select v-model="form.idioma" required>
            <option
              v-for="option in languageOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Semestre</span>
          <select v-model="form.semestre_letivo_defesa">
            <option
              v-for="semester in semesterOptions"
              :key="semester"
              :value="semester"
            >
              {{ semester }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Status *</span>
          <select v-model="form.status" required>
            <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Aluno *</span>
          <select v-model="form.aluno" required>
            <option value="" disabled>Selecione</option>
            <option
              v-for="student in students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.nome }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Orientador *</span>
          <select v-model="form.orientador" required>
            <option value="" disabled>Selecione</option>
            <option
              v-for="professor in professors"
              :key="professor.id"
              :value="professor.id"
            >
              {{ professor.nome }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Coorientador</span>
          <select v-model="form.coorientador">
            <option value="">Sem coorientador</option>
            <option
              v-for="professor in professors"
              :key="professor.id"
              :value="professor.id"
            >
              {{ professor.nome }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Presidente *</span>
          <select v-model="form.presidente" required>
            <option value="" disabled>Selecione</option>
            <option
              v-for="professor in professors"
              :key="professor.id"
              :value="professor.id"
            >
              {{ professor.nome }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Primeiro membro *</span>
          <select v-model="form.primeiro_membro" required>
            <option value="" disabled>Selecione</option>
            <option
              v-for="professor in professors"
              :key="professor.id"
              :value="professor.id"
            >
              {{ professor.nome }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Segundo membro *</span>
          <select v-model="form.segundo_membro" required>
            <option value="" disabled>Selecione</option>
            <option
              v-for="professor in professors"
              :key="professor.id"
              :value="professor.id"
            >
              {{ professor.nome }}
            </option>
          </select>
        </label>

        <label class="field field-wide">
          <span>Arquivo PDF</span>
          <input type="file" accept="application/pdf" @change="handleFileChange">
        </label>

        <div class="form-actions field-wide">
          <button type="button" class="button-secondary" @click="router.push('/tccs')">
            Cancelar
          </button>

          <button type="submit" class="button-primary" :disabled="isSaving">
            {{ isSaving ? 'Salvando...' : 'Cadastrar TCC' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>