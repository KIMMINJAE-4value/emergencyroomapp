const search = document.querySelector(".search-query");
const searchBox = document.querySelector(".searchBox");
let searchResult

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
                searchResult = result
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

        const selectAddress = document.querySelectorAll(".addressChild");
        selectAddress.forEach((address, index)=>{
            address.onclick = (el) => {
                searchEmergencyRoom(searchResult.addresses, index)
            }
        })
    }
}

const searchEmergencyRoom = async (addresses, index) => {
    const params = {
        Q0: addresses[index].addressElements[0].longName,
        Q1: addresses[index].addressElements[1].longName !== '' ? addresses[index].addressElements[1].longName : '',
        pageNo: 1,
        numOfRows: 10,
        serviceKey: "Y7vAdTl7q7jOH5H6IKsEyWH0/GEO20KLTe+wxnTDJYmC8ewsrBJ7wIekeCwBMxTvgpNlGbxsvKijRsQN2xcPxQ=="
    }
    const queryString = new URLSearchParams(params).toString();

    const result = await fetch(`https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytListInfoInqire?${queryString}`, {
        method: "GET",
    });

    console.log(result)
}