function changeController(controller) {
    var scope = angular.element($('.content')).scope();
    scope.template_url = controller;
    document.location.hash = "#" + controller;
    document.title = "Sheriff - " + controller.capitalize();
}
function changeLoginState(islogged) {
    var scope = angular.element($('body')).scope();
    scope.loginstate = islogged;
    scope.$apply();
}



app.controller('Content', function($scope) {

    if (document.location.hash.length > 0) {
        changeController(document.location.hash.replace("#!#", ""));
    } else {
        changeController("status");
    }
    

    $scope.loaded = function() {
        $('.box >h3').append('<button type="button" class="toggle"><span class="fa fa-caret-up"></span></button>');

        if ($('#editor').length) {
            CKEDITOR.replace('editor');
        }

        $.each(localStorage, function(key, val) {
            if (!key.indexOf('box_')) {
                $('#' + (key.replace('box_', '')) + ' .toggle').trigger('click');
            }
        });
        
        var interval = setInterval(function(){
           var selector = $('ul>li[data-controller="' + $scope.template_url + '"]');
            selector.trigger('click'); 
            clearInterval(interval);
        },100);
          
    };
    
    
    $scope.changeController= function(event){
         var scope = angular.element($('.sidebar')).scope();
        scope.changeController(event);
    }
    
});

app.controller('navbar', function($scope, $compile, Sheriff) {

var request = Sheriff.get("/info")
        .then(function successCallback(response) {
            $scope.server = response.data.server;
            $scope.version = response.data.version;
        })
        .catch(function(error){
            $scope.error = error.data;
        });
});

app.controller('sidebar', function($scope, $compile) {
    $scope.changeController = function($event) {
        $.each($('ul>li.active'), function(n, e) {
            $(e).removeClass('active');
        });

        var elem = $($event.currentTarget);
        var controller = elem.data('controller');

        if (elem.parent().hasClass('dropdown-menu')) {
           elem.parent().parent().addClass('active');
            if(!$(".sidebar").hasClass("fix")) elem.parent().parent().find('.sub-menu').find('li[data-controller="' + controller + '"]').addClass('active');
        }
        if (elem.parent().hasClass('sub-menu')) {
           if(!$(".sidebar").hasClass("fix"))  elem.parent().parent().addClass('active');
        }
        elem.addClass('active');



        changeController(controller);


    };
    $scope.loaded = function() {
        $('.sidebar >ul >li').each(function() {
            if ($('.sub-menu', this).length) {
                var html = $('.sub-menu', this).html();
                var elem = $('<ul dropdown class="dropdown-menu">' + html + '</ul>').appendTo(this);
                $compile(elem)($scope);
            }
        });

        if (localStorage.getItem('sidebar')) {
            $('.sidebar .collapse-menu').trigger('click');
        }

    };
});
app.controller('main', function($scope, $compile, Sheriff) {
    var request = Sheriff.connect(localStorage.access_token)
        .then(function successCallback(response) {
            $scope.loginstate = true;
            
        }, function errorCallback(response) {
            $scope.loginstate = false;
     
           $('.msg').removeClass('info').addClass('error')
            .html("Sunucuya bağlanılamadı. :(<br><strong>Hata kodu : "+response.status+" "+response.statusText+"</strong><br><strong>Hata Mesajı : "+response.data.message +"</strong>")
               .fadeIn('slow');


        });
});
app.controller('login', function($scope, $injector, Sheriff) {

    $scope.login = function() {

        var username = $("#username").val();
        var password = $("#password").val();
        localStorage.access_token = $.md5(username + password);

        var request = Sheriff.connect(localStorage.access_token)

            .then(function successCallback(response) {
                    $('.msg').removeClass('error').addClass('info')
                        .html("Başarıyla giriş yapıldı.").fadeIn('slow');
                    console.log(response);

                    setTimeout(function() {
                        changeLoginState(true);
                    }, 1000);

                },
                function errorCallback(response) {

                    $('.msg').removeClass('info').addClass('error')
                        .html(
                            String.format(
                                "Giriş hatası : {0} <br>Hata kodu : <strong>{1}</strong>",
                                response.data.message,
                                response.status
                            )).fadeIn('slow');

                });



    };

    $scope.loaded = function() {
        $('.msg').hide();
    };
});



