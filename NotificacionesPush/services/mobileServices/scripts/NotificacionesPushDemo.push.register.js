// http://go.microsoft.com/fwlink/?LinkID=290993&clcid=0x409
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind == activation.ActivationKind.launch) {
            // Note: in the simulator this code will go throw the error path
          
               /* .done(function (registration) {
                    return NotificacionesPushDemoClient
                        .invokeApi("notifyAllUsers",
                        { body: { toast: "Sample Toast" } });
                }, function (error) {
                    // Error

                })*/;
        }
    });
})();