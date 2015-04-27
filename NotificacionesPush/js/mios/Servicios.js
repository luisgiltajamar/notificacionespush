var base_url ="http://webapiusuariosfacebookpush.azurewebsites.net/api/";


function login() {
    return NotificacionesPushDemoClient.login("facebook");


}


function getFacebookDetails() {
    return NotificacionesPushDemoClient.invokeApi("usuarios",
    { method: "get" });
}

function getUserDetails(id) {
    return WinJS.xhr({ url: base_url + "usuarios/" + id, type: "GET" });

}

function getUsuarios() {

    return WinJS.xhr({ url: base_url + "usuarios/", type: "GET" });

}

function insertarUser(user) {
    var usr = JSON.stringify(user);
    return WinJS.xhr({
        url: base_url + "usuarios",
        type: "post",
        data: usr,
        responseType: "json",
        headers: { "content-Type": "application/json" }
    });


}

function updateUsuario(user) {
    return WinJS.xhr({
        url: base_url + "usuarios/" + user.idFacebook,
        type: "put",
        responseType: "json",
        headers: { "content-Type": "application/json" },
        data: JSON.stringify(user)
    });
}

function sendMensaje(mensaje) {

    var dataTxt = JSON.stringify(mensaje);
    return WinJS.xhr({
        url: base_url + "mensajes",
        type: "post",
        data: dataTxt,
        responseType: "json",
        headers: { "content-Type": "application/json" }
    });

}


WinJS.Namespace.define("Servicios", {
    login: login,
    detalleFacebook: getFacebookDetails,
    getUsuario: getUserDetails,
    insertarUsuario: insertarUser,
    actualizarUsuario: updateUsuario,
    ObtenerUsuarios: getUsuarios,
    enviarMensaje:sendMensaje
});