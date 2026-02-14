import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Prompt escondido do usuário.
 * Esse prompt instrui a IA a gerar um resultado realista de provador virtual.
 * Você pode editar este texto para melhorar os resultados sem que o usuário veja.
 */
const SYSTEM_PROMPT = `You are an expert virtual fitting room AI specializing in photorealistic fashion try-on imagery.

You will receive exactly TWO images:
- IMAGE 1: A product photo of a clothing item or accessory (e.g. shirt, dress, jacket, hat, sunglasses, shoes, bag, etc.)
- IMAGE 2: A photo of a PERSON

YOUR TASK: Generate a single, highly photorealistic image showing the PERSON from IMAGE 2 naturally wearing/using the PRODUCT from IMAGE 1.

STRICT RULES:
1. PRESERVE THE PERSON EXACTLY: same face, skin tone, hair color, hair style, body shape, and proportions. The person must be immediately recognizable.
2. FIT THE PRODUCT NATURALLY: the clothing/accessory must look like it was actually worn in a real photo — proper draping, folding, stretching based on body shape.
3. REALISTIC LIGHTING & SHADOWS: match the lighting direction and intensity from the person's original photo. Add natural shadows where the product meets the body.
4. PROPER PROPORTIONS: the product must be correctly sized relative to the person's body.
5. KEEP THE BACKGROUND: use a clean, neutral background similar to the person's photo or a professional studio setting.
6. PHOTOGRAPHIC QUALITY: the result should look like a professional fashion photograph — sharp focus, natural colors, no artifacts, no distortion.
7. If the product is an accessory (hat, glasses, watch, bag, etc.), show the person wearing/holding it in a natural pose.
8. Do NOT add any text, watermarks, logos, or labels to the image.
9. Do NOT split the image or show before/after — generate ONLY the final result as a single image.`;

export async function POST(request: NextRequest) {
	try {
		const { productImage, userPhoto } = await request.json();

		if (!productImage || !userPhoto) {
			return NextResponse.json(
				{ error: "Ambas as imagens são obrigatórias." },
				{ status: 400 }
			);
		}

		if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-sua-chave-aqui") {
			return NextResponse.json(
				{ error: "Chave da API OpenAI não configurada. Edite o arquivo .env.local." },
				{ status: 500 }
			);
		}

		const response = await openai.responses.create({
			model: "gpt-4o",
			input: [
				{
					role: "developer",
					content: SYSTEM_PROMPT,
				},
				{
					role: "user",
					content: [
						{
							type: "input_image",
							image_url: userPhoto,
						},
						{
							type: "input_image",
							image_url: productImage,
						},
						{
							type: "input_text",
							text: "Generate a photorealistic image of this person wearing the clothing/accessory from the product photo. Single final result only.",
						},
					],
				},
			],
			tools: [
				{
					type: "image_generation",
					quality: "high",
					input_fidelity: "high",
				},
			],
		});

		const imageOutput = response.output.find(
			(item: { type: string }) => item.type === "image_generation_call"
		);

		if (
			!imageOutput ||
			imageOutput.type !== "image_generation_call" ||
			!("result" in imageOutput) ||
			!imageOutput.result
		) {
			return NextResponse.json(
				{ error: "A IA não conseguiu gerar a imagem. Tente novamente." },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			image: `data:image/png;base64,${imageOutput.result}`,
		});
	} catch (error: unknown) {
		console.error("Erro na geração:", error);

		const message =
			error instanceof Error ? error.message : "Erro interno do servidor";

		// Erros comuns da OpenAI
		if (message.includes("quota") || message.includes("rate")) {
			return NextResponse.json(
				{ error: "Limite de uso da API atingido. Tente novamente mais tarde." },
				{ status: 429 }
			);
		}

		if (message.includes("invalid_api_key") || message.includes("Incorrect API key")) {
			return NextResponse.json(
				{ error: "Chave da API OpenAI inválida. Verifique o arquivo .env.local." },
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{ error: message },
			{ status: 500 }
		);
	}
}
