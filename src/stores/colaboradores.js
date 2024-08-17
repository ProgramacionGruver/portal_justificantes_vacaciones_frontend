import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { apiUsuarios } from 'src/boot/axiosUsuarios'

export const useColaboradoresStore = defineStore('colaboradores', () => {
  const colaboradores = ref([])
  const opcionesColaboradores = ref([])
  const colaboradoresPortalSistemas = ref([])
  const colaboradorFiltradoPortalSistemas = ref([])

  // Estos colaboradores los obtiene desde la API de justificantesVacaciones
  const obtenerColaboradores = async () => {
    try {
      const { data } = await api.get('/obtenerUsuarios')
      colaboradores.value = data

      opcionesColaboradores.value = data.map(empleado => {
        return {
          label: `${empleado.numero_empleado} - ${empleado.nombre} - ${empleado.claveSucursal}`,
          value: empleado
        }
      })

    } catch (error) {
      // console.log(error)
    }
  }

  const obtenerColaboradoresPortalSistemas = async () => {
    try {
      const { data } = await apiUsuarios.get('/usuarios')
      colaboradoresPortalSistemas.value = data

      colaboradorFiltradoPortalSistemas.value = data.map(empleado => {
        return {
          label: `${empleado.numero_empleado} - ${empleado.nombre}`,
          value: empleado
        }
      })

    } catch (error) {
      // console.log(error)
    }

  }

  return {
    colaboradores,
    opcionesColaboradores,
    colaboradoresPortalSistemas,
    colaboradorFiltradoPortalSistemas,
    obtenerColaboradores,
    obtenerColaboradoresPortalSistemas
  }
})
