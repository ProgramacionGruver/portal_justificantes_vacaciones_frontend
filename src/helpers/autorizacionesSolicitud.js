export const obtenerPropsQChip = (detalles) => {
  const AUTORIZADO = 2
  const RECHAZADO = 3
  const CANCELADO = 4

  const todosTerminados = detalles.every(detalle =>
    detalle.idEstatusSolicitud === AUTORIZADO ||
    detalle.idEstatusSolicitud === RECHAZADO  ||
    detalle.idEstatusSolicitud === CANCELADO
  )

  return todosTerminados
    ? { color: 'primary', nombre: 'Finalizado', icono: 'hourglass_bottom' }
    : { color: 'grey', nombre: 'Pendiente', icono: 'update' }
}

export const obtenerTextoAutorizacion = (index) => {
  const textos = ['Primera autorización', 'Segunda autorización', 'Tercera autorización']
  return textos[index]
}
