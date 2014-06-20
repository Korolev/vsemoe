<!DOCTYPE HTML>
<html lang="ru-RU">
<head>
    <link href="/css/fonts.css" rel="stylesheet" type="text/css">
    <link href="/css/login.css" rel="stylesheet" type="text/css" media="screen">
    <link href="/css/style.css" rel="stylesheet" type="text/css" media="screen">
    <link href="/css/newmain.css" rel="stylesheet" type="text/css" media="screen">
    <script src="/js/jquery-1.9.1.min.js"></script>
    <script src="/js/lib/moment.min.js?v9"></script>
    <script src="/js/config/ApplicationSettings.js"></script>
    <script src="/js/utils/util.js?v9"></script>
    <script src="/js/lib/knockout-latest.js?v9"></script>
    <script src="/js/ko.additional.js?v9"></script>
    <script src="/js/utils/ServerApi.js?v9"></script>
    <script src="/js/ViewModel/UserViewModel.js?v9"></script>
    <script src="/js/header.js"></script>
    <script type="text/javascript">
        $(document).ready(function(){

            $("#submit_buttom").on('click',function(){
                ServerApi.createResponse({data:JSON.stringify({
                    name: $('#form_name').val(),
                    email: $('#form_email').val(),
                    message: $('#form_message').val()
                })},function(r){
                    if(r){
                        $('#form_name').val(''),
                        $('#form_email').val(''),
                        $('#form_message').val('')

                        var p = $('<p></p>').text('Спасибо за Ваше менние!');

                        $('#submit_buttom').after(p).remove();
                    }
                })
            });

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
        <div class="wrap">
            <div class="logo-slogan">
                <a href="index.html" title="Всё Мое">&nbsp;</a>
            </div>
             <!-- ko if: login -->
            <div class="menu-login-authorized">
                <span class="user-email" data-bind="text: login"></span>
                <nav class="user-pages-nav">
                    <ul class="fr">
                        <li class="active"><a href="/feedback">Поддержка</a></li>
                        <li><a href="/payment">Тарифы</a></li>
                        <li><a href="/account">Приложение</a></li>
                        <li><a href="#" class="logout-link" data-bind="click:logout">Выйти</a></li>
                    </ul>
                </nav>
            </div>
            <!-- /ko -->
            <!-- ko ifnot: login -->
            <div class="menu-login-register">
                <nav class="navigation">
                    <ul class="fr">
                        <li><a href="tour.html">Экскурсия</a></li>
                        <li class="chertochka"></li>
                        <li><a href="http://media.vsemoe.ru">Новости</a></li>
                        <li class="chertochka"></li>
                        <li><a href="/payment">Тарифы</a></li>
                        <li class="chertochka"></li>
                        <li>
                            <span>Контакты</span>
                            <ul>
                                <li><a href="/contacts.html">Контакты</a></li>
                                <li><a href="/feedback">Поддержка</a></li>
                            </ul>

                        </li>
                        <li class="chertochka"></li>
                    </ul>
                </nav>
                <div class="social-links">
                    <ul class="minisocials">
                        <li><a href="http://facebook.com/vsemoe.ru" target="_blank" class="fb"></a></li>
                        <li><a href="https://twitter.com/vsemoe_ru" target="_blank" class="twitter"></a></li>
                        <li><a href="http://vk.com/vsemoe_ru" target="_blank" class="vk"></a></li>
                    </ul>
                </div>
                <div class="signin-login-button">
                    <a href="/account" class="loginbtn-minisocials">Войти</a> /
                    <a href="/account/#register" class="loginbtn-minisocials">Начать</a>
                </div>
            </div>
            <!-- /ko -->
        </div>
    </header>
    <div class="wrap">
        <div class="container bottom feedback-page">
            <h2>Поддержка</h2>
            <p>Дорогие друзья! Здесь, Вы можете оставить свои идейные мысли и предложения. Нам очень<br> важны ваши мнения, комментарии, пожелания, и заметки об ошибках.</p>
            <p>Если форма обратной связи вдруг не работает — позвоните нам: <b>+7 499 704-61-14</b></p>
            <div class="feedback_form">
            <form>
                <div class="form_row">
                    <input style="width:300px" type="text" placeholder="Имя" name="user" class="login" id='form_name'>
                </div>
                <div class="form_row">
                    <input style="width:300px" type="email" placeholder="Ваша электронная почта" name="email" class="login" id='form_email'>
                </div>
                <div class="form_row">
                    <textarea name="message" placeholder="Текст сообщения" id='form_message'></textarea>
                </div>
                <div class="form_row" style="padding-top:40px">
                    <input type="button" id='submit_buttom' value="Отправить">
                </div>
            </form>
            </div>
            <?php ?>
        </div>
    </div>
    <footer class="footer">
        <div class="in">
            <div class="bottomlogo"><a href="http://studiovsemoe.com"></a></div>
            <ul class="navi">
                <li><a href="/tour.html">Экскурсия</a></li>
                <li><a href="http://media.vsemoe.ru">Новости</a></li>
                <li><a href="/payment">Тарифы</a></li>
                <li><a href="/contacts.html">Контакты</a></li>
                <li><a href="/rules.html">Правила</a></li>
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
