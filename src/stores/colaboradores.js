import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useColaboradoresStore = defineStore('colaboradores', () => {
  const colaboradores = ref([])
  const opcionesColaboradores = ref([])

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


  return {
    colaboradores,
    opcionesColaboradores,
    obtenerColaboradores
  }
})
