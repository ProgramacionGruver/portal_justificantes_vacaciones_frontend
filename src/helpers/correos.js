import { formatearMonto } from './formatearFecha'
import { formatearPorcentaje, formatearCapitalCase } from './formatos'

const rojo = '#b91c1c'
const naranja = '#FFC301'
const verde = '#A6DF7F'
const amarillo = '#FFFF29'
const gris = ''
const azulClaro = '#BDD7EE'
const azulOscuro = '#1E3A8A'
const positivo = '#00AC00'
const negativo = '#FF0000'
export const mensajeOrdenesDeServicioProceso = (ordenes, ordenesZonas) => {

  const total_30_S = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['<30_MONTO_S']: total, 0 )
  const total30_S = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['+30_MONTO_S']: total, 0 )
  const total60_S = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['+60_MONTO_S']: total, 0 )
  const total90_S = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['+90_MONTO_S']: total, 0 )

  const total_30_H = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['<30_MONTO_H']: total, 0 )
  const total30_H = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['+30_MONTO_H']: total, 0 )
  const total60_H = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['+60_MONTO_H']: total, 0 )
  const total90_H = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['+90_MONTO_H']: total, 0 )

  const total_30_G = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['<30_MONTO_GA']: total, 0 )
  const total30_G = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['+30_MONTO_GA']: total, 0 )
  const total60_G = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['+60_MONTO_GA']: total, 0 )
  const total90_G = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['+90_MONTO_GA']: total, 0 )

  const total = ordenes.reduce( (total, orden) => orden.fila == 'numero'? total + orden['TOTAL']: total, 0 )
  const total_anterior = ordenes.reduce( (total, orden) => orden.fila == 'numero' && !isNaN(orden.total_anterior) ? total + orden['total_anterior']: total, 0 )

  const monto_total_30_S = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['<30_MONTO_S']: total, 0 )
  const monto_total30_S = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['+30_MONTO_S']: total, 0 )
  const monto_total60_S = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['+60_MONTO_S']: total, 0 )
  const monto_total90_S = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['+90_MONTO_S']: total, 0 )

  const monto_total_30_H = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['<30_MONTO_H']: total, 0 )
  const monto_total30_H = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['+30_MONTO_H']: total, 0 )
  const monto_total60_H = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['+60_MONTO_H']: total, 0 )
  const monto_total90_H = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['+90_MONTO_H']: total, 0 )

  const monto_total_30_G = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['<30_MONTO_GA']: total, 0 )
  const monto_total30_G = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['+30_MONTO_GA']: total, 0 )
  const monto_total60_G = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['+60_MONTO_GA']: total, 0 )
  const monto_total90_G = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['+90_MONTO_GA']: total, 0 )

  const monto_total = ordenes.reduce( (total, orden) => orden.fila == 'total'? total + orden['TOTAL']: total, 0 )
  const monto_total_anterior = ordenes.reduce( (total, orden) => orden.fila == 'total' && !isNaN(orden.total_anterior) ? total + orden['total_anterior']: total, 0 )

  const mensajeInicial = `
  <p> Buen dia adjunto reporte de Ordenes Abiertas Semanal de Servicio </p>
  `
  const cabeceraTabla1 = `
  <table border='1' cellpadding='5' cellspacing='0' bordercolor='black' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
    <thead>
        <tr>
        <th bgcolor='#C0C0C0' rowspan='2' style='text-align:center;'>SUCURSAL</th>
        <th bgcolor='#C0C0C0' rowspan='2' style='text-align:left;'></th>
        <th colspan='4' bgcolor='#C0C0C0' style='text-align:center;'>SERVICIO</th>
        <th colspan='4' bgcolor='#C0C0C0' style='text-align:center;'>HYP</th>
        <th colspan='4' bgcolor='#C0C0C0' style='text-align:center;'>GARANTIA</th>
        <th bgcolor='#C0C0C0' rowspan='2' style='text-align:center;'>TOTAL SEMANA ACTUAL</th>
        <th bgcolor='#C0C0C0' rowspan='2' style='text-align:center;'>TOTAL SEMANA ANTERIOR</th>
        <th bgcolor='#C0C0C0' rowspan='2' style='text-align:center;'> ESTATUS </th>
        </tr>
        <tr>
        <th bgcolor='${verde}' style='text-align:center;'><30 DIAS SER</th>
        <th bgcolor='${amarillo}' style='text-align:center;'>+30 DIAS SER</th>
        <th bgcolor='${naranja}' style='text-align:center; color:white'>+60 DIAS SER</th>
        <th bgcolor='${rojo}' style='text-align:center; color:white;'>+90 DIAS SER</th>
        <th bgcolor='${verde}' style='text-align:center;'><30 DIAS HYP</th>
        <th bgcolor='${amarillo}' style='text-align:center;'>+30 DIAS HYP</th>
        <th bgcolor='${naranja}' style='text-align:center; color:white'>+60 DIAS HYP</th>
        <th bgcolor='${rojo}' style='text-align:center; color:white;'>+90 DIAS HYP</th>
        <th bgcolor='${verde}' style='text-align:center;'><30 DIAS GA</th>
        <th bgcolor='${amarillo}' style='text-align:center;'>+30 DIAS GA</th>
        <th bgcolor='${naranja}' style='text-align:center; color:white'>+60 DIAS GA</th>
        <th bgcolor='${rojo}' style='text-align:center; color:white;'>+90 DIAS GA</th>

      </tr>
    </thead>
    <tbody>
    `

  let cuerpoTabla1 = ``

  ordenes.map( linea => {
    const color = linea.fila == 'numero' || linea.fila == 'total' ? '#BDD7EE' : ''
    const colorTipo = linea.fila == 'numero'? `${azulClaro}` : linea.fila == 'total'? `${naranja}` : linea.fila == 'backorder' ? `${amarillo}` : `${verde}`
    const etiqueta = linea.fila == 'numero' || linea.fila == 'total' ? 'th' : 'td'
    const tituloLateral = linea.fila == 'numero' ? `<th  bgcolor='#BDD7EE' rowspan='4'> ${linea.SUCURSAL} </th>` : ''
    const alineacion = linea.fila == 'numero' ? 'center' : 'right'
    cuerpoTabla1 = cuerpoTabla1 + `
    <tr bgcolor='${color}'>
      ${tituloLateral}
      <th bgcolor='${colorTipo}' style='text-align:right;'>${formatearCapitalCase(linea.fila == 'total'? 'Proceso':linea.fila)}</th>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['<30_MONTO_S'] : formatearMonto(linea['<30_MONTO_S'])}</${etiqueta}>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['+30_MONTO_S'] : formatearMonto(linea['+30_MONTO_S'])}</${etiqueta}>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['+60_MONTO_S'] : formatearMonto(linea['+60_MONTO_S'])}</${etiqueta}>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['+90_MONTO_S'] : formatearMonto(linea['+90_MONTO_S'])}</${etiqueta}>

      <${etiqueta} style='text-align:${alineacion};'>${linea.fila == 'numero' ? linea['<30_MONTO_H'] : formatearMonto(linea['<30_MONTO_H'])}</${etiqueta}>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['+30_MONTO_H'] : formatearMonto(linea['+30_MONTO_H'])}</${etiqueta}>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['+60_MONTO_H'] : formatearMonto(linea['+60_MONTO_H'])}</${etiqueta}>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['+90_MONTO_H'] : formatearMonto(linea['+90_MONTO_H'])}</${etiqueta}>

      <${etiqueta} style='text-align:${alineacion};'>${linea.fila == 'numero' ? linea['<30_MONTO_GA'] : formatearMonto(linea['<30_MONTO_GA'])}</${etiqueta}>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['+30_MONTO_GA'] : formatearMonto(linea['+30_MONTO_GA'])}</${etiqueta}>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['+60_MONTO_GA'] : formatearMonto(linea['+60_MONTO_GA'])}</${etiqueta}>
      <${etiqueta} style='text-align:${alineacion};'> ${linea.fila == 'numero' ? linea['+90_MONTO_GA'] : formatearMonto(linea['+90_MONTO_GA'])}</${etiqueta}>

      <${etiqueta} bgcolor='#C0C0C0' style='text-align:${alineacion};'> ${linea.fila != 'numero' ? formatearMonto(linea.TOTAL) :  linea.TOTAL} </${etiqueta}>
      <${etiqueta} bgcolor='#C0C0C0' style='text-align:${alineacion};'> ${linea.fila != 'numero' ? formatearMonto(linea.total_anterior) : linea.total_anterior} </${etiqueta}>
      <${etiqueta} bgcolor='${ linea.TOTAL > linea.total_anterior? negativo : positivo}' style='text-align:${alineacion};'></${etiqueta}>
    </tr>
    `
  })

  const footerTabla1 = `
    </tbody>
    <tr bgcolor='#C0C0C0'>
      <td bgcolor='#C0C0C0' rowspan='4' style='text-align:left'><strong> TOTAL </strong></td>
      <td bgcolor='${azulClaro}' style='text-align:center'><strong> Numero </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total_30_S} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total30_S}</strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total60_S} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total90_S} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total_30_H} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total30_H} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total60_H} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total90_H} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total_30_G} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total30_G} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total60_G} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total90_G} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${total_anterior} </strong></td>
      <td bgcolor='${ total > total_anterior? negativo : positivo}' style='text-align:center'></td>
    </tr>
    <tr bgcolor='#C0C0C0'>
      <td bgcolor='${naranja}' style='text-align:center'><strong> Proceso </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total_30_S)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total30_S)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total60_S)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total90_S)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total_30_H)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total30_H)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total60_H)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total90_H)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total_30_G)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total30_G)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total60_G)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total90_G)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total)} </strong></td>
      <td bgcolor='#C0C0C0' style='text-align:center'><strong> ${formatearMonto(monto_total_anterior)} </strong></td>
      <td bgcolor='${ monto_total > monto_total_anterior? negativo : positivo}' style='text-align:center'></td>
    </tr>
  </table>
  `
  const cabeceraTabla2 = `
  <br>
  <table border='2' cellpadding='5' cellspacing='0' bordercolor='black' style='border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;'>
    <thead>
        <tr>
        <th bgcolor='#C0C0C0' style='text-align:center;'> </th>
        <th colspan='3' bgcolor='#C0C0C0' style='text-align:center;'>SERVICIO</th>
        <th colspan='3' bgcolor='#C0C0C0' style='text-align:center;'>HYP</th>
        <th colspan='3' bgcolor='#C0C0C0' style='text-align:center;'>GARANTIA</th>
        <th colspan='3' bgcolor='#C0C0C0' style='text-align:center;'>TOTAL SEMANA ACTUAL</th>
        <th colspan='3' bgcolor='#C0C0C0' style='text-align:center;'>TOTAL SEMANA ANTERIOR</th>
        <th colspan='2' bgcolor='#C0C0C0' style='text-align:center;'> ESTATUS </th>

        </tr>
        <tr>
        <th bgcolor='#C0C0C0' style='text-align:center;'>Zona</th>
        <th bgcolor='${verde}' style='text-align:center;'>#Ordenes</th>
        <th bgcolor='${amarillo}' style='text-align:center;'>Total Proceso</th>
        <th bgcolor='${naranja}' style='text-align:center; color:white'>%</th>
        <th bgcolor='${verde}' style='text-align:center;'>#Ordenes</th>
        <th bgcolor='${amarillo}' style='text-align:center;'>Total Proceso</th>
        <th bgcolor='${naranja}' style='text-align:center; color:white'>%</th>
        <th bgcolor='${verde}' style='text-align:center;'>#Ordenes</th>
        <th bgcolor='${amarillo}' style='text-align:center;'>Total Proceso</th>
        <th bgcolor='${naranja}' style='text-align:center; color:white'>%</th>
        <th bgcolor='${verde}' style='text-align:center;'>#Ordenes</th>
        <th bgcolor='${amarillo}' style='text-align:center;'>Total Proceso</th>
        <th bgcolor='${naranja}' style='text-align:center; color:white'>%</th>
        <th bgcolor='${verde}' style='text-align:center;'>#Ordenes</th>
        <th bgcolor='${amarillo}' style='text-align:center;'>Total Proceso</th>
        <th bgcolor='${naranja}' style='text-align:center; color:white'>%</th>
        <th bgcolor='${verde}' style='text-align:center;'>#Ordenes</th>
        <th bgcolor='${amarillo}' style='text-align:center;'>Total</th>

      </tr>
    </thead>
    <tbody>
  `

  let cuerpoTabla2 = ``
  const ordenesServicio = ordenesZonas.reduce( (total, orden) =>  total + orden.SERVICIO, 0 )
  const montoServicio = ordenesZonas.reduce( (total, orden) => orden.SUBTOTAL_SERVICIO ? total + orden.SUBTOTAL_SERVICIO : total, 0 )

  const ordenesHYP = ordenesZonas.reduce( (total, orden) =>  total + orden.HYP, 0 )
  const montoHYP = ordenesZonas.reduce( (total, orden) => total + orden.SUBTOTAL_HYP, 0 )

  const ordenesGarantia = ordenesZonas.reduce( (total, orden) =>  total + orden.GARANTIA, 0 )
  const montoGarantia = ordenesZonas.reduce( (total, orden) => total + orden.SUBTOTAL_GARANTIA, 0 )

  const ordenesAnterior = ordenesZonas.reduce( (total, orden) =>  total + orden.numeroAnterior, 0 )
  const montoAnterior = ordenesZonas.reduce( (total, orden) => total + orden.montoAnterior, 0 )

  ordenesZonas.map( linea => {
    cuerpoTabla2 = cuerpoTabla2 + `
    <tr bgcolor=''>

      <th bgcolor='' style='text-align:right;'> ${linea.zona} </th>
      <td style='text-align:center;'> ${linea.SERVICIO} </td>
      <td style='text-align:right;'> ${formatearMonto(linea.SUBTOTAL_SERVICIO)} </td>
      <td style='text-align:right;'> ${formatearPorcentaje(linea.SUBTOTAL_SERVICIO/montoServicio)} </td>

      <td style='text-align:center;'> ${linea.HYP} </td>
      <td style='text-align:right;'> ${formatearMonto(linea.SUBTOTAL_HYP)} </td>
      <td style='text-align:right;'> ${formatearPorcentaje(linea.SUBTOTAL_HYP/montoHYP)} </td>

      <td style='text-align:center;'> ${linea.GARANTIA} </td>
      <td style='text-align:right;'> ${formatearMonto(linea.SUBTOTAL_GARANTIA)} </td>
      <td style='text-align:right;'> ${formatearPorcentaje(linea.SUBTOTAL_HYP/montoGarantia)}  </td>

      <td style='text-align:center;'> ${linea.SERVICIO + linea.HYP + linea.GARANTIA} </td>
      <td style='text-align:right;'> ${formatearMonto(linea.SUBTOTAL_SERVICIO + linea.SUBTOTAL_HYP + linea.SUBTOTAL_GARANTIA)} </td>
      <td style='text-align:right;'> ${formatearPorcentaje(( linea.SUBTOTAL_SERVICIO + linea.SUBTOTAL_HYP + linea.SUBTOTAL_GARANTIA )/(montoServicio + montoHYP + montoGarantia))} </td>

      <td style='text-align:center;'> ${linea.numeroAnterior} </td>
      <td style='text-align:right;'> ${formatearMonto(linea.montoAnterior)} </td>
      <td style='text-align:right;'> ${formatearPorcentaje((linea.montoAnterior)/(montoAnterior))} </td>

      <td bgcolor='${ (linea.GARANTIA + linea.HYP + linea.GARANTIA) > linea.numeroAnterior? negativo : positivo}' style='text-align:center;'></td>
      <td bgcolor='${(linea.SUBTOTAL_GARANTIA + linea.SUBTOTAL_HYP + linea.SUBTOTAL_GARANTIA) > linea.montoAnterior ? negativo : positivo }' style='text-align:right;'></td>

      </tr>
    `
  })

  cuerpoTabla2 = cuerpoTabla2 + `
  <tr bgcolor='#C0C0C0'>
      <th bgcolor='' style='text-align:right;'> TOTAL </th>
      <td style='text-align:center;'> <strong> ${ordenesServicio}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearMonto(montoServicio)}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearPorcentaje(montoServicio / (montoServicio + montoHYP + montoGarantia))}  </strong></td>

      <td style='text-align:center;'> <strong> ${ordenesHYP}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearMonto(montoHYP)}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearPorcentaje(montoHYP / (montoServicio + montoHYP + montoGarantia))}  </strong></td>

      <td style='text-align:center;'> <strong> ${ordenesGarantia}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearMonto(montoGarantia)}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearPorcentaje(montoGarantia / (montoServicio + montoHYP + montoGarantia))}  </strong></td>

      <td style='text-align:center;'> <strong> ${ordenesServicio + ordenesHYP + ordenesGarantia}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearMonto(montoServicio + montoHYP + montoGarantia)}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearPorcentaje(1)} </strong></td>

      <td style='text-align:center;'> <strong> ${ordenesAnterior}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearMonto(montoAnterior)}  </strong></td>
      <td style='text-align:right;'> <strong> ${formatearPorcentaje(1)}  </strong></td>

      <td bgcolor='${ (ordenesServicio + ordenesHYP + ordenesGarantia) > ordenesAnterior? negativo : positivo}' style='text-align:center;'> <strong> </strong></td>
      <td bgcolor='${(montoServicio + montoHYP + montoGarantia) > montoAnterior ? negativo : positivo }' style='text-align:right;'> <strong></td>

    </tr>
    </tbody>
  </table>

  `

  const mensajeDespedida = `<p> Para mas detalle consultar la siguiente liga <a href='https://www.gruvercamiones.mx/powerbi/ordenes_servicio/'> Ordenes de Servicio </a> </p>`

  const mensaje = mensajeInicial + cabeceraTabla1 + cuerpoTabla1 + footerTabla1 + cabeceraTabla2 + cuerpoTabla2 + mensajeDespedida
  +
  `</body>`

  return mensaje

}



