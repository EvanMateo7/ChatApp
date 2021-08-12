import https from "https";
import imageType from "image-type";


const allowedImageMIMETypes = [
  "image/jpeg",
  "image/png",
];


export function isValidImageURL(url: string) {
  return new Promise<boolean>((resolve) => {
    try {
      const options = new URL(url);

      const request = https.get(options, response => {
        let data: Buffer;

        response.on('readable', () => {
          let chunk;
          while (null !== (chunk = response.read(imageType.minimumBytes))) {
            data = chunk;
            response.destroy();
          }
        });

        response.on("close", () => {
          try {
            console.log(`Image is type ${imageType(data)?.mime} ${url}`)
            resolve(allowedImageMIMETypes.includes(imageType(data)?.mime ?? ''));
          }
          catch (e) {
            resolve(false);
          }
        });

      });

      // Used to catch getaddrinfo() error i.e. DNS error or invalid URL
      request.on("error", () => {
        resolve(false);
      });
    }
    catch (e) {
      resolve(false);
    }
  });
}
