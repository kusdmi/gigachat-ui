import { Navigate } from 'react-router-dom';
import { ensureChatExists, useChatStore } from '../store/useChatStore';

/**
 * Редирект с `/` на активный чат.
 */
export default function RootRedirect() {
  ensureChatExists();
  const id = useChatStore((s) => s.activeChatId);
  if (!id) {
    return <div aria-busy="true">Загрузка…</div>;
  }
  return <Navigate to={`/chat/${id}`} replace />;
}
