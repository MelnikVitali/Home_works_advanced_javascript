'use strict';

/*
 * Класс, объекты которого описывают параметры гамбургера.
 * @constructor
 * @param size        Размер
 * @param stuffing    Начинка
 * @throws {HamburgerException}  При неправильном использовании
*/
class Hamburger{
    constructor(size, stuffing) {
        try {
            if (!arguments.length)
                throw new HamburgerException("No size given");

            if (arguments.length === 1)
                throw new HamburgerException("No stuffing given");

            if (size.type !== "size")
                throw new HamburgerException(`Invalid size '${size.name}'`);

            if (stuffing.type !== "stuffing")
                throw new HamburgerException(`Invalid stuffing '${stuffing.name}'`);

            this._size = size;
            this._stuffing = stuffing;
            this._toppings = [];
        } catch (e) {
            console.log(`${e.name}: ${e.message}`)
        }
    }

    /*
     * Добавить добавку к гамбургеру. Можно добавить несколько добавок, при условии, что они разные.
     * @param topping     Тип добавки
     * @throws {HamburgerException}  При неправильном использовании
    */
    setTopping(topping) {
        try {
            if (topping.type !== 'topping') {
                throw new HamburgerException(`Invalid topping '${topping.name}'`);
            }
            if (!this._toppings.includes(topping)) {
                this._toppings.push(topping);
            } else {
                throw new HamburgerException(`Duplicate topping '${topping.name}'`)
            }
        } catch (e) {
            console.log(`${e.name}: ${e.message}`);
        }
    };

    /*
     * Убрать добавку, при условии, что она ранее была добавлена.
     * @param topping   Тип добавки
     * @throws {HamburgerException}  При неправильном использовании
    */
    removeTopping(topping) {
        try {
            if (topping.type !== "topping")
                throw new HamburgerException(`Invalid topping '${topping.name}'`);

            if (this._toppings.includes(topping)) {
                this._toppings.splice(this._toppings.indexOf(topping), 1);
            } else {
                throw new HamburgerException(`Hamburger doesn't have '${topping.name}'`);
            }
        } catch (e) {
            console.log(`${e.name}: ${e.message}`)
        }
    };

    /*
     * Получить список добавок.
     * @return {Array} Массив добавленных добавок, содержит константы
     *                 Hamburger.TOPPING_*
    */
    getToppings() {
        return this._toppings;
    };

    /**
     * Узнать размер гамбургера
     */
    getSize() {
        return this._size;
    };

    /**
     * Узнать начинку гамбургера
     */
    getStuffing() {
        return this._stuffing;
    };

    /*
     * Узнать цену гамбургера
     * @return {Number} Цена в тугриках
    */
    calculatePrice() {
        let price = this._size.price + this._stuffing.price;
        for (let key of this._toppings) {
            price += key.price;
        }
        return price;
    };

    /*
     * Узнать калорийность
     * @return {Number} Калорийность в калориях
    */
    calculateCalories() {
        let calories = this._size.call + this._stuffing.call;
        for (let key of this._toppings) {
            calories += key.call;
        }
        return calories;
    };
}

/* Размеры, виды начинок и добавок */
Hamburger.SIZE_SMALL = {
    type: "size",
    name: "SIZE_SMALL",
    price: 50,
    call: 20
};
Hamburger.SIZE_LARGE = {
    type: "size",
    name: "SIZE_LARGE",
    price: 100,
    call: 40
};
Hamburger.STUFFING_CHEESE = {
    type: "stuffing",
    name: "STUFFING_CHEESE",
    price: 10,
    call: 20
};
Hamburger.STUFFING_SALAD = {
    type: "stuffing",
    name: "STUFFING_SALAD",
    price: 20,
    call: 5
};
Hamburger.STUFFING_POTATO = {
    type: "stuffing",
    name: "STUFFING_POTATO",
    price: 15,
    call: 10
};
Hamburger.TOPPING_MAYO = {
    type: "topping",
    name: "TOPPING_MAYO",
    price: 20,
    call: 5
};
Hamburger.TOPPING_SPICE = {
    type: "topping",
    name: "TOPPING_SPICE",
    price: 15,
    call: 0
};

/*
 * Представляет информацию об ошибке в ходе работы с гамбургером.
 * Подробности хранятся в свойстве message.
 * @constructor
*/

class HamburgerException extends Error{
    constructor(message) {
        super();
        this.message = message;
        this.name = "HamburgerException";
    }
}

// маленький гамбургер с начинкой из сыра
const hamburger = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_CHEESE);
console.log(hamburger);
// добавка из майонеза
hamburger.setTopping(Hamburger.TOPPING_MAYO);
// спросим сколько там калорий
console.log("Calories: %f", hamburger.calculateCalories());
// сколько стоит
console.log("Price: %f", hamburger.calculatePrice());
// я тут передумал и решил добавить еще приправу
hamburger.setTopping(Hamburger.TOPPING_SPICE);
// А сколько теперь стоит?
console.log("Price with sauce: %f", hamburger.calculatePrice());
// Проверить, большой ли гамбургер?
console.log("Is hamburger large: %s", hamburger.getSize() === Hamburger.SIZE_LARGE); // -> false
// Убрать добавку
hamburger.removeTopping(Hamburger.TOPPING_SPICE);
console.log("Have %d toppings", hamburger.getToppings().length); // 1

// не передали обязательные параметры
const h2 = new Hamburger(); // => HamburgerException: no size given

// передаем некорректные значения, добавку вместо размера
const h3 = new Hamburger(Hamburger.TOPPING_SPICE, Hamburger.TOPPING_SPICE);
// => HamburgerException: invalid size 'TOPPING_SAUCE'

// добавляем много добавок
const h4 = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_CHEESE);
hamburger.setTopping(Hamburger.TOPPING_MAYO);
hamburger.setTopping(Hamburger.TOPPING_MAYO);
// HamburgerException: duplicate topping 'TOPPING_MAYO'






