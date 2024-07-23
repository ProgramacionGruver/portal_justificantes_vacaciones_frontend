import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'

export const useCatalogosStore = defineStore("catalogos", () => {
    const catalogoVacaciones = ref([])
    const catalogoUsuarios = ref([])
    const catalogoUsuariosFiltrados = ref([])
    const estatusActividad = ref([{ label: 'ACTIVO', value: true }, { label: 'BAJA', value: false }])
    const estatusActividadFiltrados = ref([{ label: 'ACTIVO', value: true }, { label: 'BAJA', value: false }])
    const modelEstatusActividadSeleccionados = ref([])
    const listaEstatusActividad = ref([true, false])
    const todosEstatusActividadSeleccionados = ref(true)
    const catalogoTurnos = ref([])
    const turnosLunesViernes = ref([])
    const turnosLunesViernesFiltrados = ref([])
    const modelTurnosLunesViernesSeleccionados = ref([])
    const listaTurnosLunesViernes = ref([])
    const todosTurnosLunesViernesSeleccionados = ref(true)
    const turnosSabados = ref([])
    const turnosSabadosFiltrados = ref([])
    const modelTurnosSabadosSeleccionados = ref([])
    const listaTurnosSabados = ref([])
    const todosTurnosSabadosSeleccionados = ref(true)
    const opcionesTurnos = ref([])
    const cargando = ref(false)

    const obtenerCatalogoVacaciones = async () => {
        try {
            cargando.value= true
            const { data } = await api.get('/catalogoVacaciones')
            catalogoVacaciones.value = data
        } catch (error) {
            console.log(error)
        }finally{
            cargando.value = false
        }
    }

    const agregarCatalogoVacaciones = async (catalogoObj) => {
      try {
          cargando.value= true
          const { data } = await api.post('/catalogoVacaciones',catalogoObj)
          catalogoVacaciones.value = [data, ...catalogoVacaciones.value]
          notificacion('positive', 'Registro agregado exitosamente')
      } catch (error) {
          notificacion('negative', error.response.data.message)
      }finally{
          cargando.value = false
      }
    }

    const editarCatalogoVacaciones = async (catalogoObj) => {
      try {
        const { data } = await api.put(`/catalogoVacaciones/${catalogoObj.idVacaciones}`,catalogoObj)
        const index = catalogoVacaciones.value.findIndex((catalogo) => catalogo.idVacaciones === catalogoObj.idVacaciones)
        catalogoVacaciones.value.splice(index, 1, catalogoObj)
        notificacion("positive", "Registro Actualizado Correctamente")
      } catch (error) {
        notificacion("negative", error.response.data.message)
      }
    }

    const eliminarCatalogoVacaciones = async (catalogoObj) => {
      try {
        const { data } = await api.delete(`/catalogoVacaciones/${catalogoObj.idVacaciones}`)
        catalogoVacaciones.value = catalogoVacaciones.value.filter((catalogo) => catalogo.idVacaciones !== catalogoObj.idVacaciones)
        notificacion("positive", "Registro eliminado correctamente")
      } catch (error) {
        notificacion("negative", error.response.data.message)
      }
    }

    const obtenerCatalogoUsuarios = async () => {
        try {
            cargando.value= true
            const { data } = await api.get('/catalogoUsuarios')
            catalogoUsuarios.value = data
            catalogoUsuariosFiltrados.value = data
        } catch (error) {
            console.log(error)
        }finally{
            cargando.value = false
        }
    }

    const editarCatalogoUsuarios = async (catalogoObj) => {
      try {
        const { data } = await api.put(`/catalogoUsuarios/${catalogoObj.idUsuario}`,catalogoObj)
        const index = catalogoUsuarios.value.findIndex((catalogo) => catalogo.idUsuario === catalogoObj.idUsuario)
        catalogoUsuarios.value.splice(index, 1, catalogoObj)
        notificacion("positive", " Usuario Actualizado Correctamente")
      } catch (error) {
        notificacion("negative", error.response.data.message)
      }
    }

    const obtenerCatalogoTurnos= async () => {
      try {
          const { data } = await api.get('/catalogoTurnos')
          catalogoTurnos.value = data

          turnosLunesViernesFiltrados.value = data.map(turno => { return { label: turno.turno, value: turno.turno } })
          turnosLunesViernesFiltrados.value = [{ label: 'Sin Registro', value: null }, ...turnosLunesViernesFiltrados.value]

          turnosSabadosFiltrados.value = data.map(turno => { return { label: turno.turno, value: turno.turno } })
          turnosSabadosFiltrados.value = [{ label: 'Sin Registro', value: null }, ...turnosSabadosFiltrados.value]

          listaTurnosLunesViernes.value = data.map(turno => { return turno.turno })
          listaTurnosLunesViernes.value = [null, ...listaTurnosLunesViernes.value]
          listaTurnosSabados.value = data.map(turno => { return turno.turno })
          listaTurnosSabados.value = [null, ...listaTurnosSabados.value]

          opcionesTurnos.value = [
            { label: 'Sin Registro', turno: null },
            ...data.map(turno => ({ label: turno.turno, ...turno }))
          ]
      } catch (error) {
          console.log(error)
      }
  }

    return {
        catalogoVacaciones,
        catalogoUsuarios,
        catalogoUsuariosFiltrados,
        catalogoTurnos,
        opcionesTurnos,
        cargando,
        estatusActividad,
        estatusActividadFiltrados,
        modelEstatusActividadSeleccionados,
        listaEstatusActividad,
        todosEstatusActividadSeleccionados,
        turnosLunesViernes,
        turnosLunesViernesFiltrados,
        modelTurnosLunesViernesSeleccionados,
        listaTurnosLunesViernes,
        todosTurnosLunesViernesSeleccionados,
        turnosSabados,
        turnosSabadosFiltrados,
        modelTurnosSabadosSeleccionados,
        listaTurnosSabados,
        todosTurnosSabadosSeleccionados,
        obtenerCatalogoVacaciones,
        obtenerCatalogoUsuarios,
        agregarCatalogoVacaciones,
        editarCatalogoVacaciones,
        eliminarCatalogoVacaciones,
        obtenerCatalogoTurnos,
        editarCatalogoUsuarios
    }
})
