<!doctype html>
<html lang="tr">
<head>

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    <meta charset="UTF-8">
    <title>Document</title>

    <link rel="shortcut icon" href="http://localhost:154/favicon.ico" type="image/png"/>
    
    <!--styles-->
    <link rel="stylesheet" href="assets/styles/main.css">

    <!--scripts-->
    <script src="assets/scripts/jquery-1.12.2.min.js"></script>
    <script src="assets/scripts/jquery.md5.js"></script>
    <script src="assets/scripts/admin.js"></script>
    <script src="assets/scripts/angular.min.js"></script>
    <script src="assets/scripts/app.js"></script>
    <script src="assets/scripts/sheriff.min.js"></script>
    <script src="assets/scripts/controllers.js"></script>
    <script src="assets/scripts/string.js"></script>
    <script src="https://cdn.ckeditor.com/4.5.7/basic/ckeditor.js"></script>
    <script src="assets/scripts/chart.min.js"></script>

</head>
<body ng-app="Sheriff" ng-controller="main">

<!--navbar-->
<div class="navbar" ng-include="'views/navbar.html'" ng-controller="navbar" ng-show="loginstate"></div>
<!--sidebar-->
<div class="sidebar" ng-include="'views/sidebar.html'" ng-controller="sidebar" onload="loaded()" ng-show="loginstate"></div>
<!--content-->
<div class="content" ng-controller="Content" ng-show="loginstate">
    <div  ng-include="'views/'+template_url+'.html'" onload="loaded()">
    </div>
</div>
    
<!--login screen-->
<div class="login-screen" ng-show="!loginstate" ng-controller="login">
    <div  ng-include="'views/login.html'" onload="loaded()"></div>
</div>



</body>
</html>