app.controller('Status',function($scope,Sheriff,settings){
    
        window.bytesToSize = function(bytes) {
            if(bytes < 1024) return bytes + " B";
            else if(bytes < 1048576) return(bytes / 1024).toFixed(2) + " KB";
            else if(bytes < 1073741824) return(bytes / 1048576).toFixed(2) + " MB";
            else return(bytes / 1073741824).toFixed(2) + " GB";
        };
        window.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };

        $scope.app = settings;
        var navbar = angular.element($('.navbar')).scope();

        var request = Sheriff.get("/info")
                    .then(function successCallback(response) {

                        navbar.server = response.data.server;
                        navbar.version = response.data.version;

                        $scope.server = response.data.server;
                        $scope.version = response.data.version;
                        $scope.buildtime = response.data.buildtime;
                        $scope.developer = response.data.developer;

                    })
                    .catch(function(error){

                        $scope.error = error.data;

                    });
    
    

   


    var memorychartconfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Bellek Kullanımı (Sistem)",
                fill: false,
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                pointStyle: 'rectRot',
                pointRadius: 5,
                data: []

            },{
                label: "Bellek kullanımı (Sheriff)",
                fill: false,
                backgroundColor: window.chartColors.orange,
                borderColor: window.chartColors.orange,
                pointStyle: 'rectRot',
                pointRadius: 5,
                data: [ ]
            }]
        },
        options: {
            responsive: true,        
            legend: {
                    labels: {
                        usePointStyle: true
                    }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(label, index, labels) {
                            return bytesToSize(label);
                        }
                    }
                }]
            }

        }
    };
    var cpuchartconfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [ {
                label: "İşlemci kullanımı (Sistem)",
                fill: false,
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                pointStyle: 'rectRot',
                pointRadius: 5,
                data: [ ]
            },{
                label: "İşlemci kullanımı (Sheriff)",
                fill: false,
                backgroundColor: window.chartColors.purple,
                borderColor: window.chartColors.purple,
                pointStyle: 'rectRot',
                pointRadius: 5,
                data: [ ]
            }]
        },
        options: {
            responsive: true,        
            legend: {
                    labels: {
                        usePointStyle: true
                    }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(label, index, labels) {
                            return label.toFixed(2)+"%";
                        }
                    }
                }]
            }
        }
    };

    var ctxmemory = document.getElementById("livememory").getContext("2d");
    var chartmemory = new Chart(ctxmemory, memorychartconfig);

    var ctxcpu = document.getElementById("livecpu").getContext("2d");
    var chartcpu = new Chart(ctxcpu, cpuchartconfig);
    


    var charinterval = setInterval(function(){
        
        getdata();
        
    },localStorage.graphicRefreshRate*1000);

    setTimeout(function(){
            getdata();
    },1);
    
    var getdata = function(){
            Sheriff.get("/info")
                .then(function successCallback(response) {
                    var date = new Date;
                    memorychartconfig.data.datasets[0].data.push(response.data.Performance.Machine.usedram);
                    memorychartconfig.data.datasets[1].data.push(response.data.Performance.Application.usedram);

                    memorychartconfig.data.labels.push(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());


                    cpuchartconfig.data.datasets[0].data.push(response.data.Performance.Machine.processortime);
                    cpuchartconfig.data.datasets[1].data.push(response.data.Performance.Application.processortime);

                    cpuchartconfig.data.labels.push(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());



                    if(memorychartconfig.data.labels.length>5){
                        memorychartconfig.data.datasets[0].data.shift();
                        memorychartconfig.data.datasets[1].data.shift();
                        memorychartconfig.data.labels.shift();
                        cpuchartconfig.data.datasets[0].data.shift();
                        cpuchartconfig.data.datasets[1].data.shift();
                        cpuchartconfig.data.labels.shift();

                    }


                    chartcpu.update();
                    chartmemory.update();



                },
                function errorCallback(response) {
                    
                    clearInterval(charinterval);
                
                    if(response.status == 401) changeLoginState(false);
                
                });
    }


});


