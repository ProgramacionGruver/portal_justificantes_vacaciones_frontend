
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
