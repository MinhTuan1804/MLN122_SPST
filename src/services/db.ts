import { supabase } from './supabase';
import type { GameSession, TurnState } from '../types/economy';

/**
 * Service handling all database operations with Supabase.
 * If Supabase is not connected (local mock mode), it falls back silently to mock resolutions.
 */
export const dbService = {
  /**
   * Generates or connects a game session.
   */
  async createSession(sessionCode: string): Promise<GameSession | null> {
    if (!supabase) {
      // Local Simulation Mock Session
      return {
        id: 'local_session_id',
        sessionCode,
        status: 'active',
        currentTurn: 1,
        phase: 'pick',
        eraYear: 1811,
        players: { capitalist: 'local_player', worker: 'local_ai' }
      };
    }

    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert([{ session_code: sessionCode, status: 'active', current_turn: 1, phase: 'pick' }])
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        sessionCode: data.session_code,
        status: data.status,
        currentTurn: data.current_turn,
        phase: data.phase,
        eraYear: data.era_year,
        players: {}
      };
    } catch (err) {
      console.error('Error creating session in Supabase:', err);
      return null;
    }
  },

  /**
   * Sends player card choice for turn resolution.
   */
  async submitCardChoice(
    sessionId: string,
    playerId: string,
    cardId: string,
    turnNumber: number
  ): Promise<boolean> {
    if (!supabase) {
      console.log(`[Offline Mode] Card ${cardId} selected for turn ${turnNumber}`);
      return true;
    }

    try {
      const { error } = await supabase
        .from('player_build')
        .insert([{
          session_id: sessionId,
          player_id: playerId,
          card_id: cardId,
          turn_picked: turnNumber
        }]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error submitting card choice:', err);
      return false;
    }
  },

  /**
   * Triggers the remote Edge Function `resolve_turn` to compute economic indicators.
   * If offline, the client computes local result.
   */
  async resolveTurnServer(
    sessionId: string,
    turnNumber: number
  ): Promise<TurnState | null> {
    if (!supabase) {
      // Local fallback handles computation directly in Zustand store
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('resolve_turn', {
        body: { session_id: sessionId, turn_number: turnNumber }
      });

      if (error) throw error;
      return data as TurnState;
    } catch (err) {
      console.error('Error invoking resolve_turn Edge Function:', err);
      return null;
    }
  },

  /**
   * AI Advisor RAG helper via Supabase Edge Function `advisor_rag`.
   */
  async getAdvisorAdvice(
    stateSnapshot: TurnState,
    question: string
  ): Promise<string> {
    if (!supabase) {
      // Return a rule-based offline advice template
      return getMockAdvice(stateSnapshot, question);
    }

    try {
      const { data, error } = await supabase.functions.invoke('advisor_rag', {
        body: { state: stateSnapshot, question }
      });

      if (error) throw error;
      return data.answer;
    } catch (err) {
      console.error('Error invoking advisor_rag Edge Function:', err);
      return 'Không thể kết nối với cố vấn. Vui lòng kiểm tra lại thiết lập Supabase.';
    }
  }
};

// Simple rule-based mock RAG advisor advice for offline mode
function getMockAdvice(state: TurnState, question: string): string {
  const mPrime = state.variableCapital > 0 ? Math.round((state.surplusValue / state.variableCapital) * 100) : 0;
  
  if (question.toLowerCase().includes('lương') || question.toLowerCase().includes('wages')) {
    return `[Cố Vấn Lịch Sử]: Tư bản khả biến (v = ${state.variableCapital} £) hiện tại chiếm khoảng ${Math.round((state.variableCapital / (state.constantCapital + state.variableCapital)) * 100)}% tổng vốn sản xuất. Tỷ suất thặng dư đạt ${mPrime}%. Cắt giảm quỹ lương sẽ gia tăng tích lũy tư bản nhanh chóng nhưng sẽ kích thích tỷ lệ mâu thuẫn xã hội (hiện tại: ${state.conflictRate}%) bùng phát đình công.`;
  }
  
  if (question.toLowerCase().includes('máy') || question.toLowerCase().includes('machine')) {
    return `[Cố Vấn Lịch Sử]: Cấu tạo hữu cơ tư bản hiện là c/v = ${state.organicComposition.toFixed(2)}. Nâng cấp máy móc bất biến (c = ${state.constantCapital} £) sẽ gia tăng đáng kể sản lượng thặng dư m, nhưng làm dôi dư lao động, dẫn tới sa thải và giảm sức bền xã hội của công nhân (hiện tại: ${state.workerHealth}% sức khỏe).`;
  }

  return `[Cố Vấn Lịch Sử]: Tỷ lệ mâu thuẫn xã hội ở mức ${state.conflictRate}%. Với các thông số kinh tế hiện tại (Tư bản: ${state.capital} £, Quỹ công đoàn: ${state.unionFund} £), ưu tiên hàng đầu là giữ cho Áp lực guồng máy dưới mức 80% để tránh nổi dậy vũ trang tự phát từ công đoàn.`;
}
