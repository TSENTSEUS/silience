const UrlConfigLocalhost = {
  // sceneGltf: 'gltf-v5/Silience_GLTF.gltf',
  sceneGltf: 'Silience_GLTF_opto.glb',
  environmentHDRI: 'empty_warehouse_01_1k.hdr.txt',
  tvIframe: 'https://player.vimeo.com/video/1084537?h=b1b3ab5aa2&autoplay=1',
  contactLink: 'contact.html', // 404
  pressLink: 'press.html', // 404
  backButton: 'back.png',
  pressImage: 'press.jpg',
  contactImage: 'contact.jpg'
}

const UrlConfigWebflow: typeof UrlConfigLocalhost = {
  sceneGltf: 'https://uploads-ssl.webflow.com/633e0b3e00d74e5129885422/63eec3fc887b5fdfd7c81c27_Silience_GLTF.glb.txt',
  environmentHDRI: 'https://uploads-ssl.webflow.com/633e0b3e00d74e5129885422/63e7fbe663db55ec130f4ad8_empty_warehouse_01_1k.hdr.txt',
  contactLink: 'https://siliencefilms.com/contact',
  pressLink: 'https://siliencefilms.com/siliencepress',

  backButton: 'https://uploads-ssl.webflow.com/633e0b3e00d74e5129885422/63e7fbe91eb4ad8c20da8f6b_back2.png',
  tvIframe: 'https://player.vimeo.com/video/1084537?h=b1b3ab5aa2&autoplay=1',
  pressImage: 'https://uploads-ssl.webflow.com/633e0b3e00d74e5129885422/63eec3ffb7dbe80f24b0e1bb_press.jpg',
  contactImage: 'https://uploads-ssl.webflow.com/633e0b3e00d74e5129885422/63eec3ff03dc18dd5f37c80d_contact.jpg'
}

// use this to set the URL config manually through the index.html in webflow
// @ts-ignore

const UrlConfig = (window as any).URLConfig as typeof UrlConfigLocalhost || UrlConfigWebflow
// const UrlConfig = UrlConfigLocalhost
export default UrlConfig
