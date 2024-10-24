let search = document.querySelector(".search-query");

// fetch('', {})

search.oninput = (word) => {
    if (word.target.value !== '') {
        naver.maps.Service.geocode(
            {
                query: word.target.value,
            },
            (status, response) => {
                let result = response.v2
                console.log(result)
            },
        )
    }
}