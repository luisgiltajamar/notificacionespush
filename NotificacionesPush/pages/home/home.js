(function () {
    "use strict";


    function login() {
        NotificacionesPushDemoClient.login("facebook").done(function(res) {
        

            NotificacionesPushDemoClient.invokeApi("usuarios",
        {method:"get"}).done(function(resu) {
                var data = JSON.parse(resu.response);
                sessionStorage.id = data.id;
                guardarDatos(data);
            }, function(err) {
                var a = err;

            });

        });


    }

    function guardarDatos(facebook) {
        var base_url =
            "http://webapiusuariosfacebookpush.azurewebsites.net/api/";
        WinJS.xhr({ url: base_url + "usuarios/" + facebook.id, type: "GET" })
            .done(function(res) {
                    Windows.Networking.PushNotifications.
                        PushNotificationChannelManager.
                        createPushNotificationChannelForApplicationAsync()
                        .then(function(channel) {

                            var user = JSON.parse(res.response);
                            user.channel = channel.uri;
                            WinJS.xhr({
                                url: base_url + "usuarios/" + user.idFacebook,
                                type: "put",  responseType: "json",
                                headers: {"content-Type":"application/json"},
                                data: JSON.stringify(user)
                            }).done(function () {
                                cambiarVista();
                                return NotificacionesPushDemoClient.push.
                                    registerNative(channel.uri);


                            });
                        });
                },
                function(err) {
                    Windows.Networking.PushNotifications.
                        PushNotificationChannelManager.
                        createPushNotificationChannelForApplicationAsync()
                        .then(function(channel) {
                            var usr = {
                                idFacebook: facebook.id,
                                nombre: facebook.name,
                                channel: channel.uri
                            };
                        var dataTxt = JSON.stringify(usr);
                            WinJS.xhr({
                                url: base_url + "usuarios",
                                type: "post",
                                data: dataTxt,
                                responseType: "json",
                                headers: { "content-Type": "application/json" }
                            }).done(function () {
                                    cambiarVista();
                                return NotificacionesPushDemoClient.push.
                                    registerNative(channel.uri);


                            },
                                function(erro) {
                                    var a = erro;
                                }
                            );
                        });

                });
    }

    function cambiarVista() {
        
        var base_url =
            "http://webapiusuariosfacebookpush.azurewebsites.net/api/";
        WinJS.xhr({ url: base_url + "usuarios/", type: "GET" }).done(
            function(res) {
                var usr = JSON.parse(res.response);

                for (var i = 0; i < usr.length; i++) {
                    var ele = document.createElement("option");
                    ele.setAttribute("value", usr[i].idFacebook);
                    var txt = document.createTextNode(usr[i].nombre);
                    ele.appendChild(txt);
                    document.getElementById("ddlUsuario").appendChild(ele);
                }

                document.getElementById("login").style.display = "none";
                document.getElementById("mensajes").style.display = "block";

            }
        );


    }
    function enviar() {
        var base_url =
            "http://webapiusuariosfacebookpush.azurewebsites.net/api/";
        var ddl = document.getElementById("ddlUsuario");
        var dest = ddl.options[ddl.selectedIndex].value;
        var obj = {
            idOrigen: sessionStorage.id,
            idDestino: dest,
            texto: document.getElementById("txtMensaje").value
        }
        var dataTxt = JSON.stringify(obj);
        WinJS.xhr({
            url: base_url + "mensajes",
            type: "post",
            data: dataTxt,
            responseType: "json",
            headers: { "content-Type": "application/json" }
        }).done(function() {

            WinJS.xhr({
                url: base_url + "usuarios/" + dest,
                type: "get",
                data: dataTxt,
                responseType: "json",
                headers: { "content-Type": "application/json" }
            }).done(function(res) {
                var usuario = JSON.parse(res.response);
                NotificacionesPushDemoClient.invokeApi("notificarmensaje",
        { method: "post", body: { cadena: document.getElementById("txtMensaje").value, uri: "Facebook:"+dest } }).
                    done(function () { }, 
                    function(error) {
                        var errorr = error;
                    });
            }, function(err) {
                var e = err;

            });


        });


    }

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function(element, options) {
            document.getElementById("btnLogin").addEventListener("click",
                login);
            document.getElementById("btnSubmit").addEventListener("click", enviar);


        }
    });

})();
