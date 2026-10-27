export function WarehouseIllustration() {
  return (
    <svg className="mx-auto block h-auto w-full max-w-[520px]" viewBox="0 0 640 350" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="wms-floor-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" stroke="#b5cbb4" strokeOpacity=".09" />
        </pattern>
        <g id="wms-storage-box">
          <rect width="36" height="38" rx="2" fill="#a8b59a" />
          <path d="M15 0h7v13l-3.5-2-3.5 2V0Z" fill="#d1d9c3" />
          <path d="M7 29h9M7 32h6" stroke="#52634d" strokeWidth="1.5" />
        </g>
        <g id="wms-storage-rack">
          <path d="M0 0 128 0 146-13 18-13Z" fill="#62735e" />
          <path d="M128 0 146-13V180l-18 13Z" fill="#344b39" />
          <rect width="128" height="193" fill="#203d2e" />
          <path d="M0 0v201M128 0v201M0 56h128M0 116h128M0 176h128" stroke="#71806a" strokeWidth="5" />
          <use href="#wms-storage-box" x="8" y="14" />
          <use href="#wms-storage-box" x="47" y="14" />
          <rect x="86" y="24" width="33" height="28" rx="2" fill="#87987d" />
          <path d="M99 24h7v10h-7z" fill="#bcc9ae" />
          <rect x="8" y="74" width="52" height="38" rx="2" fill="#dcaa6b" />
          <path d="M30 74h8v15h-8z" fill="#f5d1a0" />
          <path d="M15 104h14" stroke="#927044" strokeWidth="1.5" />
          <use href="#wms-storage-box" x="67" y="74" />
          <use href="#wms-storage-box" x="8" y="134" />
          <use href="#wms-storage-box" x="47" y="134" />
          <use href="#wms-storage-box" x="86" y="134" />
          <path d="M-5 201h14m110 0h14" stroke="#8a977f" strokeWidth="4" />
        </g>
      </defs>

      <ellipse cx="320" cy="288" rx="268" ry="39" fill="#142c20" fillOpacity=".45" />
      <path d="M36 103 320 22l284 81v204H36Z" fill="url(#wms-floor-grid)" />
      <path d="M37 107 320 26l283 81M66 100v167m508-167v167" stroke="#69836b" strokeOpacity=".35" />
      <path d="M110 85v18m420-18v18M320 28v36" stroke="#a9bca2" strokeOpacity=".6" />
      <path d="M99 105h22m198-39h22m179 39h22" stroke="#e6c48f" strokeWidth="3" strokeLinecap="round" />
      <use href="#wms-storage-rack" transform="translate(83 101)" />
      <use href="#wms-storage-rack" transform="translate(255 75)" />
      <use href="#wms-storage-rack" transform="translate(427 101)" />
      <path d="M60 323h132c22 0 27-15 48-15h131c22 0 29 15 52 15h150" stroke="#e6b77b" strokeOpacity=".7" strokeWidth="2" strokeDasharray="5 7" />
      <path d="m565 317 8 6-8 6" stroke="#e6b77b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="323" r="4" fill="#e6b77b" />
      <g transform="translate(280 282)">
        <rect width="78" height="26" rx="4" fill="#d6dfca" />
        <path d="M10 7v12m3-12v12m5-12v12m3-12v12m5-12v12m6-12v12m3-12v12m5-12v12m3-12v12m6-12v12m3-12v12m5-12v12m3-12v12m5-12v12" stroke="#314a37" strokeWidth="2" />
      </g>
    </svg>
  )
}
