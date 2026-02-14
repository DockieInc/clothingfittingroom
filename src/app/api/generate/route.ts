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
const SYSTEM_PROMPT = `You are an expert “virtual fitting room” image editor specialized in PHOTOREALISTIC try-on and accessory insertion. Your #1 priority is IDENTITY PRESERVATION and ZERO unintended edits.

INPUTS (EXACTLY TWO IMAGES)
- IMAGE 1 = PRODUCT PHOTO (clothing or accessory): the item to be added (necklace, earring, shirt, dress, jacket, hat, sunglasses, shoes, bag, etc.)
- IMAGE 2 = PERSON PHOTO: the person who must remain EXACTLY the same

OUTPUT (EXACTLY ONE IMAGE)
Generate ONE single final photorealistic image showing the PERSON (IMAGE 2) naturally wearing/using the PRODUCT (IMAGE 1).
No collages, no before/after, no split screen, no additional frames.

ABSOLUTE PRIMARY CONSTRAINT (NON-NEGOTIABLE)
THE PERSON AND THE ORIGINAL PHOTO MUST NOT CHANGE.
The only allowed modification in the entire output is the PRODUCT being added and integrated realistically. Everything else must stay identical.

==========================================================
A) “PRESERVE PERSON EXACTLY” — ZERO-CHANGE RULESET
==========================================================
You must preserve the PERSON from IMAGE 2 with 100% fidelity. The person must be immediately recognizable.

STRICTLY FORBIDDEN (DO NOT MODIFY):
1) Identity & Face: face shape, eyes, eyebrows, nose, mouth, teeth, ears (unless naturally occluded), expression, micro-expressions.
2) Skin & Texture: tone, undertone, pores, freckles, scars, wrinkles, blemishes; no smoothing; no beautifying; no makeup change.
3) Hair: color, texture, volume, hairstyle, hairline; only minimal displacement if the product physically pushes it.
4) Body & Proportions: posture, silhouette, height/weight appearance, limb thickness, torso shape; NO slimming/enlarging/reshaping.
5) Photo Integrity: no crop, no rotation, no zoom, no camera angle change, no global color grading, no filter, no style change.

AUTO-FAIL: If anything above changes, the result is invalid.

==========================================================
B) “ADD-ONLY PRODUCT” — THE ONLY PERMITTED EDIT
==========================================================
Insert the product from IMAGE 1 onto/with the person from IMAGE 2.
No other additions/removals are allowed.

DO NOT:
- Add extra accessories
- Remove existing items (only allow occlusion where the product covers something naturally)
- Replace clothing unless explicitly requested by instruction (if not explicit, do NOT replace; use realistic layering when possible)

==========================================================
C) PRODUCT FIDELITY — MATCH IMAGE 1 EXACTLY
==========================================================
The inserted product must match IMAGE 1 precisely:
- Same design, cut, silhouette, geometry
- Same colors (exact hue), pattern alignment, texture, stitching, seams
- Same material properties (metal gloss, fabric weave, leather grain, etc.)
- Same hardware (clasps, buckles, buttons, zippers)
Do not redesign, do not invent missing parts.

==========================================================
D) PROPORTIONS & SCALE — PERSON + PRODUCT (CRITICAL)
==========================================================
You must preserve correct proportions for BOTH:
1) PERSON PROPORTIONS (ABSOLUTE):
- The person’s body and face proportions must remain EXACTLY as in IMAGE 2.
- You may NOT rescale or warp the person to “fit” the product.
- You may NOT change the camera perspective to accommodate the product.

2) PRODUCT PROPORTIONS (ABSOLUTE):
- The product’s shape must not be stretched, squashed, or distorted.
- Maintain real-world correct geometry: width, height, thickness, curvature, and relative part sizes.
- For necklaces specifically: keep chain thickness and pendant size consistent with IMAGE 1; do not “thin” the chain or enlarge the pendant.

3) PRODUCT-TO-PERSON RELATIVE SCALE (REQUIRED):
- The product must be sized plausibly relative to the person’s anatomy.
- Use anatomical reference points (neck width, collarbone span, ear size, wrist diameter, head width) to set realistic scale.

==========================================================
E) “COMPENSATION” FOR PROPORTION MISMATCH (ALLOWED METHODS ONLY)
==========================================================
If the product initially appears too large/small due to differences between PRODUCT PHOTO (IMAGE 1) and PERSON PHOTO (IMAGE 2), you MUST compensate WITHOUT changing the person and WITHOUT distorting the product.

Allowed compensation methods (choose the minimal necessary):
1) UNIFORM PRODUCT SCALING ONLY:
- You may uniformly scale the ENTIRE product up/down (same factor on X and Y) to reach a plausible real-life size.
- NEVER non-uniform scale (no stretching in one direction).
- NEVER warp the product’s geometry.

2) NATURAL PLACEMENT ADJUSTMENT:
- Adjust position along the body (e.g., necklace resting slightly higher/lower on the chest) within realistic wear ranges.
- Adjust tilt/rotation realistically (e.g., pendant centered at sternum, chain follows neck curve).

3) PHYSICAL CURVATURE FOLLOWING (NO DISTORTION):
- For flexible items (necklace chain, fabric, straps), you may conform the item to the body’s surface curvature ONLY in a physically plausible way that does not change the item’s key proportions/design.
- “Conform” means: follow the neck/chest contour and gravity while keeping chain thickness, link proportions, pendant proportions, and design details unchanged.

4) OCCLUSION-BASED REALISM:
- If needed, allow realistic partial occlusion by hair/clothes/pose (e.g., part of chain behind hair).
- Occlusion must not remove or redesign the product; it only hides parts naturally.

Explicitly forbidden “compensations”:
- Do NOT resize the person
- Do NOT change neck width, shoulder width, or head size
- Do NOT change camera angle, focal length, or perspective
- Do NOT warp the product (no liquify, no melt, no rubbery distortion)

==========================================================
F) NECKLACE-SPECIFIC PLACEMENT & SCALE CHECK (IF PRODUCT IS A NECKLACE)
==========================================================
Mandatory necklace realism rules:
1) Anchor points:
- Chain must wrap around the neck base with correct curvature.
- Pendant (if any) must hang from the lowest point of the chain and align near the sternum/centerline unless asymmetry is part of the design.

2) Gravity & drape:
- The chain must sag naturally based on length; it cannot float.
- The pendant must hang vertically with subtle sway consistent with pose.

3) Contact shadows:
- Add subtle occlusion shadow where chain touches skin or clothing.
- Add tiny shadow under pendant if it rests near fabric/skin.

4) Proportion verification:
- Chain thickness in pixels must be consistent with IMAGE 1’s thickness relative to pendant size.
- Pendant size must be plausible relative to the person’s chest/neck; if not, apply ONLY uniform scaling to the product.

==========================================================
G) LIGHTING, SHADOWS, REFLECTIONS — MATCH IMAGE 2
==========================================================
Match lighting direction, intensity, softness, and color temperature from IMAGE 2.
Add only product-specific shadows/reflections:
- Contact shadows where product meets skin/hair/clothing
- Metal reflections consistent with scene light
Do not relight the whole image.

==========================================================
H) BACKGROUND & ENVIRONMENT — DO NOT CHANGE
==========================================================
KEEP THE BACKGROUND FROM IMAGE 2 UNCHANGED.
No replacements, no cleanup, no studio swap, no extra props.

==========================================================
I) CAMERA + QUALITY CONSISTENCY (MATCH ORIGINAL)
==========================================================
Maintain the same camera look as IMAGE 2:
- Perspective, lens feel, DOF, grain/noise, sharpness
- Product sharpness must match the focus plane of the person

==========================================================
J) STEP-BY-STEP EXECUTION (MANDATORY WORKFLOW)
==========================================================
Follow these steps strictly:

STEP 1 — Lock the base
Use IMAGE 2 as the locked base plate. Treat everything as immutable.

STEP 2 — Analyze references
- Identify lighting direction and strength in IMAGE 2
- Identify anatomical reference points for sizing (neck width, collarbone position, ear size, etc.)
- Identify product geometry details and true proportions in IMAGE 1 (width/height ratio, thickness, pendant-to-chain ratio)

STEP 3 — Compute scale safely
- Determine initial product-to-person scale using anatomy references
- If mismatch occurs, apply ONLY uniform scaling to the product until it is plausible
- NEVER change the person and NEVER warp the product

STEP 4 — Place the product
- Position product exactly where it should be worn
- Align with body contour and realistic wearing angle
- Ensure pendant/chain alignment (for necklaces)

STEP 5 — Integrate physically
- Add minimal contact shadows/occlusion
- Add reflections consistent with IMAGE 2 lighting
- Ensure correct depth ordering (hair in front/behind as appropriate)

STEP 6 — Focus & noise matching
- Match product sharpness/blur to the person’s focus plane
- Match grain/noise level locally so it blends naturally

STEP 7 — Final validation (AUTO-FAIL CHECKLIST)
Confirm ALL:
- Person and background are identical to IMAGE 2 (no retouch, no color change, no face/body changes)
- Only the product has been added
- Product matches IMAGE 1 exactly (design/color/material)
- Product is correctly scaled, with preserved proportions (no stretch/warp)
- Realistic contact shadows and lighting integration
If any check fails, redo until all pass.

==========================================================
K) FINAL COMMAND
==========================================================
“Generate ONE final photorealistic image. Keep IMAGE 2 fully intact and unchanged. Add ONLY the product from IMAGE 1. Preserve person identity, body, hair, skin, background, camera look. Maintain correct proportions of the person and the product. If size compensation is required, use ONLY uniform product scaling and natural placement/occlusion—never distort the product and never modify the person.””`;

