import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiUsuarios } from 'src/boot/axiosUsuarios'

export const useColaboradoresStore = defineStore('colaboradores', () => {
  const colaboradores = ref([])
  const opcionesColaboradores = ref([])

  const obtenerColaboradores = async () => {
    try {
      const { data } = await apiUsuarios.get('/usuarios')
      colaboradores.value = data

      opcionesColaboradores.value = data.map(empleado => {
        return {
          label: `${empleado.numero_empleado} - ${empleado.nombre} - ${empleado.siglasCentroTrabajo}`,
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
    obtenerColaboradores
  }
})
