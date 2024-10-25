const search = document.querySelector(".search-query");
const searchBox = document.querySelector(".searchBox");
let markers = []
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

const setMaker = (lat, lon) => {
    const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lon),
        map: map
    });
    markers.push(marker)
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

    const resultXml = await result.text()
    const xmlParser = new DOMParser()
    const xmlDoc = xmlParser.parseFromString(resultXml, "text/xml")

    let emergencyRoomInfo = xmlDoc.getElementsByTagName("item")

    markers.forEach((marker)=>{
        marker.setMap(null)
    })
    markers = []
    if (emergencyRoomInfo.length === 0) {
        alert('데이터가 없습니다.')
    } else if (emergencyRoomInfo.length > 1) {
        Array.prototype.forEach.call(emergencyRoomInfo,(el, index)=>{
            if(index === 0) map.setCenter(naver.maps.LatLng(el.getElementsByTagName('wgs84Lat')[0].innerHTML, el.getElementsByTagName('wgs84Lon')[0].innerHTML))
            setMaker(el.getElementsByTagName('wgs84Lat')[0].innerHTML, el.getElementsByTagName('wgs84Lon')[0].innerHTML)
            map.setZoom(12, true)
        })
    } else {
        map.setCenter(naver.maps.LatLng(emergencyRoomInfo[0].getElementsByTagName('wgs84Lat')[0].innerHTML, emergencyRoomInfo[0].getElementsByTagName('wgs84Lon')[0].innerHTML))
        setMaker(emergencyRoomInfo[0].getElementsByTagName('wgs84Lat')[0].innerHTML, emergencyRoomInfo[0].getElementsByTagName('wgs84Lon')[0].innerHTML)
        map.setZoom(12, true)
    }
}