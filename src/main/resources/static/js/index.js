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

                const addressChild = document.querySelectorAll(".addressChild");
                if(addressChild.length!==0) {
                    addressChild.forEach((el)=>{
                        searchBox.removeChild(el)
                    })
                }

                appendSearchElement(result.addresses)
            },
        )
    }
}

const appendSearchElement = (addresses) => {
    if(addresses.length>0) {
        addresses.forEach((element)=>{
            const addressName = document.createElement('div')
            addressName.classList.add('addressChild')
            addressName.textContent = element.roadAddress
            searchBox.appendChild(addressName)
        })
    }
}