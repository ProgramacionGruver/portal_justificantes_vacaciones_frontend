import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { filtrarElementosDuplicados } from 'src/helpers/filtros'
import { llenarOpcionesDepartamentos } from 'src/helpers/filtros'
import { ref } from 'vue'

export const useDepartamentosStore = defineStore("departamentos", () => {

  const departamentos = ref([])
  const departamentosFiltrados = ref([])
  const departamentosSeleccionados = ref([])
  const todosDepartamentosSeleccionados = ref(true)
  const opcionesDepartamentos = ref([])
  const listaClavesDepartamentos = ref([])

  const obtenerDepartamentos = async () => {
    try {

      const { data } = await api.get('/obtenerDepartamentosSucursales')
      departamentos.value = data.map(departamento => { return { ...departamento, label: departamento.departamento.nombreDepartamento, value: departamento.claveDepartamento } })

      departamentosFiltrados.value = filtrarElementosDuplicados(departamentos.value, 'claveDepartamento')

      opcionesDepartamentos.value = llenarOpcionesDepartamentos(departamentos.value)

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
    opcionesDepartamentos,
    listaClavesDepartamentos,
    obtenerDepartamentos
  }
})