app.controller('Plugins',function($scope,Sheriff){
    
    
    $scope.displaylimit = 5;
    $scope.currentIndex = 0;
    $scope.nextPage = function(){
        if($scope.currentIndex + $scope.displaylimit< $scope.plugins.length-1 ){
            $scope.currentIndex+=$scope.displaylimit;
        }
    }
    $scope.previousPage = function(){
        if($scope.currentIndex > 0){
            $scope.currentIndex-=$scope.displaylimit;
        }
    }

    Sheriff.get("/plugin/getall")
        .then(function successCallback(response) {

            $scope.plugins = response.data.Plugins;
            console.log(response);

        },
        function errorCallback(response) {

            clearInterval(charinterval);

            if(response.status == 401) changeLoginState(false);

        });
    
    $scope.enablePlugin = function(plugin){
       
        Sheriff.get("/plugin/"+plugin.ID+"/start")
                .then(function successCallback(response) {

                    plugin.Status = true;

                },
                function errorCallback(response) {

                    if(response.status == 401) changeLoginState(false);

                });
    };
    
    $scope.disablePlugin = function(plugin){

        
             Sheriff.get("/plugin/"+plugin.ID+"/stop")
                .then(function successCallback(response) {

                    plugin.Status = false;

                },
                function errorCallback(response) {

                    if(response.status == 401) changeLoginState(false);

                });
    };
    
    
    $scope.openSettings = function(plugin){
        
        localStorage.plugin = JSON.stringify(plugin);
        changeController("pluginsettings");
        
    };
    
    

});
app.controller('PluginAdd',function($scope,Sheriff){
    
    $scope.upload = function($event){
          setTimeout(function() {
              $("input",$event.currentTarget).trigger('click');
     
          }, 1);
    };
    
        
    $scope.changed = function($event){
       var filename = $('input[type=file]').prop('files')[0]['name'];
       $scope.file = filename;
        
        setTimeout(function(){
            $scope.status.push("Yükleme başladı.");
            setTimeout(function(){
                $scope.status.push("Yükleme başarılı.");
                 setTimeout(function(){
                     $scope.status.push("Eklenti ekleniyor.");
                        setTimeout(function(){
                               setTimeout(function(){
                                    $scope.file = null;
                                    $scope.status = [];
                               },1350);
                             $scope.status.push("Başarılı.");
                          
                         },1350);
                 },1530);
            },5230);
        },3000);
    }
    
    $scope.status = [];

});
app.controller('PluginSettings',function($scope,Sheriff){
        if(localStorage.plugin == null) changeController("plugins");
        $scope.plugin = JSON.parse(localStorage.plugin);
    
        Sheriff.get("/plugin/"+$scope.plugin.ID+"/settings/getall")
            .then(function successCallback(response) {

                $scope.settings = response.data.Settings;
                
            
                setTimeout(function(){
                     $("input[data-val='false']").prop('checked', false);
                     $("input[data-val='true']").prop('checked', true);
                },10);
               
            },
            function errorCallback(response) {

                if(response.status == 401) changeLoginState(false);

            });
        
        $scope.settingChanged = function(setting){
            

            Sheriff.get("/plugin/"+$scope.plugin.ID+"/settings/set", {key : setting.Key , value:setting.Value})
                .then(function successCallback(response) {
                    setting.Value.splice(index,1,value.value);
                },
                function errorCallback(response) {

                    if(response.status == 401) changeLoginState(false);
                });
        };
    
        $scope.addValue = function(setting){
            setting.Value.push({value:null,isnew:true});
        };
    
        $scope.applyValue = function(index,setting){
           var value = setting.Value[index];
            
            $scope.network = true;     
            Sheriff.get("/plugin/"+$scope.plugin.ID+"/settings/set", {key : setting.Key , value:[value.value]})
                .then(function successCallback(response) {
                
                    setting.Value.splice(index,1,value.value);
 
                },
                function errorCallback(response) {

                    if(response.status == 401) changeLoginState(false);
                });
        };
    
        $scope.removeValue = function(index,setting){
            
            var removed = setting.Value[index];
            
            
            Sheriff.get("/plugin/"+$scope.plugin.ID+"/settings/remove", {key : setting.Key , value : removed})
                .then(function successCallback(response) {
                    setting.Value.splice(index,1);
                },
                function errorCallback(response) {

                    if(response.status == 401) changeLoginState(false);

                });
        };
});


app.controller('Services',function($scope,Sheriff){
              
    $scope.displaylimit = 5;
    $scope.currentIndex = 0;
    $scope.nextPage = function(){
        if($scope.currentIndex + $scope.displaylimit< $scope.services.length ){
            $scope.currentIndex+=$scope.displaylimit;
        }
    }
    $scope.previousPage = function(){
        if($scope.currentIndex > 0){
            $scope.currentIndex-=$scope.displaylimit;
        }
    }

    
    Sheriff.get("/service/getall")
    .then(function successCallback(response) {

        $scope.services = response.data.Services;


    },
    function errorCallback(response) {



        if(response.status == 401) changeLoginState(false);

    });
    
    
    $scope.startService = function(service){
        
        
        Sheriff.get("/service/"+service.ID+"/start")
            .then(function successCallback(response) {
                service.Status = true;
            },
            function errorCallback(response) {
                if(response.status == 401) changeLoginState(false);
            });
    }
    
    $scope.stopService = function(service){
       
        if(service.Class == "Sheriff.Http.ApiServer" && $scope.info == null){
            $scope.info = "Eğer bu servisi durdurursanız Sheriff Manager'e erişemeyebilirsiniz.";
            return;
        }
        
        $scope.info = null;
        
        Sheriff.get("/service/"+service.ID+"/stop")
            .then(function successCallback(response) {
                service.Status = false;
            },
            function errorCallback(response) {
                if(response.status == 401) changeLoginState(false);
            });
    }
    
    $scope.viewService = function(service){
        
        localStorage.service = JSON.stringify(service);
        changeController("serviceview");
    }
    
});
app.controller('ServiceView',function($scope,Sheriff,settings){
    if(localStorage.service == null) changeController("services");
    $scope.service = JSON.parse(localStorage.service);
    
});

app.controller('Logs',function($scope,Sheriff){
    
     Sheriff.get("/logs")
        .then(function successCallback(response) {

        $scope.logs = response.data.Logs;


    },
        function errorCallback(response) {


        if(response.status == 401) changeLoginState(false);

    });
    
});

app.controller('Settings',function($scope,Sheriff,settings){
    $scope.app = settings;
    $scope.localStorage = localStorage;
    
    $scope.reset = function(){
        localStorage.graphicRefreshRate = 1;
    }
});















