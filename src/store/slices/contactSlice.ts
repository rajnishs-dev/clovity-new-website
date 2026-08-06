import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { formsApi, type ContactSubmission } from '@/services/api/api';
import type { AsyncState } from '@/types/common';

/**
 * Contact + newsletter submission state.
 *
 * React Hook Form owns field values and validation; this slice owns only the
 * *outcome* of a submit, because the result is shown outside the form (success
 * banner, footer subscribe confirmation) and must survive a re-render of the
 * form itself.
 */
export interface ContactState {
  status: AsyncState;
  message: string | null;
  fieldErrors: Record<string, string[]>;
  /** Epoch ms of the last successful submit — drives the "already sent" UI. */
  lastSubmittedAt: number | null;
  newsletter: {
    status: AsyncState;
    message: string | null;
  };
}

const initialState: ContactState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
  lastSubmittedAt: null,
  newsletter: { status: 'idle', message: null },
};

export const submitContactForm = createAsyncThunk<
  { message: string },
  ContactSubmission,
  { rejectValue: { message: string; fieldErrors?: Record<string, string[]> } }
>('contact/submit', async (payload, { rejectWithValue }) => {
  const result = await formsApi.submitContact(payload);
  if (!result.success) {
    return rejectWithValue({
      message: result.message,
      ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
    });
  }
  return { message: 'Thanks — our team responds within one business day.' };
});

export const subscribeToNewsletter = createAsyncThunk<
  { message: string },
  { email: string; source?: string },
  { rejectValue: { message: string } }
>('contact/subscribeNewsletter', async (payload, { rejectWithValue }) => {
  const result = await formsApi.subscribeNewsletter(payload);
  if (!result.success) {
    return rejectWithValue({ message: result.message });
  }
  return { message: 'Thank you for subscribing!' };
});

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContactForm(state) {
      state.status = 'idle';
      state.message = null;
      state.fieldErrors = {};
    },
    resetNewsletter(state) {
      state.newsletter.status = 'idle';
      state.newsletter.message = null;
    },
    /**
     * Optimistic success used while no backend exists. The legacy newsletter
     * form did exactly this (preventDefault + show the thank-you), so the UX is
     * unchanged until the real endpoint is wired up.
     */
    markNewsletterSubscribedLocally(state) {
      state.newsletter.status = 'succeeded';
      state.newsletter.message = 'Thank you for subscribing!';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.status = 'loading';
        state.message = null;
        state.fieldErrors = {};
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
        state.lastSubmittedAt = action.meta.requestId ? Date.now() : null;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.status = 'failed';
        state.message =
          action.payload?.message ?? 'Something went wrong. Please try again.';
        state.fieldErrors = action.payload?.fieldErrors ?? {};
      })
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

export const {
  resetContactForm,
  resetNewsletter,
  markNewsletterSubscribedLocally,
} = contactSlice.actions;
export const contactReducer = contactSlice.reducer;
