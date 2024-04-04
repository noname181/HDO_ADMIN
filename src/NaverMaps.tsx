import { useEffect, useRef } from 'react';

export interface CoordinateInterface {
  latitude: number;
  longitude: number;
}

interface NaverMapsProps {
  coordinate: CoordinateInterface;
}

export const NaverMaps = ({ coordinate }: NaverMapsProps) => {
  const mapElement = useRef(null);
  const { naver } = window;

  function showLocationOnMap() {
    if (!mapElement.current || !naver?.maps) return;

    const location = new naver.maps.LatLng(
      coordinate.latitude,
      coordinate.longitude,
    );

    const mapOptions = {
      center: location,
      zoom: 17,
      minZoom: 17,
      maxZoom: 17,
      draggable: false,
      scrollWheel: false,
      scaleControl: false,
      mapDataControl: false,
      keyboardShortcuts: false,
      disableDoubleClickZoom: false,
    };

    const map = new naver.maps.Map(mapElement.current, mapOptions);
    const mapMarker = new naver.maps.Marker({
      position: location,
      map,
    });
  }

  useEffect(() => {
    showLocationOnMap();
  }, [coordinate]);

  return <div ref={mapElement} style={{ height: '340px', width: '367px' }} />;
};

// export function searchAddressToCoordinate(address: string) {
//   if (!address) {
//     alert('주소를 입력해주세요.');
//     return;
//   }
//   naver.maps.Service.geocode({ query: address }, function (status, response) {
//     if (status === naver.maps.Service.Status.ERROR) {
//       alert('주소 변환에 실패하였습니다.');
//       return;
//     }
//     if (response.v2.meta.totalCount === 0) {
//       alert('주소를 찾을 수 없습니다.');
//       return;
//     }
//     const item = response.v2.addresses[0];
//     setCoordinate({
//       latitude: parseFloat(item.y),
//       longitude: parseFloat(item.x),
//     });
//   });
// }