// <thead bgcolor='#1052A0' text='white'>




  // <tr>
  //     <td  style=""text-align:left;"">" & rst6.Fields("SUCURSAL").Value & "</td>
  //     <td  style=""text-align:center;"">" & rst6.Fields("<30 DIAS SER").Value & "<br/>" & FormatCurrency(rst6.Fields("<30_MONTO_S").Value, 0) & "</td>
  //     <td " & color & " style=""text-align:center;"">" & rst6.Fields("+30 DIAS SER").Value & "<br/>" & FormatCurrency(rst6.Fields("+30_MONTO_S").Value, 0) & "</td>
  //     <td " & color & " style=""text-align:center;"">" & rst6.Fields("+60 DIAS SER").Value & "<br/>" & FormatCurrency(rst6.Fields("+60_MONTO_S").Value, 0) & "</td>
  //     <td " & color & " style=""text-align:center;"">" & rst6.Fields("+90 DIAS SER").Value & "<br/>" & FormatCurrency(rst6.Fields("+90_MONTO_S").Value, 0) & "</td>

  //   <td " & color & " style=""text-align:center;"">" & rst6.Fields("<30 DIAS HYP").Value & "<br/>" & FormatCurrency(rst6.Fields("<30_MONTO_H").Value, 0) & "</td>
  //       <td " & color & " style=""text-align:center;"">" & rst6.Fields("+30 DIAS HYP").Value & "<br/>" & FormatCurrency(rst6.Fields("+30_MONTO_H").Value, 0) & "</td>
  //       <td " & color & " style=""text-align:center;"">" & rst6.Fields("+60 DIAS HYP").Value & "<br/>" & FormatCurrency(rst6.Fields("+60_MONTO_H").Value, 0) & "</td>
  //       <td " & color & " style=""text-align:center;"">" & rst6.Fields("+90 DIAS HYP").Value & "<br/>" & FormatCurrency(rst6.Fields("+90_MONTO_H").Value, 0) & "</td>

  //   <td " & color & " style=""text-align:center;"">" & rst6.Fields("<30 DIAS GA").Value & "<br/>" & FormatCurrency(rst6.Fields("<30_MONTO_GA").Value, 0) & "</td>
  //       <td " & color & " style=""text-align:center;"">" & rst6.Fields("+30 DIAS GA").Value & "<br/>" & FormatCurrency(rst6.Fields("+30_MONTO_GA").Value, 0) & "</td>
  //       <td " & color & " style=""text-align:center;"">" & rst6.Fields("+60 DIAS GA").Value & "<br/>" & FormatCurrency(rst6.Fields("+60_MONTO_GA").Value, 0) & "</td>
  //       <td " & color & " style=""text-align:center;"">" & rst6.Fields("+90 DIAS GA").Value & "<br/>" & FormatCurrency(rst6.Fields("+90_MONTO_GA").Value, 0) & "</td>
  //       <td bgcolor=""#C0C0C0"" style=""text-align:center;""><strong> ${}" & rst6.Fields("TOTAL").Value & "<br/>" & FormatCurrency(rst6.Fields("TOTAL_M").Value, 0) & "</strong></td>
  //     </tr>




  // <tbody bgcolor='white'>
  //    <tr>
  //      <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Empleado:</td>
  //      <td colspan='3' style='padding: 12px;'> ${formatearNumeroEmpleado(comision?.numeroEmpleado)} - ${formatearCapitalCase(comision?.nombreEmpleado)} </td>
  //    </tr>
  //    <tr>
  //      <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Puesto:</td>
  //      <td colspan='3' style='padding: 12px;'> ${formatearCapitalCase(comision.puesto?.nombrePuesto)} </td>
  //    </tr>
  //    <tr>
  //      <td style='padding: 12px;' bgcolor='#e8eef6'>Periodo:</td>
  //      <td style='padding: 12px;'> '01/Abril/2023 a 15/Abril/2023 </td>
  //      <td style='padding: 12px;' bgcolor='#e8eef6'>Monto:</td>
  //      <td style='padding: 12px;'> ${formatearMonto(comision.montoComision)} </td>
  //    </tr>
  //    <tr>
  //      <td style='padding: 12px;' bgcolor='#e8eef6'>Centro de trabajo:</td>
  //      <td style='padding: 12px;'> MBVE</td>
  //      <td style='padding: 12px;' bgcolor='#e8eef6'> Departamento:</td>
  //      <td style='padding: 12px;'> Refacciones </td>
  //    </tr>
  //    <thead bgcolor='#1052A0' text='white'>
  //    <tr>
  //      <th colspan='4' style='padding: 14px; background-color: #1052A0; color: white;'>Autorizaciones</th>
  //    </tr>
  // </thead>
  //    <tr>
  //      <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Primera:</td>
  //      <td colspan='3' style='padding: 12px;'>  ${descripcionEstadoAutorizacion(comision.primeraAutorizacionEstado)} ${primerResponsable} </td>
  //    </tr>
  //    <tr>
  //      <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Segunda:</td>
  //      <td colspan='3' style='padding: 12px;'>  ${descripcionEstadoAutorizacion(comision.segundaAutorizacionEstado)} ${segundoResponsable} </td>
  //    </tr>
  //    <tr>
  //      <td colspan='1' style='padding: 12px;' bgcolor='#e8eef6'>Tercera:</td>
  //      <td colspan='3' style='padding: 12px;'>  ${descripcionEstadoAutorizacion(comision.terceraAutorizacionEstado)}  ${tercerResponsable} </td>
  //    </tr>
