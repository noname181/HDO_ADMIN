import { useEffect, useRef } from 'react';

export interface CoordinateInterface {
  latitude: number;
  longitude: number;
}

interface NaverMapsProps {
  coordinate: CoordinateInterface;
}

export const StationMaps = ({ coordinate }: NaverMapsProps) => {
  const mapElement = useRef(null);
  const { naver } = window;

  function showLocationOnMap() {
    if (!mapElement.current || !naver?.maps) return;

    const location = new naver.maps.LatLng(
      coordinate?.latitude,
      coordinate?.longitude,
    );

    const mapOptions = {
      center: location,
      minZoom: 15,
      zoom: 17,
      maxZoom: 19,
      // draggable: false,
      // scrollWheel: false,
      scaleControl: false,
      mapDataControl: false,
      keyboardShortcuts: false,
      disableDoubleClickZoom: false,
    };

    const map = new naver.maps.Map(mapElement.current, mapOptions);
    // eslint-disable-next-line no-new
    new naver.maps.Marker({
      position: location,
      map,
    });
  }

  useEffect(() => {
    showLocationOnMap();
  }, [coordinate]);

  return <div ref={mapElement} style={{ height: '340px', width: '100%' }} />;
};
