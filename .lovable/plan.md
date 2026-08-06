# Plan - Fix images in Peripheral Venous Puncture Guide

The user is reporting that the "Peripheral Venous Puncture" (Punção Venosa Periférica) guide is not showing images, appearing as just a large text block.

## Analysis
- `src/data/procedimentos/puncao-adulto.ts` correctly defines the scenes with images (e.g., `pvaGarroteando.url`).
- `src/routes/procedimentos-enfermagem.tsx` is the route that renders the content.
- The route uses `ProcedimentoPlayer` if `proc.cenas.length > 0`.
- I noticed that some other procedures like `puncao-seguranca`, `puncao-pediatria`, and `puncao-jugular-externa` have `emProducao: true` and **empty `cenas: []`**, which would explain the lack of images in those specific sub-types.
- However, the user specifically mentioned "punção" (usually referring to the main adult one).
- There might be a logic error in `src/routes/procedimentos-enfermagem.tsx` or a visibility issue.
- Looking at `src/routes/procedimentos-enfermagem.tsx`, there are two `puncao` related sub-panels: `ProcedimentoPlayer` (for animation steps) and `FlebitePanel`.
- The user said: "não tem nenhuma imagem e está a mesma coisa. faça uma analise criteriosa".
- One possibility: the user is clicking on one of the "Em breve" (Coming soon) variants like "Punção Venosa e Flebite (Disp. Segurança)" which has no images yet.
- Another possibility: the images are failing to load because of the PWA cache or preloading logic I added in previous turns.

## Proposed Changes

### 1. Branding / Text Edit
- Update `src/components/ui/select.tsx` as requested to reflect the user's frustration and request for analysis.

### 2. Analysis and Fixes for the Puncture Guide
- Ensure that `PROCEDIMENTOS` are correctly identified.
- I will check if the user is seeing the "fallback" card because they are accidentally in a "Coming soon" procedure.
- I will improve the `ProcedimentoLista` to make it clearer which one has the "real" photos.
- I will verify if the `ProcedimentoPlayer` is actually rendering the images correctly by adding some logging or refining the image loading logic.
- I will check the `FlebitePanel` as well to ensure it's not the one causing the "text block" feeling.

### 3. Verification
- Verify image visibility in the browser.
- Check if the `AppAccessGate` is blocking the view for some reason (though it usually shows a lock).

## Implementation Plan

1. **Update Select Text**: Apply the requested visual text edit in `src/components/ui/select.tsx`.
2. **Audit Data**: Ensure `puncao-adulto.ts` is the one being used and that its assets are valid.
3. **Refine UI**: If certain puncture types are "in production", clearly mark them in the detail view so the user doesn't think it's a bug.
4. **Fix Layout**: Ensure `ProcedimentoPlayer` is not being hidden by CSS or conditional logic.

I have analyzed the data and found that while the main "Punção Venosa Adulto" has images, other variants (Safety Device, Pediatric, Jugular) are currently marked as "In Production" with no images. I will now create the detailed plan.
