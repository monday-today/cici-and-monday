import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Travel } from '../../hooks/useSupabase'

const C = {
  cream: '#FFAB76',
  cheese: '#FFE194',
  tomato: '#FF6B6B',
  parchment: '#EDE0CE',
  brown: '#5C4033',
}

interface Props {
  travels: Travel[]
  onSelect: (travel: Travel) => void
}

function circleIcon() {
  return L.divIcon({
    html: `<div style="
      width:16px;height:16px;border-radius:50%;
      background:${C.cheese};border:3px solid ${C.brown};
      box-shadow:2px 2px 0 ${C.cream}, 0 0 0 4px ${C.parchment};
      transform:rotate(-2deg)
    "></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

function endIcon() {
  return L.divIcon({
    html: `<div style="
      width:16px;height:16px;border-radius:50%;
      background:${C.tomato};border:3px solid ${C.brown};
      box-shadow:2px 2px 0 ${C.cream}, 0 0 0 4px ${C.parchment};
      transform:rotate(-2deg)
    "></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

function photoIcon(url: string, isRight: boolean) {
  return L.divIcon({
    html: `<div style="
      width:52px;height:52px;border-radius:50%;overflow:hidden;
      border:3px solid ${C.brown};box-shadow:3px 3px 0 ${C.cheese};
      background:${C.parchment};
      ${isRight ? 'margin-left:12px' : 'margin-left:-64px'};margin-top:-26px
    "><img src="${url}" style="width:100%;height:100%;object-fit:cover" /></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export function ChinaMap({ travels, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layersRef = useRef<L.Layer[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [35, 105],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      maxBounds: L.latLngBounds(L.latLng(15, 68), L.latLng(56, 138)),
      maxBoundsViscosity: 1.0,
    })

    // Subtle tile layer — pushed way back with low opacity
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {
      subdomains: ['1', '2', '3', '4'],
      maxZoom: 18,
      opacity: 0.35,
    }).addTo(map)

    // Province borders — the main visual feature
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then(r => r.json())
      .then(geo => {
        L.geoJSON(geo, {
          style: {
            color: C.brown,
            weight: 1.5,
            opacity: 0.5,
            fillColor: C.cheese,
            fillOpacity: 0.06,
            dashArray: '5 8',
          },
          interactive: false,
        }).addTo(map)
      })
      .catch(() => {})

    const container = map.getContainer()

    // Paper grain
    const grain = document.createElement('div')
    grain.style.cssText = `
      position:absolute;inset:0;z-index:500;pointer-events:none;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
      mix-blend-mode:multiply;
    `
    container.appendChild(grain)

    // Vignette
    const vignette = document.createElement('div')
    vignette.style.cssText = `
      position:absolute;inset:0;z-index:550;pointer-events:none;
      background:radial-gradient(ellipse at center, transparent 50%, rgba(92,64,51,0.25) 100%);
    `
    container.appendChild(vignette)

    // Warm wash over everything
    const wash = document.createElement('div')
    wash.style.cssText = `
      position:absolute;inset:0;z-index:600;pointer-events:none;
      background:linear-gradient(135deg, ${C.cheese}22, ${C.cream}18, ${C.cheese}22);
    `
    container.appendChild(wash)

    const style = document.createElement('style')
    style.textContent = `
      .leaflet-container { background: ${C.parchment}; }
      .leaflet-tile {
        filter: sepia(0.85) saturate(0.12) brightness(1.12) contrast(0.7) hue-rotate(-10deg) !important;
        -webkit-font-smoothing: antialiased;
      }
    `
    containerRef.current.appendChild(style)

    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    layersRef.current.forEach(l => l.remove())
    layersRef.current = []

    const sorted = [...travels]
      .filter(t => t.lat !== 0 && t.lng !== 0)
      .sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime())

    if (sorted.length === 0) { map.setView([35, 105], 5); return }

    sorted.forEach((t, i) => {
      const isRight = i % 2 === 0
      const { lat, lng } = t
      const hasPhoto = t.image_urls && t.image_urls.length > 0
      const isEnd = i === sorted.length - 1
      const plng = isRight ? lng + 1.8 : lng - 1.8
      const plat = lat + 1.2

      const marker = L.marker([lat, lng], { icon: isEnd ? endIcon() : circleIcon() }).addTo(map)
      marker.on('click', () => onSelect(t))
      layersRef.current.push(marker)

      const label = L.marker([lat, lng], {
        icon: L.divIcon({
          html: `<span style="
            font-size:12px;color:${C.brown};font-weight:700;
            white-space:nowrap;font-family:-apple-system,sans-serif;
            background:${C.cheese};padding:2px 10px;border-radius:12px;
            border:2px solid ${C.brown};
            box-shadow:2px 2px 0 ${C.cream};
          ">${t.title}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, -16],
        }),
      }).addTo(map)
      label.on('click', () => onSelect(t))
      layersRef.current.push(label)

      if (hasPhoto) {
        const connector = L.polyline(
          [[lat, lng], [plat, plng]],
          { color: C.brown, weight: 1.5, opacity: 0.35, dashArray: '6 8' }
        ).addTo(map)
        layersRef.current.push(connector)

        const photo = L.marker([plat, plng], {
          icon: photoIcon(t.image_urls![0], isRight),
        }).addTo(map)
        photo.on('click', () => onSelect(t))
        layersRef.current.push(photo)
      }
    })

    if (sorted.length > 1) {
      const latlngs = sorted.map(t => L.latLng(t.lat, t.lng))
      const route = L.polyline(latlngs, {
        color: C.brown, weight: 2.5, opacity: 0.45, dashArray: '10 8', smoothFactor: 2,
      }).addTo(map)
      layersRef.current.push(route)
    }

    map.setView([35, 105], 5)
  }, [travels, onSelect])

  return (
    <div className="relative w-full select-none" style={{ height: 520 }}>
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden"
        style={{
          background: C.parchment,
          borderRadius: 20,
          border: '3px solid #5C4033',
          boxShadow: '5px 5px 0 #FFAB76, inset 0 0 140px rgba(92,64,51,0.08)',
        }}
      />
      <svg
        viewBox="0 0 40 40"
        width="36"
        height="36"
        className="absolute"
        style={{ bottom: 12, right: 12, opacity: 0.35, filter: 'drop-shadow(1px 1px 0 #FFAB76)' }}
      >
        <circle cx="20" cy="20" r="18" fill="none" stroke="#5C4033" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="15" fill="none" stroke="#5C4033" strokeWidth="0.5" strokeDasharray="2 3" />
        <polygon points="20,3 17.5,17.5 3,20 17.5,22.5 20,37 22.5,22.5 37,20 22.5,17.5" fill="#5C4033" />
        <polygon points="20,8 18.5,18.5 8,20 18.5,21.5 20,32 21.5,21.5 32,20 21.5,18.5" fill="#FFAB76" opacity="0.7" />
        <text x="20" y="6" textAnchor="middle" fontSize="5" fill="#5C4033" fontWeight="700">N</text>
      </svg>
    </div>
  )
}
