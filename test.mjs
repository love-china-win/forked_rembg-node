import { Rembg } from "./dist/index.js";
import sharp from "sharp";

(async () => {

	const imagePath = 'D:\\4_WF406310.jpg'
	// const input = sharp("test-input.jpg");

	const input = sharp(imagePath);


	// optional arguments
	const rembg = new Rembg({
		logging: true,
	});

	const { width, height } = await input.metadata();


	const output = await rembg.remove(input);

	const inputPixels = await input
                .clone()
                .ensureAlpha()
                .raw({})
                .toBuffer();


	const finalPixels = await output
                .clone()
                .ensureAlpha()
                .raw({})
                .toBuffer();

	for (let i = 0; i < finalPixels.length / 4; i++) {
		let alpha = finalPixels[i * 4 + 3];
		// if (alpha < foregroundThreshold) alpha = 0;
		// let alpha = trimap[i];
		// console.log(alpha);
		if(alpha !== 0){
			inputPixels[i * 4 + 3] = 0;
		}		
	}

	console.log(`width: ${width} ,height: ${height}`)

	const output2 = sharp(inputPixels,{raw: { channels: 4, width:width, height:height }})

	await output2.webp().toFile("test-input-00.webp")

	await output.webp().toFile("test-output.webp");

	// optionally you can use .trim() too!
	await output.trim().webp().toFile("test-output-trimmed.webp");
})();
