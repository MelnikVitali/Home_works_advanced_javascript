/*
## Задание

- Допишите функционал в существующий файл `pricing-table.html` из домашнего задания 5 по HTML/CSS модуля Programming
Essentials (пример реализованной работы во [вложении](./pricing-table.html)).
- По нажатию на кнопку `Contact us`, в cookies браузера должны сохраняться следующие данные:
  - название cookie - `experiment`, значение - `novalue`, истекает через 5 минут.
  - название cookie - `new-user`, значение - `true` или `false` в зависимости от того, существует ли уже такая запись.
При первом нажатии значение должно быть `true`, при втором и последующих нажатиях - `false`.

  - [Работа с куки](http://learn.javascript.ru/cookie)
*/

/*
Аргументы:
name - название cookie
value - значение cookie (строка)
props - Объект с дополнительными свойствами для установки cookie:
expires - Время истечения cookie. Интерпретируется по-разному, в зависимости от типа:
Если число - количество секунд до истечения.
Если объект типа Date - точная дата истечения.
Если expires в прошлом, то cookie будет удалено.
Если expires отсутствует или равно 0, то cookie будет установлено как сессионное и исчезнет при закрытии браузера.
path - Путь для cookie.
domain - Домен для cookie.
secure - Пересылать cookie только по защищенному соединению.
*/

class Cookie {
    constructor() {
    }

    getCookie(name) {
        const matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));

        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    setCookie(name, value, props) {
        props = props || {};

        let exp = props.expires;

        if (typeof exp == "number" && exp) {
            let d = new Date();

            d.setTime(d.getTime() + exp * 1000);

            exp = props.expires = d;
        }

        if (exp && exp.toUTCString) {
            props.expires = exp.toUTCString()
        }

        value = encodeURIComponent(value);

        let updatedCookie = name + "=" + value;

        for (let propName in props) {
            if (!props.hasOwnProperty(propName)) {
                return false;
            }

            updatedCookie += "; " + propName;

            const propValue = props[propName];

            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }
}

const contactBTN = document.querySelector(".btn-black");

contactBTN.addEventListener('click', setCookieContactUs);

const cookieInstance = new Cookie();

function setCookieContactUs() {
    cookieInstance.setCookie('experiment', 'novalue', {expires: 300});

    const newUserCookie = cookieInstance.getCookie("new-user");

    if (newUserCookie === undefined) {
        cookieInstance.setCookie('new-user', true);
    } else {
        cookieInstance.setCookie('new-user', false);
    }
}