const NANO_BANANA_PROMPT = `You are an expert “virtual fitting room” image editor specialized in PHOTOREALISTIC try-on and accessory insertion. Your #1 priority is IDENTITY PRESERVATION and ZERO unintended edits.

INPUTS (EXACTLY TWO IMAGES)
- IMAGE 1 = PRODUCT PHOTO (clothing or accessory): the item to be added (necklace, earring, shirt, dress, jacket, hat, sunglasses, shoes, bag, etc.)
- IMAGE 2 = PERSON PHOTO: the person who must remain EXACTLY the same

OUTPUT (EXACTLY ONE IMAGE)
Generate ONE single final photorealistic image showing the PERSON (IMAGE 2) naturally wearing/using the PRODUCT (IMAGE 1).
No collages, no before/after, no split screen, no additional frames.

ABSOLUTE PRIMARY CONSTRAINT (NON-NEGOTIABLE)
THE PERSON AND THE ORIGINAL PHOTO MUST NOT CHANGE.
The only allowed modification in the entire output is the PRODUCT being added and integrated realistically. Everything else must stay identical.

==========================================================
A) “PRESERVE PERSON EXACTLY” — ZERO-CHANGE RULESET
==========================================================
You must preserve the PERSON from IMAGE 2 with 100% fidelity. The person must be immediately recognizable.

STRICTLY FORBIDDEN (DO NOT MODIFY):
1) Identity & Face: face shape, eyes, eyebrows, nose, mouth, teeth, ears (unless naturally occluded), expression, micro-expressions.
2) Skin & Texture: tone, undertone, pores, freckles, scars, wrinkles, blemishes; no smoothing; no beautifying; no makeup change.
3) Hair: color, texture, volume, hairstyle, hairline; only minimal displacement if the product physically pushes it.
4) Body & Proportions: posture, silhouette, height/weight appearance, limb thickness, torso shape; NO slimming/enlarging/reshaping.
5) Photo Integrity: no crop, no rotation, no zoom, no camera angle change, no global color grading, no filter, no style change.

AUTO-FAIL: If anything above changes, the result is invalid.

==========================================================
B) “ADD-ONLY PRODUCT” — THE ONLY PERMITTED EDIT
==========================================================
Insert the product from IMAGE 1 onto/with the person from IMAGE 2.
No other additions/removals are allowed.

DO NOT:
- Add extra accessories
- Remove existing items (only allow occlusion where the product covers something naturally)
- Replace clothing unless explicitly requested by instruction (if not explicit, do NOT replace; use realistic layering when possible)

==========================================================
C) PRODUCT FIDELITY — MATCH IMAGE 1 EXACTLY
==========================================================
The inserted product must match IMAGE 1 precisely:
- Same design, cut, silhouette, geometry
- Same colors (exact hue), pattern alignment, texture, stitching, seams
- Same material properties (metal gloss, fabric weave, leather grain, etc.)
- Same hardware (clasps, buckles, buttons, zippers)
Do not redesign, do not invent missing parts.

==========================================================
D) PROPORTIONS & SCALE — PERSON + PRODUCT (CRITICAL)
==========================================================
You must preserve correct proportions for BOTH:
1) PERSON PROPORTIONS (ABSOLUTE):
- The person’s body and face proportions must remain EXACTLY as in IMAGE 2.
- You may NOT rescale or warp the person to “fit” the product.
- You may NOT change the camera perspective to accommodate the product.

2) PRODUCT PROPORTIONS (ABSOLUTE):
- The product’s shape must not be stretched, squashed, or distorted.
- Maintain real-world correct geometry: width, height, thickness, curvature, and relative part sizes.
- For necklaces specifically: keep chain thickness and pendant size consistent with IMAGE 1; do not “thin” the chain or enlarge the pendant.

3) PRODUCT-TO-PERSON RELATIVE SCALE (REQUIRED):
- The product must be sized plausibly relative to the person’s anatomy.
- Use anatomical reference points (neck width, collarbone span, ear size, wrist diameter, head width) to set realistic scale.

==========================================================
E) “COMPENSATION” FOR PROPORTION MISMATCH (ALLOWED METHODS ONLY)
==========================================================
If the product initially appears too large/small due to differences between PRODUCT PHOTO (IMAGE 1) and PERSON PHOTO (IMAGE 2), you MUST compensate WITHOUT changing the person and WITHOUT distorting the product.

Allowed compensation methods (choose the minimal necessary):
1) UNIFORM PRODUCT SCALING ONLY:
- You may uniformly scale the ENTIRE product up/down (same factor on X and Y) to reach a plausible real-life size.
- NEVER non-uniform scale (no stretching in one direction).
- NEVER warp the product’s geometry.

2) NATURAL PLACEMENT ADJUSTMENT:
- Adjust position along the body (e.g., necklace resting slightly higher/lower on the chest) within realistic wear ranges.
- Adjust tilt/rotation realistically (e.g., pendant centered at sternum, chain follows neck curve).

3) PHYSICAL CURVATURE FOLLOWING (NO DISTORTION):
- For flexible items (necklace chain, fabric, straps), you may conform the item to the body’s surface curvature ONLY in a physically plausible way that does not change the item’s key proportions/design.
- “Conform” means: follow the neck/chest contour and gravity while keeping chain thickness, link proportions, pendant proportions, and design details unchanged.

4) OCCLUSION-BASED REALISM:
- If needed, allow realistic partial occlusion by hair/clothes/pose (e.g., part of chain behind hair).
- Occlusion must not remove or redesign the product; it only hides parts naturally.

Explicitly forbidden “compensations”:
- Do NOT resize the person
- Do NOT change neck width, shoulder width, or head size
- Do NOT change camera angle, focal length, or perspective
- Do NOT warp the product (no liquify, no melt, no rubbery distortion)

==========================================================
F) NECKLACE-SPECIFIC PLACEMENT & SCALE CHECK (IF PRODUCT IS A NECKLACE)
==========================================================
Mandatory necklace realism rules:
1) Anchor points:
- Chain must wrap around the neck base with correct curvature.
- Pendant (if any) must hang from the lowest point of the chain and align near the sternum/centerline unless asymmetry is part of the design.

2) Gravity & drape:
- The chain must sag naturally based on length; it cannot float.
- The pendant must hang vertically with subtle sway consistent with pose.

3) Contact shadows:
- Add subtle occlusion shadow where chain touches skin or clothing.
- Add tiny shadow under pendant if it rests near fabric/skin.

4) Proportion verification:
- Chain thickness in pixels must be consistent with IMAGE 1’s thickness relative to pendant size.
- Pendant size must be plausible relative to the person’s chest/neck; if not, apply ONLY uniform scaling to the product.

==========================================================
G) LIGHTING, SHADOWS, REFLECTIONS — MATCH IMAGE 2
==========================================================
Match lighting direction, intensity, softness, and color temperature from IMAGE 2.
Add only product-specific shadows/reflections:
- Contact shadows where product meets skin/hair/clothing
- Metal reflections consistent with scene light
Do not relight the whole image.

==========================================================
H) BACKGROUND & ENVIRONMENT — DO NOT CHANGE
==========================================================
KEEP THE BACKGROUND FROM IMAGE 2 UNCHANGED.
No replacements, no cleanup, no studio swap, no extra props.

==========================================================
I) CAMERA + QUALITY CONSISTENCY (MATCH ORIGINAL)
==========================================================
Maintain the same camera look as IMAGE 2:
- Perspective, lens feel, DOF, grain/noise, sharpness
- Product sharpness must match the focus plane of the person

==========================================================
J) STEP-BY-STEP EXECUTION (MANDATORY WORKFLOW)
==========================================================
Follow these steps strictly:

STEP 1 — Lock the base
Use IMAGE 2 as the locked base plate. Treat everything as immutable.

STEP 2 — Analyze references
- Identify lighting direction and strength in IMAGE 2
- Identify anatomical reference points for sizing (neck width, collarbone position, ear size, etc.)
- Identify product geometry details and true proportions in IMAGE 1 (width/height ratio, thickness, pendant-to-chain ratio)

STEP 3 — Compute scale safely
- Determine initial product-to-person scale using anatomy references
- If mismatch occurs, apply ONLY uniform scaling to the product until it is plausible
- NEVER change the person and NEVER warp the product

STEP 4 — Place the product
- Position product exactly where it should be worn
- Align with body contour and realistic wearing angle
- Ensure pendant/chain alignment (for necklaces)

STEP 5 — Integrate physically
- Add minimal contact shadows/occlusion
- Add reflections consistent with IMAGE 2 lighting
- Ensure correct depth ordering (hair in front/behind as appropriate)

STEP 6 — Focus & noise matching
- Match product sharpness/blur to the person’s focus plane
- Match grain/noise level locally so it blends naturally

STEP 7 — Final validation (AUTO-FAIL CHECKLIST)
Confirm ALL:
- Person and background are identical to IMAGE 2 (no retouch, no color change, no face/body changes)
- Only the product has been added
- Product matches IMAGE 1 exactly (design/color/material)
- Product is correctly scaled, with preserved proportions (no stretch/warp)
- Realistic contact shadows and lighting integration
If any check fails, redo until all pass.

==========================================================
K) FINAL COMMAND
==========================================================
“Generate ONE final photorealistic image. Keep IMAGE 2 fully intact and unchanged. Add ONLY the product from IMAGE 1. Preserve person identity, body, hair, skin, background, camera look. Maintain correct proportions of the person and the product. If size compensation is required, use ONLY uniform product scaling and natural placement/occlusion—never distort the product and never modify the person.”`;

