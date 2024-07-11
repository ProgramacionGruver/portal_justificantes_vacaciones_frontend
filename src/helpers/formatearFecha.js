import dayjs from 'dayjs'

export const formatearFecha = (stringFecha) => dayjs(stringFecha).format('DD/MM/YYYY')

export const formatearMonto = (monto) => monto?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

export const formatearHora = (stringFecha) => dayjs(stringFecha).locale('es').format('DD/MM/YYYY HH:mm')
