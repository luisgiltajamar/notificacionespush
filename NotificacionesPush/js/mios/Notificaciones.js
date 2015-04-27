function RegistrarChannel() {
    return Windows.Networking.PushNotifications.
        PushNotificationChannelManager.
        createPushNotificationChannelForApplicationAsync();

}

function EnviarNotificacion(obj) {

    return NotificacionesPushDemoClient.invokeApi("notificarmensaje",
    { method: "post", body: { cadena: obj.texto, uri: obj.destino } });

}

WinJS.Namespace.define("Notificaciones", { Registro: RegistrarChannel,enviar:EnviarNotificacion });