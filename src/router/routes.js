const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ 'pages/LoginPage.vue')
  },
  {
    path: '/principal',
    name: 'principal',
    meta: { auth: true },
    component: () => import(/* webpackChunkName: "principal" */ 'layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        icono: 'dashboard',
        label: 'Inicio',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/dashboard/DashBoard.vue')
      },
      {
        path: 'panel_control',
        icono: 'admin_panel_settings',
        label: 'Panel de control',
        name: 'panelControl',
        component: () => import(/* webpackChunkName: "panel_control" */'src/modules/panelControl/PanelControl.vue')
      },
      {
        path: 'solicitudes',
        icono: 'description',
        label: 'Mis solicitudes',
        name: 'solicitudes',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/solicitudes/MisSolicitudes.vue')
      },
      {
        path: 'misAutorizaciones',
        icono: 'rule',
        label: 'Mis autorizaciones',
        name: 'misAutorizaciones',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/solicitudes/MisAutorizaciones.vue')
      },
      {
        path: 'prorrogas',
        icono: 'pending_actions',
        label: 'Solicitud de prórroga',
        name: 'prorrogas',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/prorrogas/MisProrrogas.vue')
      },
      {
        path: 'historialSolicitudes',
        icono: 'description',
        label: 'Historial de solicitudes',
        name: 'historialSolicitudes',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/historialSolicitudes/HistorialSolicitudes.vue')
      },
      {
        path: 'asistencia',
        icono: 'calendar_month',
        label: 'Asistencias',
        name: 'asistencia',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/asistencia/AsistenciasModule.vue')
      },
      {
        path: 'faltas',
        icono: 'insert_invitation',
        label: 'Faltas',
        name: 'faltas',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/asistencia/FaltasModule.vue')
      },
      {
        path: 'diasGanados',
        icono: 'fact_check',
        label: 'Días Ganados',
        name: 'diasGanados',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/diasGanados/DiasGanadosModule.vue')
      },
      {
        path: 'incapacidades',
        icono: 'local_hospital',
        label: 'Incapacidades',
        name: 'incapacidades',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/incapacidades/IncapacidadesModule.vue')
      },
      {
        path: 'catalogoUsuarios',
        icono: 'person_search',
        label: 'Catálogo Usuarios',
        name: 'catalogoUsuarios',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/catalogo/CatalogoUsuariosModule.vue')
      },
      {
        path: 'catalogoVacaciones',
        icono: 'format_list_numbered',
        label: 'Catálogo Vacaciones',
        name: 'catalogoVacaciones',
        component: () => import(/* webpackChunkName: "dashboard" */'src/modules/catalogo/CatalogoVacacionesModule.vue')
      },

    ]
  },
  {
    path: '/cambiar/contrasena',
    name: 'cambiarContrasena',
    component: () => import(/* webpackChunkName: "cambiarContrasena" */ 'pages/CambiarContrasenia.vue')
  }
]

export default routes
