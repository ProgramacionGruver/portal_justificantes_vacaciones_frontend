import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useAsistenciasStore = defineStore("asistencias", () => {
    const asistencias = ref([])
    const asistenciasFiltradas = ref([])
    const faltas = ref([])
    const faltasFiltradas = ref([])
    const faltasRetardos = ref([])
    const faltasRetardosFiltradas = ref([])
    const cargando = ref(false)

    const obtenerAsistencias = async (objBusqueda) => {
        try {
            cargando.value= true
            const { data } = await api.post('/obtener/asistencias', objBusqueda)
            asistencias.value = data
            asistenciasFiltradas.value = data
        } catch (error) {
            console.log(error)
        }finally{
          cargando.value = false
        }
    }

    const obtenerFaltas = async (objBusqueda) => {
        try {
            cargando.value= true
            const { data } = await api.post('/obtener/faltas', objBusqueda)
            faltas.value = data
            faltasFiltradas.value = data
        } catch (error) {
            console.log(error)
        }finally{
          cargando.value = false
        }
    }

    const obtenerFaltasRetardos = async (objBusqueda) => {
        try {
            cargando.value= true
            const { data } = await api.post('/obtener/faltasRetardos', objBusqueda)
            faltasRetardos.value = data
            faltasRetardos.value = data
        } catch (error) {
            console.log(error)
        }finally{
          cargando.value = false
        }
    }

    return {
        asistencias,
        asistenciasFiltradas,
        faltas,
        faltasFiltradas,
        faltasRetardos,
        faltasRetardosFiltradas,
        cargando,
        obtenerAsistencias,
        obtenerFaltas,
        obtenerFaltasRetardos
    }
})
