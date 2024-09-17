
export const fecha = new Date()

export const anio = fecha.getFullYear()

export const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const anios = [anio, anio - 1, anio - 2, anio - 3, anio - 4]

export const mes = meses[fecha.getMonth()]

export const obtenerNumeroMes = (mes) => meses.indexOf(mes) + 1

export const obtenerNumeroQuincena = (quincena) => quincena === 'Primera Quincena' ? 1 : 2

export const trimestres = [
  { nombre: 'Primer Trimestre', numero: 1, meses: [1, 2, 3] },
  { nombre: 'Segundo Trimestre', numero: 2, meses: [4, 5, 6] },
  { nombre: 'Tercer Trimestre', numero: 3, meses: [7, 8, 9] },
  { nombre: 'Cuarto Trimestre', numero: 4, meses: [10, 11, 12] }

]

export const coloresBotones = [
  {estado:'FALTA', color: 'red'},
  {estado:'RETARDO', color: 'deep-orange-5'},
  {estado:'AUSENCIAS Y RETARDOS', color: 'pink-4'},
  {estado:'VACACIONES', color: 'light-green-5'},
  {estado:'DIAS ECONOMICOS', color: 'cyan-6'},
  {estado:'TURNO ESPECIAL', color: 'blue-7'},
  {estado:'DIAS GANADOS', color: 'deep-purple-7'},
  {estado:'SABADOS 5S', color: 'purple-6'},
  {estado:'INCAPACIDAD', color: 'amber-14'},
  {estado:'CAPACITACIONES', color: 'blue-grey-3'},
  {estado:'DIA FERIADO', color: 'lime-9'},
]

export const coloresAutorizaciones= [
  {estado:'AUTORIZADO', color: 'green'},
  {estado:'PENDIENTE', color: 'grey'},
  {estado:'RECHAZADO', color: 'red'},
]

export const urlArchivosIncapacidades = 'https://backend.gruver.com.mx/portalJustificantes/incapacidades'
