import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useDepartamentosStore = defineStore("departamentos", () => {

  const departamentos = ref([])
  const departamentosFiltrados = ref([])
  const departamentosSeleccionados = ref([])
  const todosDepartamentosSeleccionados = ref(true)
  const listaClavesDepartamentos = ref([])

  const obtenerDepartamentos = async () => {
    try {

      const { data } = await api.get('/obtenerDepartamentos')
      departamentos.value = data
      departamentosFiltrados.value = data.map(departamento => {
        return { ...departamento, label: departamento.nombreDepartamento, value: departamento.claveDepartamento }
      })
      listaClavesDepartamentos.value = departamentosFiltrados.value.map(departamento => {
        return departamento.value
      })
    } catch (error) {
      //console.log( error )
    }
  }

  return {
    departamentos,
    departamentosFiltrados,
    departamentosSeleccionados,
    todosDepartamentosSeleccionados,
    listaClavesDepartamentos,
    obtenerDepartamentos
  }
})
