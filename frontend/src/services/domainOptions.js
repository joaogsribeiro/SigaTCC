export const statusOptions = [
  { value: '0', label: 'Em Elaboração' },
  { value: '1', label: 'Enviado' },
  { value: '2', label: 'Aprovado' },
  { value: '3', label: 'Reprovado' },
]

export const typeOptions = [
  { value: 'MONOGRAFIA', label: 'Monografia' },
  { value: 'RELATORIO_ESTAGIO', label: 'Relatório de Estágio' },
  { value: 'RELATORIO_TECNICO', label: 'Relatório Técnico' },
  { value: 'ARTIGO', label: 'Artigo' },
]

export const languageOptions = [
  { value: 'PT', label: 'Português' },
  { value: 'EN', label: 'Inglês' },
]

export function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value ?? '-'
}

export const semesterOptions = [
  '2020/1',
  '2020/2',
  '2021/1',
  '2021/2',
  '2022/1',
  '2022/2',
  '2023/1',
  '2023/2',
  '2024/1',
  '2024/2',
  '2025/1',
  '2025/2',
  '2026/1',
]