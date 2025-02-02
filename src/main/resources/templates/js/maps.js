const mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 10
};

const map = new naver.maps.Map('map', mapOptions);
const search = document.querySelector(".search-query");
const searchBox = document.querySelector(".searchBox");
let markers = []
let searchResult
let config
let saveInfoWindows = []

const getApiProperties = async () => {
    config = await (await fetch('/api/config')).json()
}
getApiProperties()

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

search.onkeyup = (event) => {
    if(event.key==='Enter') {
        if (searchResult !== undefined && searchResult.addresses.length!==0) searchEmergencyRoom(searchResult.addresses, 0)
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
            address.onclick = () => {
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

const setEventOnMarker = (marker, hospitalName) => {
    let contentString = [
        '<div class="iw_inner">',
        '   <h3>' + hospitalName + '</h3>',

        '</div>',
    ].join('')

    let infoWindow = new naver.maps.InfoWindow({
        content: contentString,
    })

    saveInfoWindows.push(infoWindow)
    naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindow.getMap()) {
            infoWindow.close()
        } else {
            infoWindow.open(map, marker)
        }
    })
}

const refreshMap = () => {
    if (saveInfoWindows.length > 0) {
        saveInfoWindows.forEach(infoWindow => {
            infoWindow.close()
        })
        saveInfoWindows = []
    }
    markers.forEach((marker)=>{
        marker.setMap(null)
    })
    markers = []
}

const searchEmergencyRoom = async (addresses, index) => {
    const params = {
        Q0: addresses[index].addressElements[0].longName,
        Q1: addresses[index].addressElements[1].longName !== '' ? addresses[index].addressElements[1].longName : '',
        pageNo: 1,
        numOfRows: 10,
        serviceKey: config.serviceKey
    }

    const queryString = new URLSearchParams(params).toString();
    const result = await fetch(`${config.serviceUrl}?${queryString}`, {
        method: "GET",
    });

    const resultXml = await result.text()
    const xmlParser = new DOMParser()
    const xmlDoc = xmlParser.parseFromString(resultXml, "text/xml")

    let emergencyRoomInfo = xmlDoc.getElementsByTagName("item")

    refreshMap()

    if (emergencyRoomInfo.length === 0) {
        alert('데이터가 없습니다.')
    } else if (emergencyRoomInfo.length > 1) {
        Array.prototype.forEach.call(emergencyRoomInfo,(el, index)=>{
            if(index === 0) map.setCenter(naver.maps.LatLng(el.getElementsByTagName('wgs84Lat')[0].innerHTML, el.getElementsByTagName('wgs84Lon')[0].innerHTML))
            setMaker(el.getElementsByTagName('wgs84Lat')[0].innerHTML, el.getElementsByTagName('wgs84Lon')[0].innerHTML)
            setEventOnMarker(markers[index], el.getElementsByTagName('dutyName')[0].innerHTML)
        })
        map.setZoom(12, true)
    } else {
        map.setCenter(naver.maps.LatLng(emergencyRoomInfo[0].getElementsByTagName('wgs84Lat')[0].innerHTML, emergencyRoomInfo[0].getElementsByTagName('wgs84Lon')[0].innerHTML))
        setMaker(emergencyRoomInfo[0].getElementsByTagName('wgs84Lat')[0].innerHTML, emergencyRoomInfo[0].getElementsByTagName('wgs84Lon')[0].innerHTML)
        setEventOnMarker(markers[0], emergencyRoomInfo[0].getElementsByTagName('dutyName')[0].innerHTML)
        map.setZoom(12, true)
    }
}