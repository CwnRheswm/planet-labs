import { TileLayer, MapContainer, Polygon } from "react-leaflet";

const Map = ({tractDetail}: any) => {
  return (
    <>
      {tractDetail != null && (
        <div>
          <h4 style={{ textAlign: 'center' }}>{tractDetail.name}</h4>
          <MapContainer
            style={{ height: "40vh", width: "45vw" }}
            center={tractDetail.center}
            zoom={10}
            >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polygon pathOptions={{color: 'purple'}} positions={tractDetail.coords}/>
          </MapContainer>
        </div>
      )}
    </>
  )
}

export default Map;