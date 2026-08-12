import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AsyncState } from '@/types/common';
import { isCmsConfigured, postSubscribe } from '@/api/cms';
import { newsletterSchema } from '@/lib/validation';

/**
 * Newsletter submission state.
 *
 * React Hook Form owns field values and validation; this slice owns only the
 * *outcome* of a submit, because the result is shown outside the form and must
 * survive a re-render of the form itself.
 *
 * The contact form does NOT use this slice — it holds its own submit state locally,
 * because that result is shown inside the same card. A `submitContactForm` thunk
 * used to live here for the never-built Express API; nothing ever dispatched it, so
 * it went with that API layer.
 */
export interface ContactState {
  newsletter: {
    status: AsyncState;
    message: string | null;
  };
}

const initialState: ContactState = {
  newsletter: { status: 'idle', message: null },
};

/**
 * Newsletter signup - a BROWSER-SIDE write.
 *
 * The thunk runs in the browser, so `postSubscribe` posts straight to
 * `https://cms.clovity.com/api/subscribes` and the request appears in a visitor's Network
 * tab. It used to go through a Server Action; the trade is the one that comes with every
 * browser write here - the POST carries `NEXT_PUBLIC_CMS_API_TOKEN`, so that token needs
 * `create` on `subscribe` and is readable in the bundle.
 *
 * Validation runs here rather than being trusted from the caller, and there is no server
 * hop left to re-check it - a hand-crafted POST bypasses this entirely, which is inherent
 * to writing from the client.
 */
export const subscribeToNewsletter = createAsyncThunk<
  { message: string },
  { email: string; source?: string },
  { rejectValue: { message: string } }
>('contact/subscribeNewsletter', async (payload, { rejectWithValue }) => {
  const parsed = newsletterSchema.safeParse({ email: payload.email });
  if (!parsed.success) {
    return rejectWithValue({
      message:
        parsed.error.issues[0]?.message ?? 'Enter a valid email address.',
    });
  }

  // No CMS configured - report success rather than surfacing our own deployment state to
  // a visitor. The address has at least been validated by this point.
  if (!isCmsConfigured()) return { message: 'Thank you for subscribing!' };

  try {
    await postSubscribe(parsed.data.email);
  } catch {
    return rejectWithValue({
      message: 'We could not sign you up just now. Please try again.',
    });
  }

  return { message: 'Thank you for subscribing!' };
});

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetNewsletter(state) {
      state.newsletter.status = 'idle';
      state.newsletter.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.newsletter.status = 'loading';
        state.newsletter.message = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state, action) => {
        state.newsletter.status = 'succeeded';
        state.newsletter.message = action.payload.message;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.newsletter.status = 'failed';
        state.newsletter.message =
          action.payload?.message ?? 'Subscription failed. Please try again.';
      });
  },
});

export const { resetNewsletter } = contactSlice.actions;
export const contactReducer = contactSlice.reducer;
