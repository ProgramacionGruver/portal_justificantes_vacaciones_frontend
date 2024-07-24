export const validarCorreo = [
  (val, rules) => rules.email(val) || 'Ingresa un correo valido.'
]

export const validarFechaVigencia = [
  val => (Date.now() < new Date(val)) || 'Fecha de Vigencia invalida.'
]

export const validarCampo = [
  val => (val && val.length >= 0) || '',
  val => (val && val.length < 50) || ''
]

export const validarTexto50 = [
  val => (val && val.length >= 0) || 'LLena el este campo para continuar.',
  val => (val && val.length < 50) || 'Maximo de campo 50 caracteres'
]

export const validarTexto100 = [
  val => (val && val.length >= 0) || 'LLena el este campo para continuar.',
  val => (val && val.length < 100) || 'Maximo de campo 100 caracteres'
]

export const validarTexto = [
  val => (val && val.length >= 0) || 'LLena el este campo para continuar.'
]

export const validarDigitosEnteros = [
  val => (val !== null && val !== '' && !isNaN(parseInt(val))) || 'Ingresa un numero valido.',
  val => ((val - Math.floor(val) === 0) && val >= 0) || 'Solo numeros enteros.'
]

export const validarEnterosPositivos = [
  val => (val !== null && val !== '' && !isNaN(parseInt(val))) || 'Ingresa un número válido.',
  val => ((val - Math.floor(val) === 0) && val > 0) || 'Solo números enteros mayores a 0.'
]

export const validarDigitosPostivos = [
  val => (val !== null && val !== '' && !isNaN(parseInt(val))) || 'Ingresa un numero valido.',
  val => ((val - Math.floor(val) === 0) && val > 0) || 'El kilometraje del servicio no puede ser menor o igual a cero.'
]

export const validarDigitos = [
  val => (val >= 0 && val !== null && val !== '' && !isNaN(parseInt(val))) || 'Ingresa un numero valido.'
]

export const validarDigitosMaximo100 = [
  val => (val >= 0 && val !== null && val !== '' && !isNaN(parseInt(val))) || 'Ingresa un numero valido.',
  val => ((val - Math.floor(val) === 0) && val >= 0) || 'Solo numeros enteros.',
  val => ((val <= 100) && val >= 0) || 'El valor debe ser menor o igual a 100%'
]

export const validarRFC = [
  val => (/^(([ÑA-Z|ña-z|&]{3}|[A-Z|a-z]{4})\d{2}((0[1-9]|1[012])(0[1-9]|1\d|2[0-8])|(0[13456789]|1[012])(29|30)|(0[13578]|1[02])31)(\w{2})([A|a|0-9]{1}))$|^(([ÑA-Z|ña-z|&]{3}|[A-Z|a-z]{4})([02468][048]|[13579][26])0229)(\w{2})([A|a|0-9]{1})$/.test(val)) || 'Ingresa un RFC valido'
]
