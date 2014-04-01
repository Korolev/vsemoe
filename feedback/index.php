<!DOCTYPE HTML>
<html lang="ru-RU">
<head>
    <link href="/css/fonts.css" rel="stylesheet" type="text/css">
    <link href="/css/login.css" rel="stylesheet" type="text/css" media="screen">
    <link href="/css/style.css" rel="stylesheet" type="text/css" media="screen">
    <script src="/js/jquery-1.9.1.min.js"></script>
    <script type="text/javascript">
        $(document).ready(function(){
            console.log('ready');
            //additional-info-colapser
            var colapser = $('.additional-info-colapser .switcher'),
                colapsCont = $('.additional-info');
                
                colapser.on('click',function(){
                    colapsCont.toggleClass('hidden');
                    colapser.toggleClass('open');
                });
        });
    </script>
    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-38982546-1']);
        _gaq.push(['_setDomainName', 'vsemoe.ru']);
        _gaq.push(['_trackPageview']);
        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1100">
    <title>Поддержка - VseMoe.RU</title>
    <meta name="title" content="Поддержка - VseMoe.RU">
    <meta name="description"
          content="Создай прогресс своих денежных средств!">
    <meta name="keywords" content="">
    <link rel="shortcut icon" href="favicon.ico">
</head>
<body class="inner">
<div class="top"></div>
<div class="wrap">
 <!-- Yandex.Metrika counter -->
<script type="text/javascript">
(function (d, w, c) {
    (w[c] = w[c] || []).push(function() {
        try {
            w.yaCounter22607524 = new Ya.Metrika({id:22607524,
                    webvisor:true,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true});
        } catch(e) { }
    });

    var n = d.getElementsByTagName("script")[0],
        s = d.createElement("script"),
        f = function () { n.parentNode.insertBefore(s, n); };
    s.type = "text/javascript";
    s.async = true;
    s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

    if (w.opera == "[object Opera]") {
        d.addEventListener("DOMContentLoaded", f, false);
    } else { f(); }
})(document, window, "yandex_metrika_callbacks");
</script>
<noscript><div><img src="//mc.yandex.ru/watch/22607524" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
    <header>
        <div class="logo fl">
            <a href="/" title="Всё Мое"></a>
        </div>
        <a class="loginbtn" href="/account"></a>
        <nav>
            <ul class="fr">
                <li><a href="/tour.html">Экскурсия</a></li>
                <li class="chertochka"></li>
                <li><a href="http://media.vsemoe.ru">Новости</a></li>
                <li class="chertochka"></li>
                <li><a href="/payment">Тарифы</a></li>
                <li class="chertochka"></li>
                <li>
                                    <ul>
                                        <li><a href="/contacts.html">Контакты</a></li>
                                        <li><a href="/feedback">Поддержка</a></li>
                                    </ul>

                                </li>
            </ul>
        </nav>
    </header>
    <div class="container bottom feedback-page">
        <h2>Поддержка</h2>
        <p>Дорогие друзья! Здесь, Вы можете оставить свои идейные мысли и предложения. Нам очень<br> важны ваши мнения, комментарии, пожелания, и заметки об ошибках.</p>
        <p>Если форма обратной связи вдруг не работает — позвоните нам: <b>+7 499 704-61-14</b></p>
        <div class="feedback_form">
        <form>
            <div class="form_row"> 
                <input style="width:300px" type="text" placeholder="Имя" name="user" class="login">
            </div>
            <div class="form_row"> 
                <input style="width:300px" type="email" placeholder="Ваша электронная почта" name="email" class="login">
            </div>
            <div class="form_row"> 
                <textarea name="message" placeholder="Текст сообщения"></textarea>
            </div>
            <div class="form_row" style="padding-top:40px"> 
                <input type="submit" value="Отправить">
            </div>
        </form>
        </div>
        <?php ?>
    </div>
    <div class="empty"></div>
    <footer>
        <div class="in">
            <div class="bottomlogo"><a href="http://vsemoe.ru"></a></div>
            <ul class="navi">
                <li><a href="tour.html">Экскурсия</a></li>
                <li><a href="http://media.vsemoe.ru">Новости</a></li>
                <li><a href="contacts.html">Контакты</a></li>
                <li><a href="rules.html">Правила</a></li>
            </ul>
            <ul class="socials">
                <li><a href="http://facebook.com/vsemoe.ru" target="_blank" class="fb"></a></li>
                <li><a href="https://twitter.com/vsemoe_ru" target="_blank" class="twitter"></a></li>
                <li><a href="http://vk.com/vsemoe_ru" target="_blank" class="vk"></a></li>
            </ul>
            <span class="copy">@ 2013-2014 &laquo;Всё Моё&raquo; Все права защищены</span>
        </div>
    </footer>
</body>
</html>