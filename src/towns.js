/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    
    showLoadingBlock();

    return new Promise((resolve, reject) => {
        fetch ("https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json").then(response => {
            if (response.status == 200) {
                return response.json();
            }
        }).then(array => {
        
            array.sort((a, b) => a.name.localeCompare(b.name));

            resolve(array);
        }).catch(() => {
            reject("Не удалось загрузить города");
        }).finally(e => {
            
            hideLoadingBlock();

            return e;
        })
    });
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toLowerCase().includes(chunk.toLowerCase());
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */

const hideLoadingBlock = () => {
    if (loadingBlock) {
        loadingBlock.style.visibility = "hidden";
    }
};

const showLoadingBlock = () => {
    if (loadingBlock) {
        loadingBlock.style.visibility = "visible";
    }

    if (filterBlock) {
        filterBlock.style.display = "block";
    }
}
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

filterInput.addEventListener('keyup', function() {
    // это обработчик нажатия кливиш в текстовом поле
    const value = event.currentTarget.value;

    loadTowns().then(towns => {
        while (filterResult.firstChild) {
            filterResult.removeChild(filterResult.lastChild);
        }

        if (value == "") {
            return;
        }

        const resultTowns = towns.filter((e) => isMatching(e.name, value));

        const fragment = document.createDocumentFragment();

        resultTowns.forEach((e) => {
            const townEl = document.createElement("div");

            townEl.innerText = e.name;
            fragment.appendChild(townEl);
        });

        filterResult.appendChild(fragment);
    });
});

export {
    loadTowns,
    isMatching
};