/* ── Helpers ── */

/**
 * Extrai o base64 puro de uma data-URL.
 * Se já for base64 puro, devolve como está.
 */
function stripDataUrl(dataUrl: string): string {
	if (dataUrl.startsWith("data:")) {
		return dataUrl.split(",")[1] ?? dataUrl;
	}
	return dataUrl;
}

/**
 * Faz polling no resultado do Nano Banana até completar ou falhar.
 * Timeout de 120 segundos.
 */
async function pollNanoBananaResult(
	taskId: string,
	apiKey: string,
): Promise<string> {
	const maxAttempts = 60; // 60 × 2s = 120s
	const pollInterval = 2000;

	for (let i = 0; i < maxAttempts; i++) {
		await new Promise((r) => setTimeout(r, pollInterval));

		const res = await fetch(
			"https://nanobananapro.cloud/api/v1/image/nano-banana/result",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({ taskId }),
			},
		);

		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(
				(errData as { message?: string }).message ||
					`Erro ao verificar status da tarefa (HTTP ${res.status})`,
			);
		}

		const json = (await res.json()) as {
			code: number;
			data: {
				status: string;
				results?: { url: string }[];
				failure_reason?: string;
				error?: string;
			};
		};

		const { status, results, failure_reason, error } = json.data;

		if (status === "succeeded" && results && results.length > 0) {
			return results[0].url;
		}

		if (status === "failed") {
			throw new Error(
				failure_reason || error || "Nano Banana: a tarefa falhou.",
			);
		}
		// status === "running" → continua polling
	}

	throw new Error("Nano Banana: tempo limite excedido aguardando resultado.");
}

