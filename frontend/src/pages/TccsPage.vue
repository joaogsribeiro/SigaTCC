<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

import { computed, onMounted, ref } from "vue";
import { getFileUrl } from "../services/api";
import { getOptionLabel, languageOptions, statusOptions, typeOptions } from "../services/domainOptions";
import { tccApi } from "../services/tccApi";

const isLoading = ref(true);
const errorMessage = ref("");
const searchTerm = ref("");
const tccs = ref([]);
const students = ref([]);
const professors = ref([]);

const studentById = computed(() => {
    return Object.fromEntries(students.value.map((student) => [student.id, student]));
});

const professorById = computed(() => {
    return Object.fromEntries(professors.value.map((professor) => [professor.id, professor]));
});

async function loadBaseData() {
    const [studentsResponse, professorsResponse] = await Promise.all([tccApi.getStudents(), tccApi.getProfessors()]);

    students.value = studentsResponse.data;
    professors.value = professorsResponse.data;
}

async function loadTccs() {
    isLoading.value = true;
    errorMessage.value = "";

    try {
        const params = searchTerm.value ? { search: searchTerm.value } : {};
        const response = await tccApi.getTccs(params);
        tccs.value = response.data;
    } catch (error) {
        errorMessage.value = "Não foi possível carregar os TCCs.";
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}

async function loadPage() {
    try {
        await loadBaseData();
        await loadTccs();
    } catch (error) {
        errorMessage.value = "Não foi possível carregar os dados auxiliares de alunos e professores.";
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}

function getStudentName(id) {
    return studentById.value[id]?.nome ?? "-";
}

function getProfessorName(id) {
    return professorById.value[id]?.nome ?? "-";
}

function submitSearch() {
    loadTccs();
}

onMounted(loadPage);
</script>

<template>
    <section class="page">
        <header class="page-header">
            <div>
                <h1>TCCs</h1>
                <p>Listagem, busca e acompanhamento dos trabalhos cadastrados.</p>
            </div>

            <div class="page-actions">
                <button type="button" class="button-primary" @click="router.push('/tccs/novo')">Novo TCC</button>

                <button type="button" class="button-secondary" @click="loadPage">Atualizar</button>
            </div>
        </header>

        <form class="toolbar" @submit.prevent="submitSearch">
            <label class="search-field">
                <span>Buscar TCC</span>
                <input v-model.trim="searchTerm" type="search" placeholder="Título ou resumo" />
            </label>

            <button type="submit" class="button-primary">Buscar</button>

            <button
                type="button"
                class="button-secondary"
                @click="
                    searchTerm = '';
                    loadTccs();
                "
            >
                Limpar
            </button>
        </form>

        <div v-if="isLoading" class="status-box">Carregando TCCs...</div>

        <div v-else-if="errorMessage" class="status-box status-box-error">
            {{ errorMessage }}
        </div>

        <div v-else-if="tccs.length === 0" class="status-box">Nenhum TCC encontrado.</div>

        <div v-else class="table-panel">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Aluno</th>
                        <th>Orientador</th>
                        <th>Tipo</th>
                        <th>Idioma</th>
                        <th>Semestre</th>
                        <th>Status</th>
                        <th>Arquivo</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="tcc in tccs" :key="tcc.id">
                        <td>
                            <strong>{{ tcc.titulo }}</strong>
                            <small>{{ tcc.palavras_chave }}</small>
                        </td>
                        <td>{{ getStudentName(tcc.aluno) }}</td>
                        <td>{{ getProfessorName(tcc.orientador) }}</td>
                        <td>{{ tcc.tipo_display || getOptionLabel(typeOptions, tcc.tipo) }}</td>
                        <td>{{ tcc.idioma_display || getOptionLabel(languageOptions, tcc.idioma) }}</td>
                        <td>{{ tcc.semestre_letivo_defesa || "-" }}</td>
                        <td>
                            <span :class="['status-pill', `status-pill-${tcc.status}`]">
                                {{ tcc.status_display || getOptionLabel(statusOptions, tcc.status) }}
                            </span>
                        </td>
                        <td>
                            <a
                                v-if="tcc.arquivo"
                                class="file-link"
                                :href="getFileUrl(tcc.arquivo)"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Abrir PDF
                            </a>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
