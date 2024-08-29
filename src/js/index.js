class routeMap {

    constructor(name) {
        this.name = name
        this.map = null
        this.vectorLayer = null //armaena a camada de marcadores
        this.vectorSource = new ol.source.Vector() //armazena a fonte dos marcadores
    }

    initMap() {
        this.createMap()
    }

    eventMapClicks() {
        this.map.on('click', (event) => this.handleCreateMakerMapClick(event))
        this.map.on('contextmenu', (event) => this.handleRemoveMakerClickRight(event))
    }

    createMap() {
        const view = new ol.View({
            center: ol.proj.fromLonLat([-46.6333, -23.5505]),
            zoom: 12,
        })

        const layers = new ol.layer.Tile({
            source: new ol.source.OSM(),
        })

        this.map = new ol.Map({
            view: view,
            layers: [layers],
            target: 'map',
        })

        this.eventMapClicks()

        this.vectorLayer = new ol.layer.Vector({
            source: this.vectorSource
        })

        this.map.addLayer(this.vectorLayer)

        this.createMarker(this.defaultCoordinates())
    }

    handleCreateMakerMapClick(event) {
        const coordinates = ol.proj.toLonLat(event.coordinate)
        console.log('Coordenadas:', coordinates)
        this.createMarker(coordinates)
    }


    /**
     * Cria um marcador no mapa, chamando a função Feature do OpenLayers
     * @param {Array} coordinates
     */
    createMarker(coordinates) {
        const featureMarker = new ol.Feature({
            geometry: new ol.geom.Point(
                ol.proj.fromLonLat(coordinates)
            )
        })

        const iconMaker = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: './src/icons/pinker.svg',
                scale: 1,
                className: 'icon-marker'
            })
        })

        featureMarker.setStyle(iconMaker)

        //adiciona o marcador na camada de marcadores (sem recriar a camada)
        this.vectorSource.addFeature(featureMarker)
    }

    handleRemoveMakerClickRight(event) {
        event.preventDefault()

        const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => feature)

        if (feature) {
            this.vectorSource.removeFeature(feature)
            console.log('Marcador removido: ', feature)
        }
    }

    getIconMarker() {
        const iconMarker = $('<img>').addClass('icon-marker').attr('src', './src/icons/pinker.svg')
        return iconMarker
    }

    /**
     * 
     * @returns {Array} Retorna um array com as coordenadas padrão de São Paulo
     */
    defaultCoordinates() {
        return [-46.6333, -23.5505]
    }
}

const main = $('#map')
const map = new routeMap()


main.append(map.initMap())