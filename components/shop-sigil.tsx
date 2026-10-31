import styles from './story-journey.module.css';

export function CollectionSigil({ element, index }: { element: string; index: number }) {
  const id = element.toLowerCase();
  return <span className={styles.collectionSigil} data-element={id} aria-hidden="true">
    <span className={styles.sigilCoordinates}>M / {String(index + 1).padStart(2, '0')}</span>
    <svg viewBox="0 0 320 360" role="presentation">
      <rect className={styles.sigilFrame} x="28" y="28" width="264" height="304" rx="132" />
      {id === 'fire' && <>
        <path className={styles.sigilOrbit} d="M60 246C92 319 229 330 273 236C309 157 264 64 174 50C87 37 29 122 49 202" />
        <g className={styles.sigilPrimary}>
          <path d="M165 303C100 273 100 218 136 179C166 146 165 110 151 72C207 105 237 155 216 207C205 181 188 169 174 162C185 207 149 218 160 259C165 244 175 229 194 217C204 255 193 283 165 303Z" />
          <path className={styles.sigilCut} d="M166 282C145 263 146 240 166 218C184 239 187 263 166 282Z" />
        </g>
        <g className={styles.sigilParticles}><circle cx="89" cy="113" r="5" /><circle cx="243" cy="120" r="3" /><circle cx="242" cy="270" r="6" /></g>
      </>}
      {id === 'earth' && <>
        <g className={styles.sigilOrbit}>
          <path d="M48 193C68 99 126 55 210 76C279 94 294 179 253 247C217 307 119 319 66 257C51 239 43 217 48 193Z" />
          <path d="M76 194C91 124 133 92 197 106C249 118 260 180 230 230C202 275 132 283 91 238C79 225 72 209 76 194Z" />
          <path d="M107 193C117 151 144 133 183 141C216 148 221 188 203 217C185 246 141 249 118 222C110 214 105 203 107 193Z" />
        </g>
        <g className={styles.sigilPrimary}>
          <path d="M160 276V188" />
          <path d="M160 207C130 195 119 170 124 142C153 146 169 164 160 207Z" />
          <path d="M160 231C190 218 204 191 197 163C171 169 155 191 160 231Z" />
          <path d="M110 276H210" />
        </g>
        <g className={styles.sigilParticles}><circle cx="95" cy="112" r="4" /><circle cx="233" cy="242" r="5" /><circle cx="238" cy="99" r="2" /></g>
      </>}
      {id === 'water' && <>
        <g className={styles.sigilOrbit}>
          <circle cx="160" cy="182" r="126" /><circle cx="160" cy="182" r="94" /><circle cx="160" cy="182" r="61" />
        </g>
        <g className={styles.sigilPrimary}>
          <path d="M79 187C113 147 144 148 171 181C196 211 218 213 244 188" />
          <path d="M79 218C111 183 142 183 171 214C197 241 219 241 244 217" />
          <path d="M160 89C160 89 201 139 201 169C201 193 183 211 160 211C137 211 119 193 119 169C119 139 160 89 160 89Z" />
        </g>
        <g className={styles.sigilParticles}><circle cx="83" cy="126" r="5" /><circle cx="237" cy="116" r="3" /><circle cx="235" cy="269" r="6" /></g>
      </>}
      {id === 'wind' && <>
        <path className={styles.sigilOrbit} d="M54 227C83 299 188 326 254 265C318 207 290 91 206 58C119 24 42 92 45 175" />
        <g className={styles.sigilPrimary}>
          <path d="M68 151C111 151 120 122 113 101C150 107 167 127 161 151H253" />
          <path d="M54 184H217C248 184 253 151 233 140" />
          <path d="M77 218H188C219 218 225 250 205 264" />
          <path d="M109 251H163" />
        </g>
        <g className={styles.sigilParticles}><circle cx="78" cy="111" r="5" /><circle cx="252" cy="109" r="3" /><circle cx="258" cy="246" r="6" /></g>
      </>}
    </svg>
    <span className={styles.sigilAxis} />
  </span>;
}
