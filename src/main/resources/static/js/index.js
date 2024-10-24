const search = document.querySelector(".search-query");
const searchBox = document.querySelector(".searchBox");

// fetch('', {})

search.oninput = (word) => {
    if (word.target.value !== '') {
        naver.maps.Service.geocode(
            {
                query: word.target.value,
            },
            (status, response) => {
                let result = response.v2
                // searchBox.removeChild()
                appendSearchElement(result.addresses)
            },
        )
    }
}

const appendSearchElement = (addresses) => {
    if(addresses.length>0) {
        addresses.forEach((element)=>{
            const heading = document.createElement('div');
            heading.textContent = element.roadAddress
            searchBox.appendChild(heading);
        })
    }
}