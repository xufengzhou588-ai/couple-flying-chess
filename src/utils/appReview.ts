import { InAppReview } from '@capacitor-community/in-app-review';
import { Capacitor } from '@capacitor/core';

const REVIEW_STATE_KEY = 'couple-flight-chess-review-state';
const REVIEW_COOLDOWN_MS = 120 * 24 * 60 * 60 * 1000;

interface ReviewState {
  completedGames: number;
  lastRequestedAt?: number;
}

function loadReviewState(): ReviewState {
  try {
    const stored = localStorage.getItem(REVIEW_STATE_KEY);
    if (!stored) return { completedGames: 0 };

    const parsed = JSON.parse(stored) as Partial<ReviewState>;
    return {
      completedGames: Number.isFinite(parsed.completedGames) ? parsed.completedGames || 0 : 0,
      lastRequestedAt: Number.isFinite(parsed.lastRequestedAt) ? parsed.lastRequestedAt : undefined
    };
  } catch {
    return { completedGames: 0 };
  }
}

function saveReviewState(state: ReviewState) {
  try {
    localStorage.setItem(REVIEW_STATE_KEY, JSON.stringify(state));
  } catch {
    // A review request should never interrupt the game if storage is unavailable.
  }
}

export async function requestReviewAfterCompletedGame() {
  const now = Date.now();
  const state = loadReviewState();
  const nextState: ReviewState = {
    completedGames: state.completedGames + 1,
    lastRequestedAt: state.lastRequestedAt
  };

  const cooldownElapsed =
    !state.lastRequestedAt || now - state.lastRequestedAt >= REVIEW_COOLDOWN_MS;

  if (Capacitor.getPlatform() !== 'ios' || !cooldownElapsed) {
    saveReviewState(nextState);
    return;
  }

  nextState.lastRequestedAt = now;
  saveReviewState(nextState);

  try {
    await InAppReview.requestReview();
  } catch {
    // iOS can decline to display the system prompt; gameplay should continue normally.
  }
}
