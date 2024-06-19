import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { apiCorreo } from 'src/boot/axiosCorreo'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'
import { mensajeOrdenesDeServicioProceso } from 'src/helpers/correos'

export const useOrdenesStore = defineStore("ordenes", () => {

    const ordenesEnProceso = ref([])
    const ordenesEnProcesoZona = ref([])

    const obtenerOrdenesEnProceso = async () => {
        try {

            const { data } = await api.get('/ordenes/servicio/proceso/semanal')
            ordenesEnProceso.value = data
            const resultadoZona = await api.get('/ordenes/servicio/proceso/semanal/zona')
            ordenesEnProcesoZona.value = resultadoZona.data

            console.log(ordenesEnProcesoZona.value)

            const html = mensajeOrdenesDeServicioProceso(ordenesEnProceso.value, ordenesEnProcesoZona.value)
            const asunto = 'Prueba - Ordenes de Servicio Septiembre 2023'
            const destinatariosReal = 'nperez@gruver.mx'
            // const destinatariosReal = 'jramirezmu@gruver.mx; hhernandez@gruver.mx; eoropesa@gruver.mx; agomez@gruver.mx; hgonzalez@gruver.mx; ggarcial@gruver.mx; chernandez@gruver.mx; jberdon@gruver.mx; hquevedo@gruver.mx; mvaldes@gruver.mx; cbahena@gruver.mx; ftrejo@gruver.mx; aroman@gruver.mx; fbanuelos@gruver.mx; noemi.juarez@gruver.mx; rlara@gruver.mx; crodriguez@gruver.mx; kmartinezp@gruver.mx; jherce@gruver.mx; ganota@gruver.mx; etapiap@gruver.mx; folguinh@gruver.mx; lalcolea@gruver.mx; pedro.morales@gruver.mx; csanchez@gruver.mx; respinosa@gruver.mx; gmena@gruver.mx; jreyesl@gruver.mx; ajimenezf@gruver.mx; rmejia@gruver.mx; laura.garcia@gruver.mx; mariadelcarmen.munoz@gruver.mx; luz.martinez@gruver.mx; carlos.hernandez@gruver.mx; yadira.loyo@gruver.mx; frederick.martinez@gruver.mx; luis.ramirez@gruver.mx; ana.nicolas@gruver.mx; aortizr@gruver.mx; mmaldonado@gruver.mx; jribon@gruver.mx; consuelo.canche@gruver.mx; cgarcia@gruver.mx; mhernandez@gruver.mx; eacosta@gruver.mx; esarabia@gruver.mx; jcobos@gruver.mx; vperez@gruver.mx; enava@gruver.mx; alopez@gruver.mx; aruizc@gruver.mx; haranda@gruver.mx; amoreno@gruver.mx; jcruz@gruver.mx; dflores@gruver.mx; lguadarrama@gruver.mx; sburguete@gruver.mx; fgerardo@gruver.mx; jcano@gruver.mx; nperez@gruver.mx; jpedroza@gruver.mx'
            const destinatariosReal2 = ','


            await apiCorreo.post('/eventoCorreo', { correo: destinatariosReal, titulo: asunto, mensaje: html })

        } catch (error) {
            console.log( error )
        }
    }

    const obtenerOrdenesEnProcesoZona = async () => {
      try {


          ordenesEnProceso.value = data

          const html = mensajeOrdenesDeServicioProceso(ordenesEnProceso.value)
          const asunto = 'Ordenes de servicio en Proceso'
          const destinatarios = 'nperez@gruver.mx'

          await apiCorreo.post('/eventoCorreo', { correo: destinatarios, titulo: asunto, mensaje: html })

      } catch (error) {
          console.log( error )
      }
  }


    return {
        ordenesEnProceso,
        ordenesEnProcesoZona,
        obtenerOrdenesEnProceso,
    }
})
