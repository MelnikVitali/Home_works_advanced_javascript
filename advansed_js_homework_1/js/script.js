'use strict';
/*
 * Класс, объекты которого описывают параметры гамбургера.
 * @constructor
 * @param size        Размер
 * @param stuffing    Начинка
 * @throws {HamburgerException}  При неправильном использовании
*/
function Hamburger(size, stuffing){
    try{
        if (!arguments.length)
            throw new HamburgerException("No size given");

        if(arguments.length === 1)
            throw new HamburgerException("No stuffing given");

        if(size.type !== "size")
            throw new HamburgerException(`Invalid size '${size.name}'`);

        if(stuffing.type !== "stuffing")
            throw new HamburgerException(`Invalid stuffing '${stuffing.name}'`);

        this.size = size;
        this.stuffing = stuffing;
        this.toppings = [];
    }catch(e){
        console.log(`${e.name}: ${e.message}`)
    }
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
 * Добавить добавку к гамбургеру. Можно добавить несколько добавок, при условии, что они разные.
 * @param topping     Тип добавки
 * @throws {HamburgerException}  При неправильном использовании
*/
Hamburger.prototype.addTopping = function(topping){
    try{
        if(topping.type !== 'topping'){
            throw new HamburgerException(`Invalid topping '${topping.name}'`);
        }
        if(!this.toppings.includes(topping)){
            this.toppings.push(topping);
        }else{
            throw new HamburgerException(`Duplicate topping '${topping.name}'`)
        }
    }catch(e){
        console.log(`${e.name}: ${e.message}`);
    }
};
/*
 * Убрать добавку, при условии, что она ранее была добавлена.
 * @param topping   Тип добавки
 * @throws {HamburgerException}  При неправильном использовании
*/
Hamburger.prototype.removeTopping = function(topping){
    try{
        if(topping.type !== "topping")
            throw new HamburgerException(`Invalid topping '${topping.name}'`);

        if(this.toppings.includes(topping)){
            this.toppings.splice(this.toppings.indexOf(topping), 1);
        }else{
            throw new HamburgerException(`Hamburger doesn't have '${topping.name}'`);
        }
    }catch(e){
        console.log(`${e.name}: ${e.message}`)
    }
};

/*
 * Получить список добавок.
 * @return {Array} Массив добавленных добавок, содержит константы
 *                 Hamburger.TOPPING_*
*/
Hamburger.prototype.getToppings = function(){
    return this.toppings;
};
/**
 * Узнать размер гамбургера
 */
Hamburger.prototype.getSize = function(){
    return this.size;
};
/**
 * Узнать начинку гамбургера
 */
Hamburger.prototype.getStuffing = function(){
    return this.stuffing;
};
/*
 * Узнать цену гамбургера
 * @return {Number} Цена в тугриках
*/
Hamburger.prototype.calculatePrice = function(){
    let price = this.size.price + this.stuffing.price;
    for(let key of this.toppings){
        price += key.price;
    }
    return price;
};
/*
 * Узнать калорийность
 * @return {Number} Калорийность в калориях
*/
Hamburger.prototype.calculateCalories = function(){
    let calories = this.size.call + this.stuffing.call;
    for(let key of this.toppings){
        calories += key.call;
    }
    return calories;
};
/*
 * Представляет информацию об ошибке в ходе работы с гамбургером.
 * Подробности хранятся в свойстве message.
 * @constructor
*/
function HamburgerException(message){
    this.message = message;
    this.name = "HamburgerException";
}

// маленький гамбургер с начинкой из сыра
let hamburger = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_CHEESE);
console.log(hamburger);
// добавка из майонеза
hamburger.addTopping(Hamburger.TOPPING_MAYO);
// спросим сколько там калорий
console.log("Calories: %f", hamburger.calculateCalories());
// сколько стоит
console.log("Price: %f", hamburger.calculatePrice());
// я тут передумал и решил добавить еще приправу
hamburger.addTopping(Hamburger.TOPPING_SPICE);
// А сколько теперь стоит?
console.log("Price with sauce: %f", hamburger.calculatePrice());
// Проверить, большой ли гамбургер?
console.log("Is hamburger large: %s", hamburger.getSize() === Hamburger.SIZE_LARGE); // -> false
// Убрать добавку
hamburger.removeTopping(Hamburger.TOPPING_SPICE);
console.log("Have %d toppings", hamburger.getToppings().length); // 1

// не передали обязательные параметры
let h2 = new Hamburger(); // => HamburgerException: no size given

// передаем некорректные значения, добавку вместо размера
let h3 = new Hamburger(Hamburger.TOPPING_SPICE, Hamburger.TOPPING_SPICE);
// => HamburgerException: invalid size 'TOPPING_SAUCE'

// добавляем много добавок
let h4 = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_CHEESE);
hamburger.addTopping(Hamburger.TOPPING_MAYO);
hamburger.addTopping(Hamburger.TOPPING_MAYO);
// HamburgerException: duplicate topping 'TOPPING_MAYO'

