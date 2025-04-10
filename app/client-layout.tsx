'use client'

import { useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Remove common browser extension injected attributes before hydration
    const attributesToRemove = [
      'fdprocessedid',
      'g_editable',
      'data-gramm',
      'data-gramm_id',
      'data-gramm_editor'
    ];
    
    attributesToRemove.forEach(attr => {
      document.querySelectorAll(`[${attr}]`).forEach(el => 
        el.removeAttribute(attr)
      );
    });
  }, [])

  return <>{children}</>
}