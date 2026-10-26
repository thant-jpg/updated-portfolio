// Small, dependency-free rigid-disc simulation; SVG pieces share one print palette.
const motifs = [
  [
    'Stepped architectural model',
    '<path d="m7 66 15-9V43l14-8V22L56 9l17 10v47L38 78Z" fill="currentColor"/><path d="m7 66 31 12V64L22 55m16 9 35-20M36 35l18 10V31L36 22m18 23 19-11M56 9v14l17-4"/>',
  ],
  [
    'Masonry arch',
    '<path d="M8 74V35a32 32 0 0 1 64 0v39H53V36a13 13 0 0 0-26 0v38Z" fill="currentColor"/><path d="M17 35h10m26 0h10M40 5v18M19 13l12 14m30-14L49 27M9 49h18m26 0h19M9 63h18m26 0h19"/>',
  ],
  [
    'Pitched roof house',
    '<path d="M5 36 34 7l39 19v42L39 78 8 63V37Z" fill="currentColor"/><path d="m5 36 34 16 34-26M34 7l5 45v26M15 43v13l11 5V48Zm34 7v15l13-5V45Z"/>',
  ],
  [
    'Tower model',
    '<path d="m20 13 26-9 19 10v56l-27 9-18-10Z" fill="currentColor"/><path d="m20 13 18 11 27-10M38 24v55M25 25l8 5m-8 6 8 5m-8 6 8 5m-8 6 8 5M44 29l15-5M44 41l15-5M44 53l15-5M44 65l15-5"/>',
  ],
  [
    'Structural portal frame',
    '<path d="M5 76V8h70v68H60V22H20v54Z" fill="currentColor"/><path d="M10 14h58M12 21v48m55-48v48M20 22l14 14m26-14L46 36"/>',
  ],
  [
    'Apartment floor plan',
    '<path d="M5 6h70v69H5Z" fill="currentColor"/><path d="M12 13h56v55H12Zm25 0v21H12m25 12v22m0-26h31M37 34h10v8m0-8a8 8 0 0 1 8 8M18 18h12v10H18Zm27 30h15v12H45Z"/>',
  ],
  [
    'Building section',
    '<path d="M6 73V31L40 5l34 26v42Z" fill="currentColor"/><path d="m14 32 26-20 26 20M14 32h52M14 51h52M14 68h52M26 32v36m28-36v36M30 51v-5h5v-5h5v-5h5"/>',
  ],
  [
    'Colonnade',
    '<path d="M4 11h72v11H4Zm5 16h13v39H9Zm25 0h13v39H34Zm25 0h13v39H59ZM4 68h72v9H4Z" fill="currentColor"/><path d="M15 30v32m25-32v32m25-32v32M5 17h70"/>',
  ],
  [
    'Sawtooth workshop',
    '<path d="M5 72V28l23-18v18l23-18v18l23-18v62Z" fill="currentColor"/><path d="M13 38h11v13H13Zm23 0h11v13H36Zm23 0h8v13h-8M33 72V58h17v14"/>',
  ],
  [
    'Truss bridge',
    '<path d="M4 28h72v35H4Z" fill="currentColor"/><path d="M10 34h60v22H10Zm0 22 10-22 10 22 10-22 10 22 10-22 10 22M6 69h68"/>',
  ],
  [
    'Spiral stair',
    '<path d="M35 6h11v68H35Z" fill="currentColor"/><path d="m40 8 30 12-30 8-28 10 28 10 29 11-29 12-29-12" stroke="currentColor" stroke-width="9"/><path d="m40 13 22 7-22 5m-2 8-19 5 19 6m4 10 19 5-19 7"/>',
  ],
  [
    'Wireframe volume',
    '<path d="m40 5 33 18v36L40 77 7 59V23Z" fill="currentColor"/><path d="m7 23 33 19 33-19M40 42v35M40 5v37M7 59l33-17 33 17"/>',
  ],
  [
    'Chair',
    '<path d="M16 7h38v35l16 8v9H56v17h-8V59H24v17h-8V49H9v-9h7Z" fill="currentColor"/><path d="M23 15h23v23H23Zm-7 27 32 10 22-2M24 59v-8"/>',
  ],
  [
    'Round stool',
    '<ellipse cx="40" cy="22" rx="29" ry="14" fill="currentColor"/><path d="M17 24h9l-5 50h-8Zm36 0h9l6 50h-9ZM36 27h9v46h-9Z" fill="currentColor"/><path d="M19 49h42M15 23c15 8 35 8 49 0"/>',
  ],
  [
    'Dining table',
    '<path d="m6 25 38-16 31 17-36 19Z" fill="currentColor"/><path d="M9 27h8v40H9Zm26 14h8v35h-8Zm30-12h8v37h-8Z" fill="currentColor"/><path d="m13 27 26 12 29-12"/>',
  ],
  [
    'Floor lamp',
    '<path d="m27 6-16 27h48L45 6ZM32 34h8v34H32Zm-12 37h32v7H20Z" fill="currentColor"/><path d="M23 28h25M36 8v17"/>',
  ],
  [
    'Bookshelf',
    '<path d="M9 5h62v71H9Z" fill="currentColor"/><path d="M17 13h46v54H17Zm0 18h46M17 49h46M23 16v12m7-12v12m7-12 5 12m8-12v12M23 35v11m9-11v11m12-11 5 11m7-11v11"/>',
  ],
  [
    'Park bench',
    '<path d="M8 10h63v13H8Zm0 17h63v12H8ZM4 45h72v12H4Zm9 11h9v20h-9Zm45 0h9v20h-9ZM10 38h7v7h-7Zm53 0h7v7h-7Z" fill="currentColor"/><path d="M12 17h55M12 33h55M9 51h62"/>',
  ],
  [
    'Coffee cup',
    '<path d="M10 23h48v8h8a13 13 0 0 1 0 26H55a23 23 0 0 1-45-7Zm48 16v10h8a5 5 0 0 0 0-10Z" fill="currentColor"/><path d="M19 29v19M9 73h58M24 16c-8-6 8-7 0-13m15 13c-8-6 8-7 0-13"/>',
  ],
  [
    'Bubble tea',
    '<path d="M29 5h9l7 20h22l-7 49H20l-7-49h23Z" fill="currentColor"/><path d="M15 25h50M22 34h36"/><circle cx="29" cy="59" r="3"/><circle cx="42" cy="64" r="3"/><circle cx="53" cy="55" r="3"/><circle cx="39" cy="50" r="3"/>',
  ],
  [
    'Filament spool',
    '<circle cx="40" cy="40" r="35" fill="currentColor"/><circle cx="40" cy="40" r="9"/><circle cx="40" cy="40" r="27"/><path d="m31 16 5 15m13-15-5 15m20 9H49M16 40h15m0 24 5-15m13 15-5-15"/>',
  ],
  [
    'Domed pavilion',
    '<path d="M6 39a34 34 0 0 1 68 0ZM10 43h11v25H10Zm24 0h12v25H34Zm25 0h11v25H59ZM5 70h70v8H5Z" fill="currentColor"/><path d="M40 6v29M18 33c2-15 10-25 22-27 12 2 20 12 22 27M9 35h62"/>',
  ],
  [
    'Barrel vault',
    '<path d="M7 72V36a33 33 0 0 1 66 0v36H58V36a18 18 0 0 0-36 0v36Z" fill="currentColor"/><path d="M15 68V36a25 25 0 0 1 50 0v32M40 4v13M17 13l12 14m34-14L51 27"/>',
  ],
  [
    'Cantilever house',
    '<path d="m5 24 43-16 27 15v22L48 58 5 40Zm25 25 18 9v18l-18-9Z" fill="currentColor"/><path d="m5 24 43 19 27-20M48 43v15M13 29v9m9-5v8m9-4v8m25-7v10m9-14v10"/>',
  ],
  [
    'Roof truss',
    '<path d="M3 64 40 10l37 54Z" fill="currentColor"/><path d="M15 57 40 22l25 35Zm25-35v35M15 57l25-16 25 16M27 40l13 17 13-17"/>',
  ],
  [
    'Folded roof pavilion',
    '<path d="m3 29 19-19 19 19 18-19 18 19-18 17-18-17-19 17ZM12 40h7v33h-7Zm49-1h7v34h-7Z" fill="currentColor"/><path d="m9 29 13 10 19-17 18 17 12-10M22 12v23m37-23v23"/>',
  ],
  [
    'Spiral column',
    '<path d="M29 5h22v8H29Zm0 61h22v10H29ZM33 13h14v53H33Z" fill="currentColor"/><path d="m29 19 23 9-24 10 24 10-23 11" stroke="currentColor" stroke-width="10"/><path d="m33 20 13 7m-13 12 13 7m-13 12 13 6"/>',
  ],
  [
    'Arched window',
    '<path d="M9 73V34a31 31 0 0 1 62 0v39Z" fill="currentColor"/><path d="M18 64V34a22 22 0 0 1 44 0v30Zm22-52v52M18 39h44M18 52h44"/>',
  ],
  [
    'Facade screen',
    '<path d="M6 7h68v66H6Z" fill="currentColor"/><path d="M16 15v50m12-50v50m12-50v50m12-50v50m12-50v50M12 29h56M12 51h56"/>',
  ],
  [
    'Cantilever lounge chair',
    '<path d="m12 10 10-3 12 31h33v10H27Zm15 38h10v17h28v10H27Z" fill="currentColor"/><path d="m18 15 12 28h32M32 53v16h28"/>',
  ],
  [
    'Armchair',
    '<path d="M19 10h42v31h13v26H6V41h13ZM12 67h9v9h-9Zm47 0h9v9h-9Z" fill="currentColor"/><path d="M25 17h30v27H25Zm-11 32h52M19 43v17m42-17v17"/>',
  ],
  [
    'Sofa',
    '<path d="M12 20h56v20h10v27H2V40h10ZM8 68h9v8H8Zm55 0h9v8h-9Z" fill="currentColor"/><path d="M20 27h40v22H20Zm20 0v22M10 44v15h60V44M14 53h52"/>',
  ],
  [
    'Desk with drawers',
    '<path d="M4 17h72v10H4Zm4 10h8v48H8Zm40 0h24v48H48Z" fill="currentColor"/><path d="M54 34h12m-12 16h12m-12 16h12M49 43h22M49 59h22"/>',
  ],
  [
    'Pendant light',
    '<path d="M36 3h8v27H36ZM40 27C24 27 10 42 7 59h66C70 42 56 27 40 27Z" fill="currentColor"/><path d="M16 53h48M23 47c3-8 8-13 14-15M34 62v9m12-9v9"/>',
  ],
  [
    'Plant in architectural planter',
    '<path d="M18 49h44l-8 27H26ZM36 22h8v28h-8ZM35 37C11 37 8 19 9 12c21 0 28 8 26 25ZM45 29C45 9 61 3 74 6c-1 19-12 28-29 23Z" fill="currentColor"/><path d="M24 56h32M17 20l16 13m17-10L65 12"/>',
  ],
  [
    'Drafting set square',
    '<path d="M7 5v71h66Zm12 30 28 29H19Z" fill="currentColor" fill-rule="evenodd"/><path d="M13 17h5m-5 10h5m-5 10h5m-5 10h5m-5 10h5M27 70v-5m12 5v-5m12 5v-5"/>',
  ],
  [
    'Site model terraces',
    '<path d="m3 56 35-19 38 19-35 22ZM10 39l28-15 31 15v16L41 70 10 54ZM22 20 39 9l19 11v18L40 49 22 38Z" fill="currentColor"/><path d="m3 56 38 17 35-17M10 39l31 16 28-16M22 20l18 10 18-10M40 30v19M41 55v15"/>',
  ],
];
const softwareMotifs=[["Rhinoceros 8","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><g transform=\"translate(17 17) scale(1.916667)\" fill=\"var(--paper)\" stroke=\"none\"><path d=\"M6.823 3.103c-.1 0-.213.006-.34.017-.511.044-1.25.18-1.802.329a6.269 6.269 0 0 0-1.15.42c-.231.112-.33.178-.354.273-.023.094.028.217.16.436s.346.533.535.961c.19.428.356.97.361 1.651.006.68-.149 1.5-.245 1.962-.096.462-.133.568-.227.618-.094.05-.245.044-.525-.021-.281-.065-.69-.187-1.1-.259-.41-.072-.819-.093-1.122-.038-.304.056-.504.189-.645.369-.14.18-.224.406-.282.75A6.957 6.957 0 0 0 0 11.687c.005.317.047.49.136.584.088.094.223.109.492.054s.672-.18 1.224-.215a6.302 6.302 0 0 1 1.94.202c.685.182 1.353.49 1.95.93.598.438 1.127 1.007 1.566 1.593.438.586.787 1.189 1.004 1.541.217.353.304.455.372.42.068-.035.117-.207.145-.417a3.141 3.141 0 0 0-.02-.848 7.467 7.467 0 0 0-.32-1.365 5.617 5.617 0 0 0-.495-1.018c-.146-.247-.241-.408-.245-.51-.004-.103.085-.148.51-.315.424-.167 1.185-.457 1.958-.808.772-.351 1.556-.764 2.042-1.106.486-.341.674-.61.724-.937.05-.326-.039-.71-.16-1.076a6.93 6.93 0 0 0-.529-1.193A13.696 13.696 0 0 0 11.28 5.6a9.187 9.187 0 0 0-1.1-1.236c-.282-.255-.421-.31-.51-.29-.09.02-.131.115-.168.47-.037.356-.07.973-.144 1.559a7.468 7.468 0 0 1-.432 1.773 12.543 12.543 0 0 1-.99 1.982c-.388.64-.803 1.212-1.054 1.462-.25.25-.336.18-.477.064l-.486-.4c-.15-.125-.253-.213-.273-.293-.02-.08.045-.15.27-.448.227-.299.615-.825.96-1.478a7.75 7.75 0 0 0 .796-2.282 10.1 10.1 0 0 0 .095-2.338c-.044-.564-.124-.77-.306-.896-.137-.095-.332-.146-.638-.146zm6.48 7.034h-.012c-.084.01-.192.112-.415.294a6.86 6.86 0 0 1-1.017.7c-.458.257-1.038.507-1.51.734-.47.226-.831.429-1.004.712-.172.283-.155.648.04.85.194.204.566.246.883.259.318.013.58-.002.826.087.246.09.475.285.764.516.288.23.637.498.925.561.289.063.518-.079.766-.202.249-.124.516-.23.888-.225.371.005.847.12 1.318.37.47.248.938.63 1.184.866.247.236.272.327.245.362-.028.036-.108.018-.304-.14-.196-.157-.508-.454-.917-.688-.41-.234-.916-.404-1.4-.391-.482.013-.94.21-1.23.55-.29.34-.412.822-.546 1.164-.133.341-.28.543-.47.617-.19.074-.424.02-.703-.099-.28-.12-.604-.307-.874-.442-.269-.136-.484-.22-.62-.353-.136-.132-.195-.31-.203-.571-.01-.26.032-.6.05-.853.02-.25.018-.413-.038-.56a1.079 1.079 0 0 0-.232-.35c-.07-.07-.099-.075-.113-.058-.014.017-.012.058.01.158.023.1.067.26.05.581-.019.321-.098.803-.16 1.17-.062.366-.107.618-.02.808.087.191.306.322.707.54.4.22.982.527 1.518.855.537.327 1.027.673 1.562 1.089.534.415 1.112.9 1.5 1.238.39.339.588.532.742.59.154.059.264-.018.307-.138.044-.12.023-.285-.014-.429a1.174 1.174 0 0 0-.24-.46 4.92 4.92 0 0 0-.68-.704c-.287-.243-.614-.463-.803-.614-.19-.151-.242-.233-.212-.259.03-.026.14.004.302.108.162.103.375.28.612.459.237.178.499.356.733.584.235.228.443.506.583.706.14.201.214.324.294.372.08.049.165.022.277-.05a3.03 3.03 0 0 0 .426-.355c.178-.169.398-.393.551-.633.154-.24.242-.496.299-.772.056-.276.08-.572.247-.862.167-.29.476-.574.994-1.025.518-.451 1.244-1.07 1.891-1.664.648-.595 1.216-1.165 1.696-1.802.479-.638.87-1.342 1.067-1.743.199-.4.205-.498.14-.526-.063-.027-.198.015-.61.313-.414.297-1.106.849-1.886 1.43-.781.58-1.65 1.19-2.336 1.569-.686.378-1.19.524-1.55.562-.361.037-.58-.034-.724-.11-.143-.077-.21-.158-.224-.241-.013-.084.03-.17.135-.275.106-.106.277-.232.447-.392.17-.16.338-.354.468-.556.13-.202.22-.411.261-.592.042-.181.034-.333-.04-.376-.074-.043-.215.023-.376.11-.162.086-.343.192-.593.3a2.683 2.683 0 0 1-.92.235 1.626 1.626 0 0 1-1.088-.313c-.343-.26-.635-.71-.866-1.147-.23-.438-.398-.865-.512-1.12-.108-.242-.168-.33-.246-.33zm-2.215 4.075a.422.422 0 0 0-.294.115c-.094.086-.145.2-.034.338.112.137.385.297.636.469.252.172.481.357.666.42.184.064.323.006.402-.096.08-.102.1-.247-.003-.404-.103-.157-.327-.325-.564-.481-.238-.157-.488-.302-.681-.346a.574.574 0 0 0-.128-.015zm.252.208c.025 0 .053.003.083.01.118.026.272.115.418.211.145.096.283.2.333.289.05.089.014.163-.048.216a.255.255 0 0 1-.247.053c-.1-.031-.216-.126-.36-.219-.145-.093-.319-.184-.387-.268-.068-.084-.031-.162.029-.218a.26.26 0 0 1 .18-.074zm4.778 3.728c.211-.008.42.06.602.24.183.178.34.467.383.732.042.265-.03.505-.125.692a1.58 1.58 0 0 1-.289.397c-.074.074-.109.095-.14.095h-.003c-.033-.001-.062-.023-.208-.171a7.39 7.39 0 0 1-.573-.642c-.165-.22-.232-.383-.263-.568-.032-.185-.027-.39.082-.536.109-.146.323-.23.534-.239zm.093 1.111a.258.258 0 0 0-.153.046c-.058.041-.105.113-.093.185.012.073.085.146.174.255.089.11.195.255.264.335.068.08.1.093.127.091.029-.002.054-.018.086-.048a.349.349 0 0 0 .094-.157.518.518 0 0 0 .002-.316.668.668 0 0 0-.218-.282.476.476 0 0 0-.283-.109z\"/></g>"],["Grasshopper","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><text x=\"40\" y=\"50\" text-anchor=\"middle\" fill=\"var(--paper)\" stroke=\"none\" font-size=\"29\" font-weight=\"500\" letter-spacing=\"-2\">Gh</text>"],["SketchUp","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><g transform=\"translate(17 17) scale(1.916667)\" fill=\"var(--paper)\" stroke=\"none\"><path d=\"M.968 9.027l7.717 4.428-.006 1.32-4.39-2.518-2.763 1.57 7.148 4.12.005 1.27-7.658-4.405c.02.516.488 2.106 1.383 3.337.91 1.247 1.946 1.776 1.946 1.776L11.428 24V11.849L.975 5.846zm22.064-3.8L15.22.723S13.982 0 12.008 0C9.952 0 8.76.746 8.76.746l-7.236 4.14 11.009 6.328V24l7.245-4.136s1.295-.715 2.279-2.414c.867-1.496.975-2.943.975-2.943zM11.251 7.308s1.615-.298 2.98.49l2.171 1.25s.003 1.097.003 2.736c0 1.313-1.112 2.674-1.112 2.674l.002-4.816zm6.402 10.562l-2.358 1.353v-1.269l1.835-1.05c1.748-1.26 2.037-3.117 2.037-3.761l-.007-5.705-5.006-2.881s-.76-.499-2.129-.499c-1.367 0-2.113.461-2.113.461L8.154 5.53l-1.11-.641L9.473 3.5s.95-.527 2.544-.527c1.462 0 2.6.571 2.6.571L20.27 6.81l-.007 6.226c.04.957-.406 3.296-2.61 4.835z\"/></g>"],["Blender","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><g transform=\"translate(17 17) scale(1.916667)\" fill=\"var(--paper)\" stroke=\"none\"><path d=\"M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.028 2.005.045.823-.285 1.586-.865 2.153a3.389 3.389 0 0 1-2.374.938 3.393 3.393 0 0 1-2.376-.938c-.58-.567-.91-1.33-.865-2.152M7.35 14.831c.006.314.106.922.256 1.398a7.372 7.372 0 0 0 1.593 2.757 8.227 8.227 0 0 0 2.787 2.001 8.947 8.947 0 0 0 3.66.76 8.964 8.964 0 0 0 3.657-.772 8.285 8.285 0 0 0 2.785-2.01 7.428 7.428 0 0 0 1.592-2.762 6.964 6.964 0 0 0 .25-3.074 7.123 7.123 0 0 0-1.016-2.779 7.764 7.764 0 0 0-1.852-2.043h.002L13.566 2.55l-.02-.015c-.492-.378-1.319-.376-1.86.002-.547.382-.609 1.015-.123 1.415l-.001.001 3.126 2.543-9.53.01h-.013c-.788.001-1.545.518-1.695 1.172-.154.665.38 1.217 1.2 1.22V8.9l4.83-.01-8.62 6.617-.034.025c-.813.622-1.075 1.658-.563 2.313.52.667 1.625.668 2.447.004L7.414 14s-.069.52-.063.831zm12.09 1.741c-.97.988-2.326 1.548-3.795 1.55-1.47.004-2.827-.552-3.797-1.538a4.51 4.51 0 0 1-1.036-1.622 4.282 4.282 0 0 1 .282-3.519 4.702 4.702 0 0 1 1.153-1.371c.942-.768 2.141-1.183 3.396-1.185 1.256-.002 2.455.41 3.398 1.175.48.391.87.854 1.152 1.367a4.28 4.28 0 0 1 .522 1.706 4.236 4.236 0 0 1-.239 1.811 4.54 4.54 0 0 1-1.035 1.626\"/></g>"],["AutoCAD","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><g transform=\"translate(17 17) scale(1.916667)\" fill=\"var(--paper)\" stroke=\"none\"><path d=\"M3.8672 1.0527v.0157L0 3.3848v17.914l3.8965-2.332h18.3398V2.3301c0-.702-.5773-1.2774-1.2793-1.2774H3.8672zm7.5058 4.0098h3.3008l2.9844 9.9512h-2.5879l-.5683-2.1895h-2.9844l-.5703 2.1621h-2.416l2.8417-9.9238zm11.8633.0273v14.877H4.172l-2.0684 1.2383v.4648c0 .702.5793 1.2774 1.2813 1.2774H24V5.0898h-.7637zM12.9668 6.6816l-.9941 4.3243h2.0468l-1.0527-4.3243z\"/></g>"],["Enscape","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><text x=\"40\" y=\"50\" text-anchor=\"middle\" fill=\"var(--paper)\" stroke=\"none\" font-size=\"29\" font-weight=\"500\" letter-spacing=\"-2\">En</text>"],["D5 Render","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><text x=\"40\" y=\"50\" text-anchor=\"middle\" fill=\"var(--paper)\" stroke=\"none\" font-size=\"29\" font-weight=\"500\" letter-spacing=\"-2\">D5</text>"],["Unreal Engine 5","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><g transform=\"translate(17 17) scale(1.916667)\" fill=\"var(--paper)\" stroke=\"none\"><path d=\"M12 0a12 12 0 1012 12A12 12 0 0012 0zm0 23.52A11.52 11.52 0 1123.52 12 11.52 11.52 0 0112 23.52zm7.13-9.791c-.206.997-1.126 3.557-4.06 4.942l-1.179-1.325-1.988 2a7.338 7.338 0 01-5.804-2.978 2.859 2.859 0 00.65.123c.326.006.678-.114.678-.66v-5.394a.89.89 0 00-1.116-.89c-.92.212-1.656 2.509-1.656 2.509a7.304 7.304 0 012.528-5.597 7.408 7.408 0 013.73-1.721c-1.006.573-1.57 1.507-1.57 2.29 0 1.262.76 1.109.984.923v7.28a1.157 1.157 0 00.148.256 1.075 1.075 0 00.88.445c.76 0 1.747-.868 1.747-.868V9.172c0-.6-.452-1.324-.905-1.572 0 0 .838-.149 1.484.346a5.537 5.537 0 01.387-.425c1.508-1.48 2.929-1.902 4.112-2.112 0 0-2.151 1.69-2.151 3.96 0 1.687.043 5.801.043 5.801.799.771 1.986-.342 3.059-1.441Z\"/></g>"],["Figma","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><g transform=\"translate(17 17) scale(1.916667)\" fill=\"var(--paper)\" stroke=\"none\"><path d=\"M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z\"/></g>"],["Photoshop","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><g transform=\"translate(17 17) scale(1.916667)\" fill=\"var(--paper)\" stroke=\"none\"><path d=\"M9.85 8.42c-.37-.15-.77-.21-1.18-.2-.26 0-.49 0-.68.01-.2-.01-.34 0-.41.01v3.36c.14.01.27.02.39.02h.53c.39 0 .78-.06 1.15-.18.32-.09.6-.28.82-.53.21-.25.31-.59.31-1.03.01-.31-.07-.62-.23-.89-.17-.26-.41-.46-.7-.57zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.899c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-7.391 11.65c-.399.56-.959.98-1.609 1.22-.68.25-1.43.34-2.25.34-.24 0-.4 0-.5-.01s-.24-.01-.43-.01v3.209c.01.07-.04.131-.11.141H5.52c-.08 0-.12-.041-.12-.131V6.42c0-.07.03-.11.1-.11.17 0 .33 0 .56-.01.24-.01.49-.01.76-.02s.56-.01.87-.02c.31-.01.61-.01.91-.01.82 0 1.5.1 2.06.31.5.17.96.45 1.34.82.32.32.57.71.73 1.14.149.42.229.85.229 1.3.001.86-.199 1.57-.6 2.13zm7.091 3.89c-.28.4-.671.709-1.12.891-.49.209-1.09.318-1.811.318-.459 0-.91-.039-1.359-.129-.35-.061-.7-.17-1.02-.32-.07-.039-.121-.109-.111-.189v-1.74c0-.029.011-.07.041-.09.029-.02.06-.01.09.01.39.23.8.391 1.24.49.379.1.779.15 1.18.15.38 0 .65-.051.83-.141.16-.07.27-.24.27-.42 0-.141-.08-.27-.24-.4-.16-.129-.489-.279-.979-.471-.51-.18-.979-.42-1.42-.719-.31-.221-.569-.51-.761-.85-.159-.32-.239-.67-.229-1.021 0-.43.12-.84.341-1.21.25-.4.619-.72 1.049-.92.469-.239 1.059-.349 1.769-.349.41 0 .83.03 1.24.09.3.04.59.12.86.23.039.01.08.05.1.09.01.04.02.08.02.12v1.63c0 .04-.02.08-.05.1-.09.02-.14.02-.18 0-.3-.16-.62-.27-.96-.34-.37-.08-.74-.13-1.12-.13-.2-.01-.41.02-.601.07-.129.03-.24.1-.31.2-.05.08-.08.18-.08.27s.04.18.101.26c.09.11.209.2.34.27.229.12.47.23.709.33.541.18 1.061.43 1.541.73.33.209.6.49.789.83.16.318.24.67.23 1.029.011.471-.129.94-.389 1.331z\"/></g>"],["Illustrator","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><g transform=\"translate(17 17) scale(1.916667)\" fill=\"var(--paper)\" stroke=\"none\"><path d=\"M10.53 10.73c-.1-.31-.19-.61-.29-.92-.1-.31-.19-.6-.27-.89-.08-.28-.15-.54-.22-.78h-.02c-.09.43-.2.86-.34 1.29-.15.48-.3.98-.46 1.48-.14.51-.29.98-.44 1.4h2.54c-.06-.211-.14-.46-.23-.721-.09-.269-.18-.559-.27-.859zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zM14.7 16.83h-2.091c-.069.01-.139-.04-.159-.11l-.82-2.38H7.91l-.76 2.35c-.02.09-.1.15-.19.141H5.08c-.11 0-.14-.061-.11-.18L8.19 7.38c.03-.1.06-.21.1-.33.04-.21.06-.43.06-.65-.01-.05.03-.1.08-.11h2.59c.08 0 .12.03.13.08l3.65 10.3c.03.109 0 .16-.1.16zm3.4-.15c0 .11-.039.16-.129.16H16.01c-.1 0-.15-.061-.15-.16v-7.7c0-.1.041-.14.131-.14h1.98c.09 0 .129.05.129.14v7.7zm-.209-9.03c-.231.24-.571.37-.911.35-.33.01-.65-.12-.891-.35-.23-.25-.35-.58-.34-.92-.01-.34.12-.66.359-.89.242-.23.562-.35.892-.35.391 0 .689.12.91.35.22.24.34.56.33.89.01.34-.11.67-.349.92z\"/></g>"],["InDesign","<rect x=\"5\" y=\"5\" width=\"70\" height=\"70\" rx=\"12\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"9\" y=\"9\" width=\"62\" height=\"62\" rx=\"8\" fill=\"none\" stroke=\"var(--paper)\" stroke-width=\"1\" opacity=\".35\"/><g transform=\"translate(17 17) scale(1.916667)\" fill=\"var(--paper)\" stroke=\"none\"><path d=\"M4.25.3C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm11.31 5.13h2.03c.05-.01.09.03.1.07v9.54c0 .18.01.38.02.6.02.21.03.41.04.58 0 .07-.03.13-.1.16-.52.22-1.07.38-1.63.48-.5.09-1.02.14-1.54.14-.74.01-1.48-.14-2.15-.45-.63-.29-1.15-.77-1.51-1.36-.37-.61-.55-1.37-.55-2.28-.01-.74.18-1.47.55-2.11.38-.65.93-1.19 1.59-1.55.7-.39 1.54-.58 2.53-.58.05 0 .12 0 .21.01s.19.01.31.02V5.54c0-.07.03-.11.1-.11zm-8.93.86h1.95c.06-.01.12.03.13.1.01.01.01.02.01.03v10.26c0 .11-.05.16-.14.16H6.62c-.09 0-.13-.05-.13-.16V6.42c0-.09.05-.13.14-.13zm8.23 4.24c-.39 0-.78.08-1.13.26-.34.17-.63.42-.85.74-.22.32-.33.75-.33 1.27-.01.35.05.7.17 1.03.1.27.25.51.45.71.19.18.42.32.68.4.27.09.55.13.83.13.15 0 .29-.01.42-.02.13.01.25-.01.36-.05v-4.4c-.09-.02-.18-.04-.27-.05-.11-.01-.22-.02-.33-.02z\"/></g>"]];

