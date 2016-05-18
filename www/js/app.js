'use strict';

angular.module('myApp', ['ngRoute'])
        .factory('BackgroundService', [function () {
                var currentBackgroundClass = 'view-1-background view-2-background view-3-background view-4-background view-5-background view-6-background view-H-background view-G-background view-L-background view-R-background view-T-background home-background';
                return  {
                    setCurrentBg: function (c) {
                        currentBackgroundClass = c;
                    },
                    getCurrentBg: function () {
                        return currentBackgroundClass;
                    }
                };
            }])
        .controller('MainController', ['$scope', 'BackgroundService', function ($scope, backgroundService) {
                $scope.bgService = backgroundService;

            }])
        .service('SettingsService', function () {
            var _variables = {};

            return {
                get: function (varname) {
                    return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
                },
                set: function (varname, value) {
                    _variables[varname] = value;
                }
            };
        })
        .service('State', function () {
            var property = 'none';

            return {
                getProperty: function () {
                    return property;
                },
                setProperty: function (value) {
                    property = value;
                }
            };
        })
        .directive('iframeOnload', [function () {
                return {
                    scope: {
                        callBack: '&iframeOnload'
                    },
                    link: function (scope, element, attrs) {
                        element.on('load', function () {
                            return scope.callBack();
                        });
                    }
                };
            }])
        .directive('myDatepicker', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    $(function () {
                        element.datepicker({
                            showOn: "both",
                            changeYear: true,
                            changeMonth: true,
                            dateFormat: 'yy-mm-dd',
                            maxDate: new Date(),
                            yearRange: '1914:2014',
                            onSelect: function (dateText, inst) {
                                ngModelCtrl.$setViewValue(dateText);
                                scope.$apply();
                            }
                        });
                    });
                }
            };
        })
        .directive('barssum', ['$parse', function ($parse) {
                return {
                    restrict: 'E',
                    replace: true,
                    template: '<div id="chartsum" ></div>',
                    link: function (scope, element, attrs) {
                        var data = attrs.data.split(',');

                        console.log(data)
                        var width = parseInt(d3.select('body').style('width'), 10) / 10,
                                height = parseInt(d3.select('body').style('height'), 10) / 10,
                                radius = Math.min(width, height) / 2 - 10;

                        // var data = d3.range(10).map(Math.random).sort(d3.descending);

                        var color = d3.scale.category20();

                        var arc = d3.svg.arc()
                                .outerRadius(radius);

                        var pie = d3.layout.pie();

                        var svg = d3.select("#chartsum").append("svg")
                                .datum(data)
                                .attr("width", width)
                                .attr("height", height)
                                .append("g")
                                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                        var arcs = svg.selectAll("g.arc")
                                .data(pie)
                                .enter().append("g")
                                .attr("class", "arc");

                        arcs.append("path")
                                .attr("fill", function (d, i) {
                                    return color(i);
                                })
                                .transition()
                                .ease("bounce")
                                .duration(2000)
                                .attrTween("d", tweenPie)
                                .transition()
                                .ease("elastic")
                                .delay(function (d, i) {
                                    return 2000 + i * 50;
                                })
                                .duration(750)
                                .attrTween("d", tweenDonut);

                        function tweenPie(b) {
                            b.innerRadius = 0;
                            var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
                            return function (t) {
                                return arc(i(t));
                            };
                        }

                        function tweenDonut(b) {
                            b.innerRadius = radius * .6;
                            var i = d3.interpolate({innerRadius: 0}, b);
                            return function (t) {
                                return arc(i(t));
                            };
                        }
                    }
                };
            }])
        .directive('barsavg', ['$parse', function ($parse) {
                return {
                    restrict: 'E',
                    replace: true,
                    template: '<div id="chartavg"></div>',
                    link: function (scope, element, attrs) {
                        var data = attrs.data.split(',');

                        console.log(data)
                        var chart = d3.select('#chartavg')
                                .append("div").attr("class", "chartavg")
                                .selectAll('div')
                                .data(data).enter()
                                .append("div")
                                .transition().ease("elastic")
                                .style("width", function (d) {
                                    return d + "%";
                                })
                                .text(function (d) {
                                    return d + "";
                                });
                    }
                };
            }])
        .directive("sparklinechart", [function () {

                return {
                    restrict: "E",
                    scope: {
                        data: "@"
                    },
                    compile: function (tElement, tAttrs, transclude) {
                        tElement.replaceWith("<span>" + tAttrs.data + "</span>");
                        return function (scope, element, attrs) {
                            attrs.$observe("data", function (newValue) {
                                element.html(newValue);
                                element.sparkline('html',
                                        {type: 'line',
                                            width: '100%',
                                            height: '100px',
                                            lineColor: '#8688c7',
                                            barWidth: 11,
                                            sliceColors: ['#8688c7', '#1aacc3', '#9de49d', '#9074b1', '#66aa00', '#dd4477'],
                                            barColor: '#1aacc3',
                                            borderWidth: 1,
                                            borderColor: '#8688c7',
                                            tooltipFormat: '<span style="color: {{color}}">&#9679;</span> {{offset:names}} ({{percent.1}}%)',
                                            tooltipValueLookups: {
                                                'names': {
                                                    0: 'acuracia ',
                                                    1: 'velocidade',
                                                    2: 'estabilidade'
                                                }
                                            }

                                        }
                                );
                            });
                        };
                    }
                };
            }])
        .filter('trusted', ['$sce', function ($sce) {
                return function (url) {
                    return $sce.trustAsResourceUrl(url);
                };
            }])
        .directive('linearChart', function ($window) {
            return{
                restrict: 'EA',
                template: "<svg width='850' height='200'></svg>",
                link: function (scope, elem, attrs) {
                    var salesDataToPlot = scope[attrs.chartData];
                    var padding = 20;
                    var pathClass = "path";
                    var xScale, yScale, xAxisGen, yAxisGen, lineFun;

                    var d3 = $window.d3;
                    var rawSvg = elem.find('svg');
                    var svg = d3.select(rawSvg[0]);

                    function setChartParameters() {

                        xScale = d3.scale.linear()
                                .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length - 1].hour])
                                .range([padding + 5, rawSvg.attr("width") - padding]);

                        yScale = d3.scale.linear()
                                .domain([0, d3.max(salesDataToPlot, function (d) {
                                        return d.sales;
                                    })])
                                .range([rawSvg.attr("height") - padding, 0]);

                        xAxisGen = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom")
                                .ticks(salesDataToPlot.length - 1);

                        yAxisGen = d3.svg.axis()
                                .scale(yScale)
                                .orient("left")
                                .ticks(5);

                        lineFun = d3.svg.line()
                                .x(function (d) {
                                    return xScale(d.hour);
                                })
                                .y(function (d) {
                                    return yScale(d.sales);
                                })
                                .interpolate("basis");
                    }

                    function drawLineChart() {

                        setChartParameters();

                        svg.append("svg:g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0,180)")
                                .call(xAxisGen);

                        svg.append("svg:g")
                                .attr("class", "y axis")
                                .attr("transform", "translate(20,0)")
                                .call(yAxisGen);

                        svg.append("svg:path")
                                .attr({
                                    d: lineFun(salesDataToPlot),
                                    "stroke": "blue",
                                    "stroke-width": 2,
                                    "fill": "none",
                                    "class": pathClass
                                });
                    }

                    drawLineChart();
                }
            };
        })

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.otherwise({redirectTo: '/viewH'});
                $routeProvider.when('/viewH', {
                    templateUrl: 'tpl/viewH.html',
                    controller: 'ViewHTabCtrl'
                });
                $routeProvider.when('/viewL', {
                    templateUrl: 'tpl/viewL.html',
                    controller: 'ViewLTabCtrl'
                });
                $routeProvider.when('/viewT', {
                    templateUrl: 'tpl/viewT.html',
                    controller: 'ViewTCtrl'
                });
                $routeProvider.when('/viewG', {
                    templateUrl: 'tpl/viewG.html',
                    controller: 'ViewGTabCtrl'
                });
                $routeProvider.when('/view6', {
                    templateUrl: 'tpl/view6.html',
                    controller: 'View6Ctrl'
                });
                $routeProvider.when('/viewP', {
                    templateUrl: 'tpl/viewP.html',
                    controller: 'ViewPTabCtrl'
                });
                $routeProvider.when('/view4', {
                    templateUrl: 'tpl/view4.html',
                    controller: 'RankingCtrl'
                });
                $routeProvider.when('/view3', {
                    templateUrl: 'tpl/view3.html',
                    controller: 'DashboardCtrl'
                });
                $routeProvider.when('/view2', {
                    templateUrl: 'tpl/view2.html',
                    controller: 'View2Ctrl'
                });
                $routeProvider.when('/view1', {
                    templateUrl: 'tpl/view1.html',
                    controller: 'View1Ctrl'
                });

            }])
        .controller('ViewHTabCtrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {

                BackgroundService.setCurrentBg("view-h-background");
                $scope.hidden = "hidden";
                $scope.points = [];
                $scope.stateProfessor = false;
                $scope.stateAdmin = false;
                $scope.statePlayer = false;
                $scope.stateGamer = false;
                $scope.stateMeasurements = 0;
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
                $scope.goPath = function (view) {
                    $location.path(view);
                };
                $scope.cleanUser = function () {

                    $scope.statePlayer = false;
                    $scope.user = {
                        idusers: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        nascimento: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        playerId: 0,
                        day: '',
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: '',
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

                };

                if ($scope.user.idusers > 0) {
                    $scope.statePlayer = true;
                    console.log("statePlayer:" + $scope.user.idusers);
                } else {
                    $scope.statePlayer = false;
                    $scope.cleanUser();
                }

                if ($scope.measurements.length > 0) {
                    $scope.stateMeasurements = true;
                    console.log("stateMeasurements:" + $scope.measurements.length);
                } else {
                    $scope.stateMeasurements = false;
                    //$scope.cleanUser();
                }
                $timeout(function () {
                    $scope.hidden = "";

                }, 100);


            }])

        .controller('ViewLTabCtrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
                BackgroundService.setCurrentBg("view-l-background");
                $scope.points = [];
                $scope.statePlayer = false;
                $scope.statePoints = false;
                $scope.stateSendPoints = false;
                $scope.stateAdmin = false;
                $scope.stateGamer = false;

                $scope.hidden = "hidden";
                $scope.off = "hidden";
                $scope.message = "Bem vindo!";
                $scope.title = "Perfil do Jogador";
                $scope.circles = [];
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
                $scope.crypta = "https://escoladocerebro.org/crypta.php";
                $scope.ec_query_players = 'https://escoladocerebro.org/eduscada/c/index.php/ec_query_players';

                $scope.cleanUser = function () {

                    $scope.statePlayer = false;

                    $scope.user = {
                        playerId: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        nascimento: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        idusers: 0,
                        day: '',
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                    $scope.showAlert("Nenhum jogador definido.");
                };
                $scope.showProfessor = function () {

                    $timeout(function () {
                        // myPopup.close(); //close the popup after 3 seconds for some reason
                    }, 3000);
                };
                $scope.show = function () {
                    $scope.hidden = "alert";
                };
                $scope.hide = function () {

                    $scope.hidden = "hidden";
                };
                $scope.showAlert = function (txt) {
                    $scope.hidden = "alert";
                    $scope.message = txt;

                };
                $scope.closeAlert = function (txt) {

                    $scope.hidden = "hidden";

                };
                $scope.checkDash = function (player) {

                    $.getJSON($scope.ec_query_players, {action: "dashboardbyuser", idusers: player})
                            .done(function (json) {
                                if (json !== null) {

                                    $scope.dashboard = JSON.parse(json)[0];
                                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

                                } else {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            $scope.showAlert("Sem dados no dashboard!");

                                        }, 5000);

                                    });
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {

                                    $scope.showAlert("Você parece estar OFF-LINE!");
                                });

                            });

                };
                $scope.checkUser = function (state) {
                    console.log("checkUser: " + $scope.user.login + " " + $scope.user.pass + " " + $scope.user.adminLogin);

                    var pass = "";
                    var digits = $scope.user.pass.toString().split('');
                    for (var i = 0; i < digits.length; i++) {
                        pass += "target" + digits[i];
                    }
                    $scope.showAlert("Momentinho...");
                    if ($scope.user.login === "" || $scope.user.pass === "") {
                        $scope.showAlert("Digite um login e senha para entrar ou criar um perfil!");
                    } else {
                        $.getJSON($scope.ec_query_players, {action: "login", login: $scope.user.login, pass: pass, idadmin: $scope.user.adminLogin})
                                .done(function (json) {
                                    if (json !== null && json !== "[]") {
                                        $scope.user = JSON.parse(json)[0];
                                        window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                                        if (Math.round($scope.user.idusers) > 0) {

                                            $scope.$apply(function () {
                                                $scope.statePlayer = true;
                                                if (state === "register") {
                                                    $timeout(function () {
                                                        $location.path("viewP");
                                                    }, 100);

                                                }
                                                if (state === "checkin") {
                                                    $timeout(function () {
                                                        $location.path("viewG");
                                                    }, 100);

                                                }

                                            });
                                        } else {
                                            $scope.$apply(function () {
                                                $scope.statePlayer = false;
                                                $scope.showAlert("Login e Senha do Jogador não conferem!");

                                            });
                                        }
                                    } else {
                                        $scope.$apply(function () {
                                            $scope.statePlayer = false;
                                            $scope.showAlert("Login e Senha do Jogador não conferem!");

                                        });
                                    }
                                })
                                .fail(function (jqxhr, textStatus, error) {
                                    $scope.$apply(function () {
                                        $scope.off = "off";
                                        $scope.statePlayer = false;
                                        $scope.showAlert("Você parece estar OFF-LINE!");
                                    });

                                });

                    }



                };
                $scope.createUser = function () {
                    var pass = "";

                    var digits = $scope.user.pass.toString().split('');
                    if ($scope.user.login === "" || $scope.user.pass === "") {
                        $scope.showAlert("Opa! Digite um login e senha primeiro e depois clique em Criar login!");
                        return;
                    } else {
                        $scope.showAlert("Criando jogador...");
                    }

                    for (var i = 0; i < digits.length; i++) {
                        pass += "target" + digits[i];
                    }

                    $.getJSON($scope.ec_query_players, {action: "register", login: $scope.user.login, pass: pass, idadmin: $scope.user.adminId})
                            .done(function (json) {
                                if (json !== null && json !== "[]") {
                                    var obj = JSON.parse(json);
                                    if (Math.round(obj[0].idusers) > 0) {
                                        $scope.$apply(function () {
                                            $scope.showAlert("Logando... ");
                                            $scope.checkUser("register");
                                        });

                                    } else {
                                        $scope.$apply(function () {
                                            $scope.showAlert("Login de Jogador não confere ou já existe! ");
                                        });

                                    }
                                } else {
                                    $scope.$apply(function () {
                                        $scope.showAlert("Login de Jogador não confere ou já existe! ");
                                    });

                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.off = "off";
                                    $scope.showAlert("Você parece estar OFF-LINE! ");
                                });

                            });


                };
                $scope.goPath = function (view) {
                    $location.path(view);
                };
                $scope.changePass = function (pass) {
                    $scope.user.pass += pass;
                };
                $scope.checkAdmin = function (state) {
                    console.log("checkAdmin: " + $scope.user.adminLogin);

                    $.getJSON($scope.ec_query_players, {action: "info_of_professor", login: $scope.user.adminLogin})
                            .done(function (json) {

                                if ((json !== null) && (json !== "[]")) {

                                    if (json[0].id > 0) {
                                        $scope.$apply(function () {
                                            $scope.user.adminId = json[0].id;

                                            $scope.stateAdmin = true;
                                            $scope.stateCoded = true;
                                            $scope.stateProfessor = true;

                                            $scope.showAlert("Professor " + json[0].name + " ID " + json[0].id);

                                            window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);

                                        });
                                    } else {
                                        $scope.$apply(function () {
                                            $scope.stateAdmin = false;
                                            $scope.adminChecked = "Entrar";
                                            $scope.showAlert("Login do Professor não confere!");
                                        });

                                    }
                                } else {
                                    $scope.$apply(function () {
                                        $scope.stateAdmin = false;
                                        $scope.adminChecked = "Entrar";
                                        $scope.showAlert("Login do Professor não confere!");
                                    });

                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.stateAdmin = false;
                                    $scope.adminChecked = "Entrar";
                                    $scope.showAlert("Login do Professor não confere!");
                                });

                            });


                };
                console.log("USER: " + $scope.user.login + " " + $scope.user.pass + " " + $scope.user.adminLogin);
                if ($scope.user.playerId > 0 && $scope.user.adminLogin) {
                    $scope.statePlayer = true;
                } else {
                   
                    $scope.cleanUser();
                    $scope.showAlert("Digite login e senha para entrar ou se ainda não tem cadastro digite um login e senha e clique em Criar login");
                }
                if ($scope.user.adminId > 0) {
                    $scope.stateAdmin = true;
                } else {
                    $scope.stateAdmin = false;
                }
            }])

        .controller('ViewTCtrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
                BackgroundService.setCurrentBg("view-T-background");
                $scope.ec_query_players = 'https://escoladocerebro.org/eduscada/c/index.php/ec_query_players';
                $scope.hidden = "hidden";
                $scope.off = "hidden";
                $scope.message = "Bem vindo!";
                $scope.points = [];
                $scope.statePlayer = false;
                $scope.statePoints = false;
                $scope.stateAttention = false;
                $scope.stateMemory = "";
                $scope.stateProblems = "";
                $scope.stateSendPoints = "";
                $scope.title = "Escola um Jogo de Avaliação";
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
                $scope.checkPsicotest = function (game) {
                    $scope.gameId = game;
                    SettingsService.set('game', game);
                    $scope.gameIcon = "icone-" + SettingsService.get('game');
                    $scope.title = "Game " + SettingsService.get('game');
                    $scope.gameId = SettingsService.get('game');
                    $scope.gameUrl = "games/" + SettingsService.get('game') + "/" + SettingsService.get('game') + ".html";
                    $scope.gameTitle = " <span class=\"game_display\">  " + $scope.gameId + " </span>";
                    $scope.showAlert("Toque em Jogar para iniciar.");
                    $('#modal_psicotest').modal('show');
                };

                $scope.show = function () {
                    $scope.hidden = "alert";
                };
                $scope.hide = function () {

                    $scope.hidden = "hidden";
                };
                $scope.showAlert = function (txt) {
                    $scope.hidden = "alert";
                    $scope.message = txt;

                };
                $scope.closeAlert = function (txt) {
                    $scope.hidden = "hidden";
                };
                $scope.iframeLoadedCallBack = function () {


                    $scope.fc++;

                    if ($scope.fc > 1) {
                        $scope.showAlert("Teste para ganhar experiência.");
                        $scope.off = "hidden";
                    }

                    $timeout(function () {

                    }, 300);
                };
                $scope.goPath = function (view) {
                    $location.path(view);

                };
                $scope.cleanUser = function () {
                    $scope.statePlayer = false;
                    $scope.user = {
                        playerId: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        nascimento: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        idusers: 0,
                        day: '',
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                    $scope.showAlert("Nenhum jogador definido.");
                };

                $scope.checkDash = function (player) {
                    console.log('$scope.user.idusers :' + $scope.user.idusers);
                    $.getJSON($scope.ec_query_players, {action: "dashboardbyuser", idusers: player})
                            .done(function (json) {
                                if (json !== null) {
                                    $scope.dashboard = JSON.parse(json)[0];
                                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            //    if (($scope.dashboard.ngames >= 50)) {
                                            if ($scope.dashboard.ngames > 0) {
                                                $scope.stateGamer = true;
                                                console.log("$scope.dashboard.ngames " + $scope.dashboard.ngames)
                                            } else {
                                                $scope.stateGamer = false;
                                            }

                                            if ($scope.dashboard.n_attention < 1 || (Math.round($scope.dashboard.ngames - $scope.dashboard.ngames_attention) >= 50)) {
                                                $scope.stateAttention = "";
                                                console.log("$scope.dashboard.n_attention " + $scope.dashboard.n_attention)
                                                console.log("$scope.dashboard.n_attention " + Math.round($scope.dashboard.ngames - $scope.dashboard.ngames_attention))
                                            } else {
                                                $scope.stateAttention = "hidden";
                                            }

                                            if ($scope.dashboard.n_memory < 1 || (Math.round($scope.dashboard.ngames - $scope.dashboard.n_memory) >= 50)) {
                                                $scope.stateMemory = "";
                                                console.log("$scope.dashboard.n_memory " + $scope.dashboard.n_memory)
                                                console.log("$scope.dashboard.n_attention " + Math.round($scope.dashboard.ngames - $scope.dashboard.n_memory))
                                            } else {
                                                $scope.stateMemory = "hidden";
                                            }

                                            if ($scope.dashboard.n_problems < 1 || (Math.round($scope.dashboard.ngames - $scope.dashboard.n_problems) >= 50)) {
                                                $scope.stateProblems = "";
                                                console.log("$scope.dashboard.n_problems " + $scope.dashboard.n_problems)
                                                console.log("$scope.dashboard.n_attention " + Math.round($scope.dashboard.ngames - $scope.dashboard.n_problems))
                                            } else {
                                                $scope.stateProblems = "hidden";
                                            }
                                        }, 100);
                                    });
                                } else {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            $scope.stateGamer = "";
                                            $scope.showAlert("Sem jogadas no dashboard!");
                                        }, 100);
                                    });
                                }

                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.stateGamer = "";
                                    $scope.showAlert("Você parece estar OFF-LINE!");
                                });
                            });

                };


                if (Math.round($scope.user.idusers) > 0) {
                    $scope.statePlayer = true;
                    $scope.checkDash($scope.user.idusers);

                } else {
                    $scope.statePlayer = false;
                    $scope.cleanUser();
                }

                if ($scope.dashboard.ngames > 0) {
                    $scope.stateGamer = true;
                    console.log("$scope.dashboard.ngames " + $scope.dashboard.ngames)
                } else {
                    $scope.stateGamer = false;
                }

                if ($scope.dashboard.n_attention < 1 || (Math.round($scope.dashboard.ngames - $scope.dashboard.ngames_attention) >= 50)) {
                    $scope.stateAttention = "";
                    console.log("$scope.dashboard.n_attention " + $scope.dashboard.n_attention)
                    console.log("$scope.dashboard.n_attention " + Math.round($scope.dashboard.ngames - $scope.dashboard.ngames_attention))
                } else {
                    $scope.stateAttention = "hidden";
                }

                if ($scope.dashboard.n_memory < 1 || (Math.round($scope.dashboard.ngames - $scope.dashboard.n_memory) >= 50)) {
                    $scope.stateMemory = "";
                    console.log("$scope.dashboard.n_memory " + $scope.dashboard.n_memory)
                    console.log("$scope.dashboard.n_attention " + Math.round($scope.dashboard.ngames - $scope.dashboard.n_memory))
                } else {
                    $scope.stateMemory = "hidden";
                }

                if ($scope.dashboard.n_problems < 1 || (Math.round($scope.dashboard.ngames - $scope.dashboard.n_problems) >= 50)) {
                    $scope.stateProblems = "";
                    console.log("$scope.dashboard.n_problems " + $scope.dashboard.n_problems)
                    console.log("$scope.dashboard.n_attention " + Math.round($scope.dashboard.ngames - $scope.dashboard.n_problems))
                } else {
                    $scope.stateProblems = "hidden";
                }

            }])

        .controller('ViewGTabCtrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
                BackgroundService.setCurrentBg("view-g-background");
                $scope.ec_query_players = 'https://escoladocerebro.org/eduscada/c/index.php/ec_query_players';
                $scope.hidden = "hidden";
                $scope.points = [];
                $scope.statePlayer = false;
                $scope.statePoints = false;
                $scope.stateSendPoints = false;
                $scope.stateGamer = "hidden";
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
                $scope.show = function () {
                    $scope.hidden = "alert";
                };
                $scope.hide = function () {

                    $scope.hidden = "hidden";
                };
                $scope.showAlert = function (txt) {
                    $scope.hidden = "alert";
                    $scope.message = txt;
                };
                $scope.closeAlert = function (txt) {

                    $scope.hidden = "hidden";

                };
                $scope.logout = function () {

                    $scope.cleanUser();
                    $location.path("viewL");
                };

                $scope.cleanUser = function () {
                    console.log("saindo..." + $scope.user);
                    $scope.statePlayer = false;

                    $scope.user = {
                        playerId: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        nascimento: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        idusers: 0,
                        day: '',
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                    $scope.showAlert("Nenhum jogador definido.");

                };
                $scope.goPath = function (view) {
                    $location.path(view);
                };
                $scope.checkDash = function (player) {

                    $.getJSON($scope.ec_query_players, {action: "dashboardbyuser", idusers: player})
                            .done(function (json) {
                                if (json !== null) {
                                    $scope.dashboard = JSON.parse(json)[0];
                                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            //    if (($scope.dashboard.ngames >= 50)) {
                                            if ((true)) {
                                                $scope.stateGamer = "";
                                                $scope.showAlert("Você tem " + $scope.dashboard.ngames + " jogadas no dashboard!");

                                            } else {
                                                $scope.stateGamer = "hidden";
                                                $scope.showAlert("Você precisa jogar mais " + (50 - $scope.dashboard.ngames) + " para liberar os testes.");

                                            }
                                        }, 1000);
                                    });
                                } else {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            $scope.stateGamer = "";
                                            $scope.showAlert("Sem jogadas no dashboard!");
                                        }, 100);
                                    });
                                }

                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.stateGamer = "";
                                    $scope.showAlert("Você parece estar OFF-LINE!");
                                });
                            });

                };
                console.log('$scope.user.idusers :' + $scope.user.idusers);

                if (Math.round($scope.user.idusers) > 0) {
                    $scope.statePlayer = true;
                    $scope.checkDash($scope.user.idusers);

                } else {
                    $scope.cleanUser();
                }
            }])

        .controller('View6Ctrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
                BackgroundService.setCurrentBg("view-2-background");
                $scope.hidden = "hidden";
                $scope.off = "hidden";
                $scope.points = [];
                $scope.statePlayer = false;
                $scope.statePoints = false;
                $scope.stateSendPoints = false;
                $scope.stateGamer = false;
                $scope.title = "Games ";
                $scope.fc = 0;
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}').split("|");
                $scope.show = function () {
                    $scope.hidden = "alert";
                };
                $scope.hide = function () {
                    $scope.hidden = "hidden";
                };
                $scope.showAlert = function (txt) {
                    $scope.hidden = "alert";
                    $scope.message = txt;
                };
                $scope.closeAlert = function (txt) {
                    $scope.hidden = "hidden";
                };
                if (SettingsService.get('game')) {
                    $scope.gameIcon = "icone-" + SettingsService.get('game');
                    $scope.title = "Game " + SettingsService.get('game');
                    $scope.gameId = SettingsService.get('game');
                    $scope.gameUrl = "games/" + SettingsService.get('game') + "/" + SettingsService.get('game') + ".html";
                    $scope.gameTitle = " <span class=\"game_display\">  " + $scope.gameId + " </span>";
                    $scope.showAlert("Toque em Jogar para iniciar.");

                } else {

                    $location.path("viewT");
                }


                $scope.iframeLoadedCallBack = function () {


                    $scope.fc++;

                    if ($scope.fc > 1) {
                        $scope.showAlert("Teste para ganhar experiência.");
                        $scope.off = "hidden";
                    }
                    $scope.syncData = function () {
                        localStorage.brComCognisenseEscolaDoCerebroUserProfile = JSON.stringify($scope.user);
                        $scope.showAlert("Sincronizando...");
                        if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr) {
                            var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
                            var logArrWalk = 0;
                            $.each(logArr, function (key, value) {
                                var localData = JSON.parse(value);
                                localData.playerId = $scope.user.playerId;
                                localData.adminId = $scope.user.adminId;
                                $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(localData)})
                                        .done(function (rjson) {
                                            if (rjson !== null) {
                                                var obj = JSON.parse(rjson);
                                                logArrWalk++;
                                                $scope.$apply(function () {
                                                    if (logArr.length === logArrWalk) {
                                                        localStorage.brComCognisenseEscolaDoCerebroLogObjectArr = "";
                                                        localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength = 0;
                                                        $scope.points = [];
                                                        $scope.logLength = localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength;
                                                        $scope.showAlert("Ranking atualizado, jogue novamente!");
                                                        console.log(obj)
                                                    }
                                                });

                                            }
                                        })
                                        .fail(function (jqxhr, textStatus, error) {
                                            $scope.showAlert("Você parece estar off-line!");
                                        });
                            });

                        } else {

                            $scope.showAlert("Você ainda não tem pontos nessa sessão!");
                        }
                    };
                    $timeout(function () {

                        $('#modal').modal('show');
                    }, 300);
                };
                $scope.change = function () {
                    $scope.showAlert("Teste para ganhar experiência.");
                    $scope.off = "";
                };
                $scope.goPath = function (view) {
                    $location.path(view);

                };
                $scope.cleanUser = function () {
                    $scope.statePlayer = false;
                    $scope.user = {
                        playerId: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        nascimento: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        idusers: 0,
                        day: '',
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                    $scope.showAlert("Nenhum jogador definido.");
                };

                if (localStorage.brComCognisenseEscolaDoCerebroUserProfile && localStorage.brComCognisenseEscolaDoCerebroUserProfile != 0) {
                    $scope.user = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserProfile);
                    if ($scope.user.playerId > 0) {
                        $scope.statePlayer = true;
                        $scope.showAlert("Toque para iniciar o game " + $scope.user.fullname + ".");

                    } else {
                        $scope.statePlayer = false;
                        $scope.cleanUser();
                    }

                } else {
                    $scope.cleanUser();
                    $scope.statePlayer = false;

                }
                if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr && localStorage.brComCognisenseEscolaDoCerebroLogObjectArr != 0) {
                    var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
                    $scope.logToSend = 0;
                    $.each(logArr, function (key, value) {
                        //console.log('DashboardCtrl:' + key + ' = ' + value);
                        var localData = JSON.parse(value);
                        console.log(localData);
                        if (localData !== null) {
                            //localData.playerId = $scope.user.playerId;
                            $scope.logToSend++;
                            $scope.points.push(localData);
                            $scope.statePoints = true;
                            $.each(localData, function (k, v) {
                                // console.log('DashboardCtrl|localData:' + k + ' = ' + v);
                            });
                        }
                    });

                    // $scope.showAlert("Você possuí dados  (" + $scope.logToSend + ")  para sincronizar!");
                } else {
                    $scope.logToSend = 0;
                    // $scope.showAlert("Parabéns, todos seus dados estão sincronizados!");
                }
                if (localStorage.brComCognisenseEscolaDoCerebroUserDashboard && localStorage.brComCognisenseEscolaDoCerebroUserDashboard != 0) {
                    $scope.dashboard = JSON.parse(localStorage.brComCognisenseEscolaDoCerebroUserDashboard);
                    if ($scope.dashboard.ngames > 0) {
                        $scope.stateGamer = true;
                    } else {
                        $scope.stateGamer = false;
                    }

                } else {
                    $scope.stateGamer = false;
                }
                $timeout(function () {
                    $scope.closeAlert("");
                }, 5000);


            }])

        .controller('ViewPTabCtrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
                BackgroundService.setCurrentBg("view-5-background");

                $scope.hidden = "hidden";
                $scope.off = "hidden";
                $scope.title = "Perfil do Jogador";
                $scope.professorChecked = "Sou Professor";
                $scope.stateProfessor = false;
                $scope.stateAdmin = false;
                $scope.statePlayer = false;
                $scope.stateCircle = false;
                $scope.stateCoded = false;
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
                $scope.ec_query_players = 'https://escoladocerebro.org/eduscada/c/index.php/ec_query_players';
                $scope.crypta = "https://escoladocerebro.org/crypta.php";
                $scope.circles = [];

                $scope.show = function () {
                    $scope.hidden = "alert";
                };
                $scope.hide = function () {

                    $scope.hidden = "hidden";
                };
                $scope.showAlert = function (txt) {
                    $scope.hidden = "alert";
                    $scope.message = txt;

                };
                $scope.closeAlert = function (txt) {

                    $scope.hidden = "hidden";

                };
                $scope.showProfessor = function () {

                    $timeout(function () {
                        if ($scope.stateAdmin) {
                            $scope.showAlert("Você está online como " + $scope.user.adminLogin);
                            $scope.adminChecked = "Sair";
                        } else {
                            $scope.adminChecked = "Entrar";
                            $scope.showAlert("Peça o código para seu professor, ou crie um na escoladocerebro.org!");
                        }


                    }, 500);
                };
                $scope.checkProfessor = function () {
                    $scope.stateProfessor = !$scope.stateProfessor;
                    if ($scope.stateProfessor) {
                        $scope.showAlert("Entre com login e senha que você registrou em escoladocerebro.org!");
                        $scope.professorChecked = "Sou Aluno";
                    } else {
                        $scope.showAlert("Digite o código!");
                        $scope.professorChecked = "Sou Professor";
                    }

                };
                $scope.syncData = function () {

                    $scope.showAlert("Sincronizando..." + $scope.measurements.length + " dados.");
                    var sampleWalker = 0;
                    var sampleLength = $scope.measurements.length;
                    $.each($scope.measurements, function (key, value) {
                        var lastSample = JSON.parse(value);
                        lastSample.playerId = $scope.user.playerId;
                        lastSample.adminId = $scope.user.adminId;
                        $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(lastSample)})
                                .done(function (json) {
                                    if (json !== null) {
                                        sampleWalker++;
                                        if (sampleLength === sampleWalker) {
                                            var measurements = [];
                                            localStorage.setItem('org.escoladocerebro.measurements', JSON.stringify(measurements));
                                            $scope.points = [];
                                            $scope.showAlert("Parabéns, todos os " + sampleLength + " dados enviados!");
                                            return true;
                                        }
                                        console.log("Sincronizando..." + sampleWalker + " dados.");
                                    } else {
                                        $scope.showAlert("Aconteceu algum bug ao enviar os dados!");
                                        return false;
                                    }
                                })
                                .fail(function (jqxhr, textStatus, error) {
                                    $scope.showAlert("Você parece estar off-line!");
                                    return false;
                                });
                    });

                };

                $scope.checkCode = function () {
                    $scope.circles = [];
                    $scope.showAlert("Carregando Grupos do Professor...");
                    $.getJSON($scope.ec_query_players, {action: "circles_of_professor", login: $scope.user.adminLogin})
                            .done(function (json) {
                                if (json !== null) {
                                    var obj = JSON.parse(json);

                                    $scope.$apply(function () {
                                        $scope.circles = obj;
                                        $scope.circle = $scope.circles[0];
                                        $scope.stateCoded = true;
                                        $scope.showAlert("Você pode escolher ficar sem Grupo!");
                                    });
                                } else {
                                    $scope.$apply(function () {
                                        $scope.stateCoded = false;
                                        $scope.showAlert("Você pode escolher ficar sem Grupo!");
                                    });
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.stateCoded = false;
                                    $scope.showAlert("Você pode escolher ficar sem Grupo!");
                                });

                            });

                };
                $scope.checkAdmin = function () {
                    $scope.showAlert("Um momento...");

                    if ($scope.stateAdmin) {
                        $scope.showAlert("Até mais, volte logo " + $scope.user.adminLogin + "!");
                        $scope.stateAdmin = false;
                        $scope.adminChecked = "Entrar";
                    } else {
                        $.getJSON($scope.crypta, {action: "login", login: $scope.user.adminLogin, pass: $scope.user.adminPass})
                                .done(function (json) {

                                    if (json !== null) {
                                        var obj = JSON.parse(json);
                                        if (obj[0].adminId > 0) {
                                            $scope.$apply(function () {
                                                $scope.user.adminId = obj[0].adminId;
                                                $scope.stateAdmin = true;
                                                $scope.stateCoded = true;
                                                $scope.stateProfessor = true;

                                                $scope.showAlert("Bem vindo " + $scope.user.adminLogin);
                                                $scope.adminChecked = "Sair";
                                                window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                                                $scope.checkCode();
                                            });
                                        } else {
                                            $scope.$apply(function () {
                                                $scope.stateAdmin = false;
                                                $scope.adminChecked = "Entrar";
                                                $scope.showAlert("Login e Senha do Professor não conferem!");
                                            });

                                        }
                                    } else {
                                        $scope.$apply(function () {
                                            $scope.stateAdmin = false;
                                            $scope.adminChecked = "Entrar";
                                            $scope.showAlert("Login e Senha do Professor não conferem!");
                                        });

                                    }
                                })
                                .fail(function (jqxhr, textStatus, error) {
                                    $scope.$apply(function () {
                                        $scope.stateAdmin = false;
                                        $scope.adminChecked = "Entrar";
                                        $scope.showAlert("Login e Senha do Professor não conferem!");
                                    });

                                });

                    }

                };
                $scope.checkUser = function (state) {
                    console.log("checkUser: " + $scope.user.login + " " + $scope.user.pass);

                    var pass = "";
                    var digits = $scope.user.pass.toString().split('');
                    for (var i = 0; i < digits.length; i++) {
                        pass += "target" + digits[i];
                    }
                    $scope.showAlert("Momentinho...");
                    if ($scope.user.login === "" || $scope.user.pass === "") {
                        $scope.showAlert("Digite um login e senha ou crie um novo!");
                    } else {
                        $.getJSON($scope.ec_query_players, {action: "login", login: $scope.user.login, pass: pass})
                                .done(function (json) {
                                    if (json !== null) {
                                        $scope.user = JSON.parse(json)[0];
                                        window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                                        if (Math.round($scope.user.idusers) > 0) {

                                            $scope.$apply(function () {
                                                $scope.statePlayer = true;

                                                $scope.showAlert("Bem Vindo, " + $scope.user.login);

                                                $scope.checkDash($scope.user.playerId);

                                                if (state === "checkin") {
                                                    $timeout(function () {

                                                        $location.path("viewG");
                                                    }, 500);

                                                }
                                            });
                                        } else {
                                            $scope.$apply(function () {
                                                $scope.statePlayer = false;
                                                $scope.showAlert("Login e Senha do Jogador não conferem!");

                                            });
                                        }
                                    } else {
                                        $scope.$apply(function () {
                                            $scope.statePlayer = false;
                                            $scope.showAlert("Login e Senha do Jogador não conferem!");

                                        });
                                    }
                                })
                                .fail(function (jqxhr, textStatus, error) {
                                    $scope.$apply(function () {
                                        $scope.off = "off";
                                        $scope.statePlayer = false;
                                        $scope.showAlert("Você parece estar OFF-LINE!");
                                    });

                                });

                    }



                };
                $scope.checkDash = function (player) {

                    $.getJSON($scope.ec_query_players, {action: "dashboardbyuser", idusers: player})
                            .done(function (json) {
                                if (json !== null) {

                                    $scope.dashboard = JSON.parse(json)[0];
                                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

                                    $timeout(function () {
                                        $scope.showAlert("Você tem " + $scope.dashboard.ngames + " dados no dashboard!");
                                    }, 5000);
                                } else {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            $scope.showAlert("Sem dados no dashboard!");

                                        }, 5000);

                                    });
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {

                                    $scope.showAlert("Você parece estar OFF-LINE!");
                                });

                            });

                };
                $scope.createUser = function () {
                    var pass = "";
                    var digits = $scope.user.pass.toString().split('');
                    for (var i = 0; i < digits.length; i++) {
                        pass += "target" + digits[i];
                    }
                    $scope.show();
                    $.getJSON($scope.ec_query_players, {action: "register", login: $scope.user.login, pass: pass, idadmin: $scope.user.adminId})
                            .done(function (json) {
                                if (json !== null) {
                                    var obj = JSON.parse(json);
                                    if (obj[0].idusers > 0) {
                                        $scope.checkUser("");
                                    } else {
                                        $scope.$apply(function () {
                                            $scope.showAlert("Login de Jogador já existe! Escolha outro nome ou apelido para LOGIN.");
                                        });

                                    }
                                } else {
                                    $scope.$apply(function () {
                                        $scope.showAlert("Login de Jogador já existe! Escolha outro nome ou apelido para LOGIN.");
                                    });

                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.showAlert("Você parece estar OFF-LINE! Vamos guardar os seus dados por um momento.");
                                });

                            });


                };
                $scope.saveUser = function () {
                    $scope.showAlert("Atualizando " + $scope.user.fullname + ", momentinho...");
                    if ($scope.user.playerId > 0) {

                        $.getJSON($scope.ec_query_players, {
                            action: "updateOff",
                            idusers: $scope.user.playerId,
                            escola: $scope.user.escola,
                            serie: $scope.user.serie,
                            group: $scope.user.group,
                            day: $scope.user.day,
                            city: $scope.user.city,
                            state: $scope.user.state,
                            country: $scope.user.country,
                            email: $scope.user.email,
                            sexo: $scope.user.sexo,
                            fullname: $scope.user.fullname.toUpperCase(),
                            chamada: $scope.user.chamada,
                            idadmin: $scope.user.adminId,
                            partner: $scope.user.partner
                        }).done(function (json) {
                            if (json !== null) {
                                var obj = JSON.parse(json);
                                if (obj[0].idusers > 0) {

                                    $scope.$apply(function () {
                                        $scope.checkUser("");
                                        $scope.showAlert("Pronto, " + $scope.user.fullname + "  atualizado! Parabéns!");
                                    });

                                }
                            } else {
                                $scope.$apply(function () {
                                    $scope.showAlert("Opa! Você parece estar OFF-LINE!");
                                });

                            }
                        }).fail(function (jqxhr, textStatus, error) {
                            $scope.$apply(function () {
                                $scope.showAlert("Você precisa fazer Login primeiro.");
                            });

                        });
                    } else {
                        $scope.$apply(function () {
                            $scope.showAlert("Você precisa fazer Login primeiro.");
                        });

                    }

                };
                $scope.cleanUser = function () {
                    console.log("cleanUser... " + $scope.user);

                    $scope.statePlayer = false;

                    $scope.user = {
                        playerId: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        day: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        idusers: 0,
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: '',
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                    $scope.showAlert("Nenhum jogador definido.");
                };
                $scope.logout = function ( ) {
                    $scope.cleanUser();
                    $location.path("viewH");
                };
                $scope.changePass = function (pass) {
                    $scope.user.pass += pass;
                };
                $scope.changeCircle = function (item) {
                    $scope.user.group = item.label;

                    if (item.value > 0) {

                        $scope.showAlert("Toque em adicionar para completar!");
                    } else {

                        $scope.showAlert("Você está sem Grupo!");
                    }
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                };
                $scope.addCircle = function ( ) {
                    //$scope.user.group = $scope.group ;
                    if (angular.isUndefined($scope.circle)) {
                        $scope.showAlert("Nenhum grupo foi adicionado!");
                    } else {
                        $scope.user.group = $scope.circle.label;
                        $scope.showAlert("Grupo " + $scope.circle.label + " adicionado!");

                    }
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                };

                $scope.goPath = function (view) {

                    $location.path(view);

                };
                if ($scope.user.group !== "") {
                    $scope.stateCircle = true;
                } else {
                    $scope.stateCircle = false;
                }
                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                } else {
                    $scope.statePlayer = false;
                    $scope.cleanUser();
                }
                if ($scope.user.adminId > 0) {
                    $scope.stateAdmin = true;
                    $scope.checkCode();
                } else {
                    $scope.stateAdmin = false;
                }
                if ($scope.dashboard.ngames > 0) {
                    $scope.stateGamer = true;
                } else {
                    $scope.stateGamer = false;
                }


            }])

        .controller('RankingCtrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
                BackgroundService.setCurrentBg("view-4-background");
                $scope.dashUrl = "games/ranking/barrank.html";
                $scope.hidden = "hidden";
                $scope.title = "Ranking";
                $scope.stateAdmin = false;
                $scope.statePlayer = false;
                $scope.statePoints = false;
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
                $scope.show = function () {
                    $scope.hidden = "alert";
                };
                $scope.hide = function () {

                    $scope.hidden = "hidden";
                };
                $scope.showAlert = function (txt) {
                    $scope.hidden = "alert";
                    $scope.message = txt;
                };
                $scope.closeAlert = function (txt) {
                    $scope.hidden = "hidden";
                };
                $scope.syncDash = function ( ) {
                    $scope.showAlert("Momentinho, vamos atualizar o ranking...");
                    $scope.dashUrl = "games/ranking/ranking.html";
                    $timeout(function () {
                        $scope.showAlert("Pronto, aqui você pode ver sobre o seu desempenho!");
                    }, 300);
                };
                $scope.goPath = function (view) {
                    $location.path(view);
                };

                $scope.checkDash = function (player) {

                    $.getJSON($scope.ec_query_players, {action: "dashboardbyuser", idusers: player})
                            .done(function (json) {
                                if (json !== null) {

                                    $scope.dashboard = JSON.parse(json)[0];
                                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

                                    $timeout(function () {
                                        $scope.showAlert("Você tem " + $scope.dashboard.ngames + " dados no dashboard!");
                                    }, 5000);
                                } else {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            $scope.showAlert("Sem dados no dashboard!");

                                        }, 5000);

                                    });
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {

                                    $scope.showAlert("Você parece estar OFF-LINE!");
                                });

                            });

                };
                $scope.checkDashAll = function (player) {

                    $.getJSON($scope.ec_query_players, {action: "dashboardbyall"})
                            .done(function (json) {
                                if (json !== null) {

                                    $scope.dashboardall = JSON.parse(json)[0];

                                    $scope.checkDash(player);
                                } else {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            $scope.showAlert("Sem dados no dashboard!");

                                        }, 5000);

                                    });
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {

                                    $scope.showAlert("Você parece estar OFF-LINE!");
                                });

                            });

                };
                $scope.cleanUser = function () {
                    $scope.statePlayer = false;
                    $scope.user = {
                        playerId: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        idusers: 0,
                        day: '',
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    $scope.dashboardall = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                    window.localStorage['org.escoladocerebro.dashboardall'] = JSON.stringify($scope.dashboardall);
                    $scope.showAlert("Nenhum jogador definido.");

                };
                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                } else {

                    $scope.cleanUser();
                }
                if ($scope.dashboard.ngames > 0) {
                    $scope.stateGamer = true;
                } else {
                    $scope.stateGamer = false;
                }
            }])

        .controller('DashboardCtrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
                BackgroundService.setCurrentBg("view-3-background");

                $scope.ec_query_players = 'https://escoladocerebro.org/eduscada/c/index.php/ec_query_players';
                $scope.ec_log_games = "https://escoladocerebro.org/eduscada/c/index.php/ec_log_games";
                $scope.points = [];
                $scope.statePlayer = false;
                $scope.statePoints = false;
                $scope.stateSendPoints = false;
                $scope.hidden = "hidden";
                $scope.title = "Dashboard";
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.dashboardall = JSON.parse(window.localStorage['org.escoladocerebro.dashboardall'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
                $scope.showTrofeu = function () {
                    $scope.stateTrofel = !$scope.stateTrofel;
                };
                $scope.showMeasures = function () {
                    if ($scope.measurements.length > 0) {
                        $scope.statePoints = true;
                        $scope.points = [];
                        $.each($scope.measurements, function (key, value) {
                            console.log('DashboardCtrl:' + key + ' = ' + value);
                            var localData = JSON.parse(value);
                            console.log(localData);
                            //localData.playerId = $scope.user.playerId; 
                            $scope.points.push(localData);
                            $scope.statePoints = true;
                            $.each(localData, function (k, v) {
                                console.log('DashboardCtrl|localData:' + k + ' = ' + v);
                            });
                        });
                        $scope.stateMessage = "Você precisa sincronizar " + $scope.measurements.length + " dados.";
                    } else {
                        $scope.stateMessage = "Você parece estar jogando off-line e não possuí nenhuma jogada para sincronizar. Você pode jogar e fazer a sincronização de sua pontuação quanto estive online."
                    }
                };
                $scope.show = function () {
                    $scope.hidden = "alert";
                };
                $scope.hide = function () {
                    $scope.hidden = "hidden";
                };
                $scope.showAlert = function (txt) {
                    $scope.hidden = "alert";
                    $scope.message = txt;
                };
                $scope.closeAlert = function (txt) {
                    $scope.hidden = "hidden";
                };
                $scope.goPath = function (view) {
                    $location.path(view);

                };
                $scope.checkDash = function (player) {

                    $.getJSON($scope.ec_query_players, {action: "dashboardbyuser", idusers: player})
                            .done(function (json) {
                                if (json !== null) {

                                    $scope.dashboard = JSON.parse(json)[0];
                                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);

                                    $timeout(function () {
                                        $scope.showAlert("Você tem " + $scope.dashboard.ngames + " dados no dashboard!");

                                        if ($scope.dashboard.ngames > 0) {
                                            $scope.stateGamer = true;
                                        } else {
                                            $scope.stateGamer = false;
                                        }
                                    }, 1000);
                                } else {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            $scope.showAlert("Sem dados no dashboard!");

                                        }, 1000);

                                    });
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.showAlert("Você parece estar OFF-LINE! Mas não se preocupe, você pode jogar e depois sincronizar seus pontos.");
                                    $scope.statePoints = true;
                                    $scope.showMeasures();
                                });

                            });

                };
                $scope.checkDashAll = function (player) {
                    console.log(player);
                    $.getJSON($scope.ec_query_players, {action: "dashboardbyall"})
                            .done(function (json) {
                                if (json !== null) {
                                    $scope.dashboardall = JSON.parse(json)[0];
                                } else {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            $scope.showAlert("Sem dados no dashboard!");
                                        }, 1000);
                                    });
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                $scope.$apply(function () {
                                    $scope.showAlert("Você parece estar OFF-LINE! Mas não se preocupe, você pode jogar e depois sincronizar seus pontos.");
                                    $scope.statePoints = true;
                                    $scope.showMeasures();
                                });

                            });

                };
                $scope.syncData = function () {

                    var sampleWalker = 0;
                    var sampleLength = $scope.measurements.length;

                    if (sampleLength > 0) {
                        $scope.showAlert("Sincronizando " + sampleLength + " jogadas...");
                    } else {
                        $scope.showAlert("Você não tem dados para sincronizar.");
                    }
                    $.each($scope.measurements, function (key, value) {
                        var lastSample = JSON.parse(value);
                        lastSample.playerId = $scope.user.playerId;
                        lastSample.adminId = $scope.user.adminId;
                        console.log("Sincronizando..." + sampleWalker + " dados.");
                        $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(lastSample)})
                                .done(function (json) {
                                    if (json !== null) {
                                        sampleWalker++;
                                        if (sampleLength === sampleWalker) {
                                            var measurements = [];
                                            localStorage.setItem('org.escoladocerebro.measurements', JSON.stringify(measurements));
                                            $scope.$apply(function () {
                                                $timeout(function () {
                                                    $scope.points = [];
                                                    $scope.statePoints = false;
                                                    $scope.showAlert("Parabéns, todos os " + sampleLength + " dados enviados!");
                                                    $location.path('view3');
                                                }, 1000);
                                            });
                                            return true;
                                        }

                                    } else {
                                        $scope.$apply(function () {
                                            $timeout(function () {
                                                $scope.showAlert("Aconteceu algum bug ao enviar os dados!");
                                            }, 1000);
                                        });

                                        return false;
                                    }
                                })
                                .fail(function (jqxhr, textStatus, error) {
                                    $scope.$apply(function () {
                                        $timeout(function () {
                                            $scope.showAlert("Você parece estar OFF-LINE! Mas não se preocupe, você pode jogar e depois sincronizar seus pontos.");
                                            $scope.statePoints = true;
                                            $scope.showMeasures();
                                        }, 1000);
                                    });

                                    return false;
                                });
                    });

                };
                $scope.cleanUser = function () {
                    $scope.statePlayer = false;
                    $scope.user = {
                        playerId: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        idusers: 0,
                        day: '',
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    $scope.dashboardall = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                    window.localStorage['org.escoladocerebro.dashboardall'] = JSON.stringify($scope.dashboardall);
                    $scope.showAlert("Nenhum jogador definido.");
                };

                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                    $scope.checkDashAll($scope.user.playerId);
                    $scope.checkDash($scope.user.playerId);
                } else {
                    $scope.statePlayer = false;
                    $scope.cleanUser();
                }
                $scope.showMeasures();

            }])

        .controller('View2Ctrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
                BackgroundService.setCurrentBg("view-2-background");
                $scope.hidden = "hidden";
                $scope.off = "hidden";
                $scope.points = [];
                $scope.statePlayer = false;
                $scope.statePoints = false;
                $scope.stateSendPoints = false;
                $scope.title = "Games ";
                $scope.fc = 0;
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');
                $scope.gameUrl = "games/index.html";
                $scope.show = function () {
                    $scope.hidden = "alert";
                };
                $scope.hide = function () {

                    $scope.hidden = "hidden";
                };
                $scope.showAlert = function (txt) {
                    $scope.hidden = "alert";
                    $scope.message = txt;
                };
                $scope.closeAlert = function (txt) {
                    $scope.hidden = "hidden";
                };
                if (SettingsService.get('game')) {
                    $scope.gameIcon = "icone-" + SettingsService.get('game');
                    $scope.title = "Game " + SettingsService.get('game');
                    $scope.gameId = SettingsService.get('game');
                    $scope.gameUrl = "games/" + SettingsService.get('game') + "/" + SettingsService.get('game') + ".html";
                    $scope.gameTitle = " <span class=\"game_display\">  " + $scope.gameId + " </span>";
                    $scope.showAlert("Toque em Jogar para iniciar.");

                } else {

                    $location.path("view1");
                }


                $scope.iframeLoadedCallBack = function () {
                    console.log("iframeLoadedCallBack:" + $scope.fc)
                    if ($scope.fc < 1) {
                        document.getElementById($scope.gameId).src += '';
                    }
                    $scope.fc++;

                    if ($scope.fc > 1) {
                        $scope.showAlert("Jogue para ganhar experiência.");
                        $scope.off = "hidden";
                    }
                    $scope.syncData = function () {

                        $scope.showAlert("Sincronizando...");
                        if (localStorage.brComCognisenseEscolaDoCerebroLogObjectArr) {
                            var logArr = localStorage.brComCognisenseEscolaDoCerebroLogObjectArr.split("|");
                            var logArrWalk = 0;
                            $.each(logArr, function (key, value) {
                                var localData = JSON.parse(value);
                                localData.playerId = $scope.user.playerId;
                                localData.adminId = $scope.user.adminId;
                                $.getJSON("https://escoladocerebro.org/eduscada/c/index.php/ec_log_games", {log: JSON.stringify(localData)})
                                        .done(function (rjson) {
                                            if (rjson !== null) {
                                                var obj = JSON.parse(rjson);
                                                logArrWalk++;
                                                $scope.$apply(function () {
                                                    if (logArr.length === logArrWalk) {
                                                        localStorage.brComCognisenseEscolaDoCerebroLogObjectArr = "";
                                                        localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength = 0;
                                                        $scope.points = [];
                                                        $scope.logLength = localStorage.brComCognisenseEscolaDoCerebroLogObjectArrLength;
                                                        $scope.showAlert("Ranking atualizado, jogue novamente!");
                                                        console.log(obj)
                                                    }
                                                });

                                            }
                                        })
                                        .fail(function (jqxhr, textStatus, error) {
                                            $scope.showAlert("Você parece estar off-line!");
                                        });
                            });

                        } else {

                            $scope.showAlert("Você ainda não tem pontos nessa sessão!");
                        }
                    };
                };
                $scope.change = function () {
                    $scope.showAlert("Jogue para ganhar experiência.");
                    $scope.off = "";
                };
                $scope.goPath = function (view) {
                    $location.path(view);

                };
                $scope.cleanUser = function () {
                    $scope.statePlayer = false;
                    $scope.user = {
                        playerId: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        nascimento: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        idusers: 0,
                        day: '',
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };
                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                    $scope.showAlert("Nenhum jogador definido.");
                };


            }])

        .controller('View1Ctrl', ['$scope', '$http', 'SettingsService', '$timeout', '$location', 'BackgroundService', function ($scope, $http, SettingsService, $timeout, $location, BackgroundService) {
                BackgroundService.setCurrentBg("view-1-background");
                $scope.hidden = "hidden";
                $scope.off = "hidden";
                $scope.message = "Bem vindo!";
                $scope.points = [];
                $scope.statePlayer = false;
                $scope.statePoints = false;
                $scope.stateSendPoints = false;
                $scope.title = "Escolha um Game";
                $scope.user = JSON.parse(window.localStorage['org.escoladocerebro.user'] || '{}');
                $scope.dashboard = JSON.parse(window.localStorage['org.escoladocerebro.dashboard'] || '{}');
                $scope.measurements = JSON.parse(window.localStorage['org.escoladocerebro.measurements'] || '{}');

                $scope.checkGame = function (game) {
                    $scope.gameId = game;
                    SettingsService.set('game', game);
                    $timeout(function () {
                        $location.path('view2');
                    }, 100);

                };

                $scope.show = function () {
                    $scope.hidden = "alert";
                };
                $scope.hide = function () {

                    $scope.hidden = "hidden";
                };
                $scope.showAlert = function (txt) {
                    $scope.hidden = "alert";
                    $scope.message = txt;

                    console.log(txt)
                };
                $scope.closeAlert = function (txt) {

                    $scope.hidden = "hidden";

                };

                $scope.goPath = function (view) {
                    $location.path(view);

                };
                $scope.cleanUser = function () {
                    $scope.statePlayer = false;
                    $scope.user = {
                        playerId: 0,
                        adminId: 138,
                        adminPass: '',
                        adminLogin: 'admin',
                        fullname: '',
                        login: '',
                        pass: '',
                        nascimento: '',
                        group: '',
                        serie: '',
                        chamada: '',
                        escola: '',
                        idusers: 0,
                        day: '',
                        city: '',
                        state: '',
                        country: '',
                        email: '',
                        sexo: '',
                        partner: ''
                    };
                    $scope.dashboard = {
                        ngames: 0,
                        acuracia: '',
                        velocidade: '',
                        estabilidade: '',
                        total_time: '',
                        pontuacao_avg: '',
                        pontuacao_sum: '',
                        idadmin: '',
                        barssum: '0,0,0',
                        barsavg: '0,0,0'
                    };

                    window.localStorage['org.escoladocerebro.user'] = JSON.stringify($scope.user);
                    window.localStorage['org.escoladocerebro.dashboard'] = JSON.stringify($scope.dashboard);
                    $scope.showAlert("Nenhum jogador definido.");
                };

                if ($scope.user.playerId > 0) {
                    $scope.statePlayer = true;
                    $scope.showAlert("Escolha um jogo " + $scope.user.fullname + ".");

                } else {
                    $scope.statePlayer = false;
                    $scope.cleanUser();
                }

//            $.each($scope.measurements, function (key, value) {
//                //console.log('DashboardCtrl:' + key + ' = ' + value); 
//                var localData = JSON.parse(value);
//                console.log(localData);
//                if (localData !== null) {
//                    //localData.playerId = $scope.user.playerId;
//                    $scope.logToSend++;
//                    $scope.points.push(localData);
//                    $scope.statePoints = true;
//                    $.each(localData, function (k, v) {
//                        // console.log('DashboardCtrl|localData:' + k + ' = ' + v);
//                    });
//                }
//            });

                //$scope.showAlert("Você possuí dados  (" + $scope.logToSend + ")  para sincronizar!");
                if ($scope.dashboard.ngames > 0) {
                    $scope.stateGamer = true;
                } else {
                    $scope.stateGamer = false;
                }
                $timeout(function () {

                }, 300);
            }])
        ;