import { formatearFecha } from "./formatearFecha"
export const listaMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const fecha = new Date()
const anio = fecha.getFullYear()
export const listaAnios = [anio, anio - 1, anio - 2, anio - 3, anio - 4]

export const listaQuincenas = ['Primera Quincena', 'Segunda Quincena']
export const listaTrimestres = ['Primer Trimestre', 'Segundo Trimestre', 'Tercer Trimestre', 'Cuarto Trimestre']

// recibe un array de objetos de departamento
export const obtenerListaDepartamentos = (listaDepartamemtos) => {
  let stringDepartamento =  ''
  if ( listaDepartamemtos.length > 0 ){
    listaDepartamemtos.map( departamento => {
      stringDepartamento = stringDepartamento + '\r\n' + departamento.departamento.nombreDepartamento
    })
  } else {
    return '-'
  }
  stringDepartamento = stringDepartamento.substring(2, stringDepartamento.length)
  return stringDepartamento
}

// recibe un array de objetos de departamento
export const obtenerEdicionDepartamento = (listaDepartamemtos) => {
  let fecha =  ''
  let usuario = ''
  if (listaDepartamemtos){
    listaDepartamemtos.map( departamento => {
      do {
        fecha = departamento.departamento.udatedAt
        usuario = departamento.editedBy
      } while (fecha < departamento.departamento.udatedAt )
    })
  } else {
    return ''
  }
  return usuario + ' -' + formatearFecha(fecha)
}
