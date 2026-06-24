import { api } from './api'

export const tccApi = {
  getAcademicUnits() {
    return api.get('/unidades-academicas/')
  },

  getDepartments(params = {}) {
    return api.get('/departamentos/', { params })
  },

  getCourses(params = {}) {
    return api.get('/cursos/', { params })
  },

  getStudents(params = {}) {
    return api.get('/alunos/', { params })
  },

  getProfessors(params = {}) {
    return api.get('/professores/', { params })
  },

  getTccs(params = {}) {
    return api.get('/tccs/', { params })
  },

  getTcc(id) {
    return api.get(`/tccs/${id}/`)
  },

  createTcc(data) {
    return api.post('/tccs/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  updateTcc(id, data) {
    return api.put(`/tccs/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  patchTcc(id, data) {
    return api.patch(`/tccs/${id}/`, data)
  },

  deleteTcc(id) {
    return api.delete(`/tccs/${id}/`)
  },

  getStatistics() {
    return api.get('/tccs/estatisticas/')
  },
}