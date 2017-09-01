<%@ taglib prefix="c" uri="http://www.springframework.org/tags" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page session="false"%>

<html>
<head>
    <title>Udoo</title>
</head>
<style>
    body{
        background-color: #378281;
        color: #FFFFFF;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
    }
    img{
        width: 20%;
        margin: 50px 0;
    }
    h1{
        font-weight: 500;
    }
</style>
<body>
    <img src="<c:url value="/images/logo.png" />"/>
    <h1>${response.first}</h1>
</body>
</html>