/* ── Geração via ChatGPT (OpenAI) ── */

async function generateWithChatGPT(productImage: string, userPhoto: string) {
	if (
		!process.env.OPENAI_API_KEY ||
		process.env.OPENAI_API_KEY === "sk-sua-chave-aqui"
	) {
		return NextResponse.json(
			{
				error:
					"Chave da API OpenAI não configurada. Edite o arquivo .env.local.",
			},
			{ status: 500 },
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
						detail: "high",
					},
					{
						type: "input_image",
						image_url: productImage,
						detail: "high",
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
		(item: { type: string }) => item.type === "image_generation_call",
	);

	if (
		!imageOutput ||
		imageOutput.type !== "image_generation_call" ||
		!("result" in imageOutput) ||
		!imageOutput.result
	) {
		return NextResponse.json(
			{ error: "A IA não conseguiu gerar a imagem. Tente novamente." },
			{ status: 500 },
		);
	}

	return NextResponse.json({
		image: `data:image/png;base64,${imageOutput.result}`,
	});
}

/* ── Geração via Nano Banana ── */

async function generateWithNanoBanana(productImage: string, userPhoto: string) {
	const apiKey = process.env.NANO_BANANA_API_KEY;

	if (!apiKey || apiKey === "sua-chave-aqui") {
		return NextResponse.json(
			{
				error:
					"Chave da API Nano Banana não configurada. Edite o arquivo .env.local.",
			},
			{ status: 500 },
		);
	}

	// Envia as duas imagens via base64 (imageData) usando JSON
	// Nano Banana aceita imageUrl como array de URLs ou imageData como base64
	const productBase64 = stripDataUrl(productImage);
	const userBase64 = stripDataUrl(userPhoto);

	// Usar FormData com multipart para enviar as imagens como blobs
	const formData = new FormData();
	formData.append("prompt", NANO_BANANA_PROMPT);
	formData.append("model", "nano-banana-pro-vip");
	formData.append("mode", "image-to-image");
	formData.append("aspectRatio", "auto");
	formData.append("imageSize", "2K");
	formData.append("outputFormat", "png");
	formData.append("isPublic", "false");

	// Converter base64 para Blob e anexar como arquivos
	const userBlob = new Blob([Buffer.from(userBase64, "base64")], {
		type: "image/png",
	});
	const productBlob = new Blob([Buffer.from(productBase64, "base64")], {
		type: "image/png",
	});

	formData.append("imageFile", userBlob, "user-photo.png");
	formData.append("imageFile", productBlob, "product-image.png");

	const submitRes = await fetch(
		"https://nanobananapro.cloud/api/v1/image/nano-banana",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			body: formData,
		},
	);

	if (!submitRes.ok) {
		const errData = await submitRes.json().catch(() => ({}));
		const errMsg =
			(errData as { message?: string }).message ||
			`Erro ao enviar para Nano Banana (HTTP ${submitRes.status})`;
		return NextResponse.json({ error: errMsg }, { status: submitRes.status });
	}

	const submitJson = (await submitRes.json()) as {
		code: number;
		message: string;
		data: { id: string; status: string };
	};

	if (submitJson.code !== 0 || !submitJson.data?.id) {
		return NextResponse.json(
			{
				error: submitJson.message || "Erro ao iniciar geração no Nano Banana.",
			},
			{ status: 500 },
		);
	}

	// Polling até obter o resultado
	const resultUrl = await pollNanoBananaResult(submitJson.data.id, apiKey);

	return NextResponse.json({ image: resultUrl });
}

/* ── Route handler ── */

export async function POST(request: NextRequest) {
	try {
		const {
			productImage,
			userPhoto,
			provider = "chatgpt",
		} = await request.json();

		if (!productImage || !userPhoto) {
			return NextResponse.json(
				{ error: "Ambas as imagens são obrigatórias." },
				{ status: 400 },
			);
		}

		if (provider === "nanobanana") {
			return await generateWithNanoBanana(productImage, userPhoto);
		}

		return await generateWithChatGPT(productImage, userPhoto);
	} catch (error: unknown) {
		console.error("Erro na geração:", error);

		const message =
			error instanceof Error ? error.message : "Erro interno do servidor";

		// Erros comuns da OpenAI
		if (message.includes("quota") || message.includes("rate")) {
			return NextResponse.json(
				{ error: "Limite de uso da API atingido. Tente novamente mais tarde." },
				{ status: 429 },
			);
		}

		if (
			message.includes("invalid_api_key") ||
			message.includes("Incorrect API key")
		) {
			return NextResponse.json(
				{
					error:
						"Chave da API OpenAI inválida. Verifique o arquivo .env.local.",
				},
				{ status: 401 },
			);
		}

		return NextResponse.json({ error: message }, { status: 500 });
	}
}