export function initFooterPlayground() {
  const stage = document.querySelector('.footer-playground');
  if (!stage) return;
  const collection=stage.dataset.pile==='software'?softwareMotifs:motifs;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let width = 0,
    height = 0,
    items = [],
    frame = 0,
    previous = 0,
    awake = 0,
    visible = false,
    held = null;
  let cursor = null;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  function render() {
    for (const p of items)
      p.el.style.transform = `translate3d(${p.x - p.r}px,${p.y - p.r}px,0) rotate(${p.angle}rad)`;
  }
  function step(dt) {
    for (const p of items) {
      if (p === held) continue;
      p.vy += 0.24 * dt;
      p.vx *= Math.pow(0.994, dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.angle += p.spin * dt;
      p.spin *= 0.99;
      if (p.x < p.r || p.x > width - p.r) {
        p.x = clamp(p.x, p.r, width - p.r);
        p.vx *= -0.5;
      }
      if (p.y > height - p.r) {
        p.y = height - p.r;
        p.vy = Math.abs(p.vy) < 0.7 ? 0 : -p.vy * 0.28;
        p.vx *= 0.88;
        p.spin *= 0.8;
      }
      if (p.y < p.r) {
        p.y = p.r;
        p.vy = Math.abs(p.vy);
      }
    }
    for (let pass = 0; pass < 3; pass++)
      for (let i = 0; i < items.length; i++)
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i],
            b = items[j],
            dx = b.x - a.x,
            dy = b.y - a.y,
            d = Math.hypot(dx, dy) || 0.01,
            min = (a.r + b.r) * 0.89;
          if (d >= min) continue;
          const nx = dx / d,
            ny = dy / d,
            overlap = min - d,
            am = a === held ? 0 : b === held ? 1 : 0.5,
            bm = b === held ? 0 : a === held ? 1 : 0.5;
          a.x -= nx * overlap * am;
          a.y -= ny * overlap * am;
          b.x += nx * overlap * bm;
          b.y += ny * overlap * bm;
          const speed = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (speed < 0) {
            const impulse = -speed * 0.65;
            if (a !== held) {
              a.vx -= impulse * nx;
              a.vy -= impulse * ny;
            }
            if (b !== held) {
              b.vx += impulse * nx;
              b.vy += impulse * ny;
            }
          }
        }
    for (const p of items) {
      p.x = clamp(p.x, p.r, width - p.r);
      p.y = clamp(p.y, p.r, height - p.r);
    }
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((now - (previous || now)) / 16.667, 1.5);
    previous = now;
    step(dt);
    render();
    if (held || now < awake) frame = requestAnimationFrame(tick);
  }
  function wake() {
    if (reduced.matches) return;
    awake = performance.now() + 6500;
    if (visible && !document.hidden && !frame) {
      previous = 0;
      frame = requestAnimationFrame(tick);
    }
  }
  function settle() {
    for (let i = 0; i < 450; i++) step(1);
    render();
  }
  function reset() {
    for (const [i, p] of items.entries()) {
      const diameter = clamp(width * 0.055, 38, 76),
        columns = Math.max(4, Math.floor(width / (diameter * 1.08))),
        column = i % columns,
        row = Math.floor(i / columns);
      p.x = ((column + 0.5) * width) / columns + (Math.random() - 0.5) * 8;
      p.y = height - p.r - row * diameter * 0.82;
      p.vx = (Math.random() - 0.5) * 3;
      p.vy = 0;
      p.angle = (Math.random() - 0.5) * 1.8;
      p.spin = (Math.random() - 0.5) * 0.02;
    }
    if (reduced.matches) settle();
    else {
      render();
      wake();
    }
  }
  function build() {
    const box = stage.getBoundingClientRect();
    if (!box.width) return;
    if (
      items.length &&
      Math.abs(box.width - width) < 1 &&
      Math.abs(box.height - height) < 1
    )
      return;
    cancelAnimationFrame(frame);
    frame = 0;
    held = null;
    stage.replaceChildren();
    items = [];
    width = box.width;
    height = box.height;
    const diameter = clamp(width * 0.055, 38, 76),
      columns = Math.max(4, Math.floor(width / (diameter * 1.08))),
      rows = width < 700 ? 4 : 5;
    const count = Math.min(300, columns * rows);
    items = Array.from({ length: count }, (_, i) => {
      const [name, art] = collection[(i * 11) % collection.length],
        el = document.createElement('button'),
        r = diameter * (0.45 + (i % 4) * 0.035);
      el.type = 'button';
      el.className = 'play-piece';
      el.tabIndex=i===0?0:-1;
      el.addEventListener('focus',()=>{for(const item of items)item.el.tabIndex=item.el===el?0:-1;});
      el.setAttribute('aria-label', `${name}, draggable piece ${i + 1}`);
      el.title=name;
      el.innerHTML = `<svg viewBox="0 0 80 80" aria-hidden="true">${art}</svg>`;
      el.style.width = el.style.height = r * 2 + 'px';
      stage.append(el);
      const p = { el, r, x: r, y: r, vx: 0, vy: 0, angle: 0, spin: 0 };
      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        held = p;
        p.vx = p.vy = 0;
        el.setPointerCapture(e.pointerId);
        el.classList.add('is-held');
        wake();
      });
      el.addEventListener('pointermove', (e) => {
        if (held !== p) return;
        const bounds = stage.getBoundingClientRect(),
          x = clamp(e.clientX - bounds.left, r, width - r),
          y = clamp(e.clientY - bounds.top, r, height - r);
        p.vx = clamp((x - p.x) * 0.5, -14, 14);
        p.vy = clamp((y - p.y) * 0.5, -14, 14);
        p.x = x;
        p.y = y;
        render();
        if (!reduced.matches) wake();
      });
      const release = () => {
        if (held !== p) return;
        held = null;
        el.classList.remove('is-held');
        if (reduced.matches) {
          p.vx = p.vy = 0;
          render();
        } else wake();
      };
      el.addEventListener('lostpointercapture', release);
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      el.addEventListener('keydown', (e) => {
        const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
        const direction=directions[e.key];
        if((direction&&!e.shiftKey)||e.key==='Home'||e.key==='End'){
          e.preventDefault();
          let target;
          if(e.key==='Home')target=0;else if(e.key==='End')target=items.length-1;
          else {const row=Math.max(1,Math.floor(width/(diameter*1.08)));const offset=direction[0]||direction[1]*row;target=(i+offset+items.length)%items.length;}
          items[target]?.el.focus({preventScroll:true});return;
        }
        if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!reduced.matches){p.vy=-9;p.vx=(i%2?1:-1)*4;p.spin=.04;wake();}return;}
        if(!direction)return;e.preventDefault();
        p.x=clamp(p.x+direction[0]*24,r,width-r);p.y=clamp(p.y+direction[1]*24,r,height-r);
        p.vx=direction[0]*4;p.vy=direction[1]*4;render();if(!reduced.matches)wake();
      });
      return p;
    });
    reset();
  }
  stage.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch' || reduced.matches || held) return;
      const bounds = stage.getBoundingClientRect(),
        x = e.clientX - bounds.left,
        y = e.clientY - bounds.top;
      const speed = cursor
        ? Math.min(18, Math.hypot(x - cursor.x, y - cursor.y))
        : 3;
      cursor = { x, y };
      let touched = false;
      for (const p of items) {
        const dx = p.x - x,
          dy = p.y - y,
          d = Math.hypot(dx, dy),
          reach = p.r + 65;
        if (d >= reach) continue;
        const force = (1 - d / reach) * (1 + speed * 0.55),
          nx = dx / Math.max(d, 1);
        p.vx = clamp(p.vx + nx * force * 1.6, -15, 15);
        p.vy = clamp(p.vy - force * 1.8, -13, 10);
        p.spin = clamp(p.spin + nx * force * 0.007, -0.09, 0.09);
        touched = true;
      }
      if (touched) wake();
    },
    { passive: true }
  );
  stage.addEventListener('pointerleave', () => {
    cursor = null;
  });
  new ResizeObserver(build).observe(stage);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !reduced.matches) wake();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: '100px' }
  ).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (!reduced.matches) wake();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      settle();
    } else wake();
  });
  build();
}
