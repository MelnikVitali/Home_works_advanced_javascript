/*
## Задание

- Создать простую HTML страницу с кнопкой `Вычислить по IP`.
- По нажатию на кнопку - отправить AJAX запрос по адресу `https://api.ipify.org/?format=json`, получить оттуда IP
адрес клиента.
- Узнав IP адрес, отправить запрос на сервис `https://ip-api.com/` и получить информацию о физическом адресе.
- Под кнопкой вывести на страницу информацию, полученную из последнего запроса - континент, страна, регион, город,
район города.
- Все AJAX запросы должны быть отправлены с помощью использования синтаксиса `async / await`.
- Информация должна быть показана на русском языке. Для этого при отправке запроса необходимо указать
параметр запроса `lang=ru`
- С помощью параметра запроса `fields` необходимо указать, что в ответе от сервера нужны только те поля, которые
указаны в техническом задании выше. Никакие другие поля не должны возвращаться, чтобы уменьшить физический размер
ответа от сервера.
- [Документация сервиса ip-api.com](http://ip-api.com/docs/api:json)
*/

class TrackByIP {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.container = document.getElementById('content');

        document.getElementById('btn').addEventListener('click', this.showData.bind(this));
    }

    reg(link) {
        const authOptions = {
            method: "GET",
            url: link
        };

        return axios(authOptions)
            .then((response) => response.data)
            .catch((error) => console.log(error));
    };

    showData() {
        // show loader
        this.preloader.classList.remove('close');

        this.reg(`https://api.ipify.org/?format=json`)
            .then(data => this.reg(`http://ip-api.com/json/${data.ip}?fields=1572889&lang=ru`))
            .then(data => {
                // hide loader
                this.preloader.classList.add('close');

                const district = (data.district === '') ? 'Район не определен' : data.district;

                this.container.innerHTML = `<strong>Континент</strong>:  ${data.continent}</p>
                                            <p><strong>Страна</strong>:  ${data.country}</p>
                                            <p><strong>Регион</strong>:  ${data.regionName}</p>
                                            <p><strong>Город</strong>:  ${data.city}</p>
                                            <p><strong>Район</strong>:  ${district}</p>`;
            })
            .catch((error) => {
                // hide loader
                this.preloader.classList.add('close');

                console.log('Show data IP error', error);
            });
    }
}

new TrackByIP();







