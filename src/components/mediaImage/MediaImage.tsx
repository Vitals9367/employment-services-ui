import getConfig from "next/config";
import Image from "next/image";

interface MediaImageProps {
  media: any | string
}

export default function MediaImage({media} :MediaImageProps) :JSX.Element {

  if (typeof media === "object") {
    const host = getConfig().publicRuntimeConfig.NEXT_IMAGE_DOMAIN
    const url = `https://${host}/${media.field_media_image.uri.url}`
    const meta = media.field_media_image.resourceIdObjMeta

    return (<Image src={url} alt={meta.alt} layout="responsive" width={meta.width} height={meta.height}/>)
  }

  return (
    <img src={media} alt="" />
  )
}