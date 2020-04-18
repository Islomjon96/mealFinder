document.addEventListener('DOMContentLoaded', function () { // Аналог $(document).ready(function(){
    const formEl = document.getElementById('submit');
    const searchInput = document.getElementById('search');
    const resultHeading = document.getElementById('result-heading');
    const mealsEl = document.getElementById('meals');
    const singleMealEl = document.getElementById('single-meal');
    const random = document.getElementById('random');

    // Функция, которая получает значение поля, ищет в API и выводит на UI
    function showMeals(e) {
        e.preventDefault();
        singleMealEl.innerHTML = '';
        const searchMeal = searchInput.value;
        if (searchMeal) {
            resultHeading.innerHTML = `<h2>Search result for ${searchMeal}</h2>`;
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchMeal}`)
                .then(res => res.json())
                .then(function (data) {
                    mealsEl.innerHTML = data.meals.map(el => `
                        <div class="meal" data-mealID="${el.idMeal}">
                            <img src="${el.strMealThumb}" alt="${el.strMeal}" />
                            <div class="meal-info">
                                <h3>${el.strMeal}</h3>
                            </div>
                        </div>
                    `).join('');
                })
        } else {
            alert('Search field can not be empty!');
        }
        searchInput.value = '';
    }

    // Функции рандомной еды
    function randomMeal() {
        resultHeading.innerHTML = '';
        mealsEl.innerHTML = '';

        fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
            .then(res => res.json())
            .then(function (data) {
                const mealInfo = data.meals[0];
                showSingleMeal(mealInfo);
            });
    }

    // Функция показа полученных данных еды по API в UI
    function showSingleMeal(mealInfo) {
        const ingrArr = [];
        for (let i = 1; i < 20; i++) {
            if (mealInfo[`strIngredient${i}`]) {
                ingrArr.push(`${mealInfo[`strIngredient${i}`]} - ${mealInfo[`strMeasure${i}`]}`);
            }
        }
        singleMealEl.innerHTML = `
            <div class="single-meal">
                <h1>${mealInfo.strMeal}</h1>
                <img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}"/>
                <div class="single-meal-info">
                    <p>${mealInfo.strCategory}</p>
                    <p>${mealInfo.strArea}</p>
                </div>
                <div class="main">
                    <p>${mealInfo.strInstructions}</p>
                    <h2>Ingredients</h2>
                    <ul>
                        ${ingrArr.map( el => `<li>${el}</li>`)}
                    </ul>
                </div>
            </div>
        `
    }

    // Событие при нажатии на изображение еды в выведенном списке по API
    mealsEl.addEventListener('click', function (e) {
        const mealID = e.composedPath().find(el => el.classList.contains('meal')).getAttribute('data-mealid');

        if (mealID) {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
                .then(res => res.json())
                .then(function (data) {
                    const mealInfo = data.meals[0];
                    showSingleMeal(mealInfo);
                })
        }
    })

    // Событие при нажатии на кнопку Поиск 
    formEl.addEventListener('submit', showMeals);

    // Событие при нажатии на кнопку Рандом
    random.addEventListener('click', randomMeal);

});