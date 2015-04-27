(function () {
    "use strict";


    function login() {
        NotificacionesPushDemoClient.login("facebook").done(function(res) {
        

            NotificacionesPushDemoClient.invokeApi("usuarios",
        {method:"get"}).done(function(resu) {
                var data = JSON.parse(resu.response);

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
                            }).done(function() {
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
                            }).done(function() {
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

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("btnLogin").addEventListener("click",
                login);
            document.getElementById("btnSubmit").addEventListener("click",
                function () {
                        var obj= {
                            asunto: document.getElementById("txtAsunto").value,
                            texto: document.getElementById("txtMensaje").value


                        }

                        NotificacionesPushDemoClient.getTable("mensaje").
                            insert(obj).done(function() {
                           


                            },
                        function () {
                           


                        }
                        );

                });
        }
    });
})();
