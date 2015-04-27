(function () {
    "use strict";


    function login() {
       Servicios.login().done(function(res) {
           Servicios.detalleFacebook()
           .done(function(resu) {
                var data = JSON.parse(resu.response);
                sessionStorage.id = data.id;
                guardarDatos(data);
            }, function(err) {
                var a = err;

            });

        });


    }

    function guardarDatos(facebook) {
       
       Servicios.getUsuario(facebook.id).done(function(res) {
                    Notificaciones.Registro()
                        .then(function(channel) {

                            var user = JSON.parse(res.response);
                            user.channel = channel.uri;
                            Servicios.actualizarUsuario(user).
                                done(function () {

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
                       
                           Servicios.insertarUsuario(usr).done(function () {
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

    function cargarCombo(usr) {
        for (var i = 0; i < usr.length; i++) {
            var ele = document.createElement("option");
            ele.setAttribute("value", usr[i].idFacebook);
            var txt = document.createTextNode(usr[i].nombre);
            ele.appendChild(txt);
            document.getElementById("ddlUsuario").appendChild(ele);
        }

    }

    function cambiarVista() {
        
      
       Servicios.ObtenerUsuarios().done(
            function(res) {
                var usr = JSON.parse(res.response);
                cargarCombo(usr);
                

                document.getElementById("login").style.display = "none";
                document.getElementById("mensajes").style.display = "block";

            }
        );


    }
    function enviar() {
       
        var ddl = document.getElementById("ddlUsuario");
        var dest = ddl.options[ddl.selectedIndex].value;
        var obj = {
            idOrigen: sessionStorage.id,
            idDestino: dest,
            texto: document.getElementById("txtMensaje").value
        }
       
       Servicios.enviarMensaje(obj).done(function() {
           var mensaje = {
               texto: obj.texto,
               destino: "Facebook:" + dest
           };
       
           Notificaciones.enviar(mensaje).
                    done(function () { }, 
                    function(error) {
                        var errorr = error;
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
