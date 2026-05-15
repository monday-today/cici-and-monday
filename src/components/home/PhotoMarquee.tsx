const PHOTOS = Array.from({ length: 7 }, (_, i) => `/images/marquee/${i + 1}.jpg`)

export function PhotoMarquee() {
  return (
    <div className="relative flex-1 h-full" style={{ overflowX: 'clip', overflowY: 'visible' }}>
      <div
        className="flex items-center h-full"
        style={{
          width: 'max-content',
          animation: 'marquee-scroll 20s linear infinite',
        }}
      >
        {[...PHOTOS, ...PHOTOS].map((src, i) => (
          <div key={i} className="h-full shrink-0 flex items-center px-1">
            <img
              src={src}
              alt=""
              className="h-full w-auto rounded-xl object-contain cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-125"
            />
          </div>
        ))}
      </div>
      <div
        className="absolute top-0 bottom-0 left-0 pointer-events-none"
        style={{
          width: '12%',
          background: 'linear-gradient(to left, transparent, #ECF0F5)',
        }}
      />
    </div>
  )
}
