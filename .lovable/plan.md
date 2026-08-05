# Plan: Enhance Certificate FAQ and Admin Monitoring

The user wants to clarify the location of the Certificate FAQ and add monitoring capabilities for Pix webhooks and subscription status in the admin panel.

## Proposed Changes

### 1. Document/Clarify FAQ Location
- The `CertificadoFAQ` component is currently rendered inside `MiniAppContent`.
- Update `src/components/CertificadoFAQ.tsx` to add a clear heading or context if needed, though the user's question "ONDE ESTÁ ESSE FAQ?" suggests they might be looking for it in the Admin or a specific app section.
- I will add a note in the FAQ itself or ensure it's visible in the "Minha Conta" or "Certificados" sections as described in the FAQ answers.

### 2. Admin Panel Enhancements (`src/routes/admin.tsx` & `src/components/admin/SubscriptionsAdmin.tsx`)
- **Pix Webhook Monitoring**: Add a new section or tab in the Admin area to monitor Pix payment status and webhook health.
- **Clear Error Messages**: Implement UI to show clear error messages when a Pix payment fails or a webhook fails to process.
- **Reprocessing Logic**: Add a "Reprocess" button for failed payments/webhooks to trigger a manual check or re-run the logic.
- **Subscription Status Verification**: Ensure the admin can see if a user's subscription and Pix integration are "functioning correctly" (Green/Red indicators).

### 3. Database/Backend Considerations (if necessary)
- Check if there's a table for logging webhook events or payment attempts.
- If not, I might need a migration to create a `payment_logs` or `webhook_events` table for better auditability.

## Technical Details

- **Files to modify**:
  - `src/components/CertificadoFAQ.tsx`: Clarify location/text.
  - `src/routes/admin.tsx`: Add a new tab for "Monitoramento / Pix".
  - `src/components/admin/PixMonitor.tsx`: (New Component) To handle the webhook/payment monitoring UI.
  - `src/integrations/supabase/types.ts`: Check for relevant tables.

## Verification Plan

- **UI Check**: Verify the new "Monitoramento" tab appears in `/admin`.
- **Functionality**: Simulate a failed webhook/payment and check if it appears in the logs with a "Reprocess" option.
- **FAQ Visibility**: Confirm the FAQ is easily found by the user in the expected app sections.
